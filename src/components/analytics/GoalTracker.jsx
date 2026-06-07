import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const goals = [
  { label: '500 Waitlist Signups', target: 500, key: 'waitlist' },
  { label: '1,000 New Followers', target: 1000, key: 'followers' },
  { label: '4% Avg Engagement', target: 4, key: 'engagement' },
  { label: '30 Posts Published', target: 30, key: 'published' },
];

export default function GoalTracker({ data }) {
  return (
    <Card className="p-4 border">
      <h3 className="text-sm font-medium mb-4">Goal Tracker</h3>
      <div className="space-y-4">
        {goals.map(g => {
          const current = data[g.key] || 0;
          const pct = Math.min(Math.round((current / g.target) * 100), 100);
          return (
            <div key={g.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-foreground">{g.label}</span>
                <span className="text-xs font-medium text-primary">{pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
              <span className="text-[10px] text-muted-foreground">{current} / {g.target}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}