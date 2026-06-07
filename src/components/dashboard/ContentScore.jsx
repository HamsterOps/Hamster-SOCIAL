import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function ContentScore({ filled, total }) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;

  return (
    <Card className="p-4 border border-border/60">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-foreground">This Week's Content</h3>
        <span className="text-sm font-heading font-bold text-primary">{filled}/{total} slots</span>
      </div>
      <Progress value={pct} className="h-2" />
      <p className="text-xs text-muted-foreground mt-1.5">
        {pct === 100 ? "All slots filled — you're on fire! 🔥" : `${total - filled} more post${total - filled !== 1 ? 's' : ''} needed this week`}
      </p>
    </Card>
  );
}