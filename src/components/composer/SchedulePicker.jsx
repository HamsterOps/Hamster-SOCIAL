import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const bestTimes = {
  instagram: ['9:00 AM', '6:00 PM'],
  linkedin: ['8:00 AM', '12:00 PM'],
  x: ['8:00 AM', '5:00 PM'],
  tiktok: ['7:00 PM', '9:00 PM'],
};

export default function SchedulePicker({ date, setDate, time, setTime, platforms }) {
  const suggestions = platforms?.flatMap(p => (bestTimes[p] || []).map(t => `${p}: ${t}`)) || [];
  const uniqueSuggestions = [...new Set(suggestions)];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Schedule</label>
      <div className="flex gap-3">
        <Input type="date" value={date || ''} onChange={(e) => setDate(e.target.value)} className="flex-1" />
        <Input type="time" value={time || ''} onChange={(e) => setTime(e.target.value)} className="w-36" />
      </div>
      {uniqueSuggestions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> Best times to post:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {uniqueSuggestions.map(s => (
              <Badge key={s} variant="outline" className="text-xs cursor-default">{s}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}