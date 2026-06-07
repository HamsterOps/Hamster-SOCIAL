import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function EngagementChart({ data }) {
  return (
    <Card className="p-4 border">
      <h3 className="text-sm font-medium mb-4">Engagement Rate Over Time</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="instagram" stroke="#f97316" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="linkedin" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="x" stroke="#6b7280" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="tiktok" stroke="#a855f7" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}