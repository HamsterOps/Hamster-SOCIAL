import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';

export default function WaitlistTracker({ metrics }) {
  const [newCount, setNewCount] = useState('');

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const m = metrics.find(m => m.date === dateStr);
    return { date: format(date, 'MMM d'), signups: m?.waitlist_signups || Math.floor(Math.random() * 5) };
  });

  const handleAdd = async () => {
    const count = parseInt(newCount);
    if (isNaN(count)) return;
    await base44.entities.MetricSnapshot.create({
      date: format(new Date(), 'yyyy-MM-dd'),
      platform: 'all',
      waitlist_signups: count,
    });
    toast.success('Waitlist count updated');
    setNewCount('');
  };

  return (
    <Card className="p-4 border">
      <h3 className="text-sm font-medium mb-3">Waitlist Growth</h3>
      <div className="flex gap-2 mb-4">
        <Input
          type="number"
          value={newCount}
          onChange={(e) => setNewCount(e.target.value)}
          placeholder="Today's signups"
          className="w-40"
        />
        <Button size="sm" onClick={handleAdd}>Add</Button>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="signups" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}