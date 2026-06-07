import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import PlatformBadge from '@/components/shared/PlatformBadge';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';

export default function TodaysPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <Card className="p-4 border border-border/60">
        <h3 className="text-sm font-medium text-foreground mb-4">Today's Posts</h3>
        <EmptyState
          title="No posts today"
          description="Nothing scheduled for today. Head to the calendar to plan your day."
        />
      </Card>
    );
  }

  return (
    <Card className="p-4 border border-border/60">
      <h3 className="text-sm font-medium text-foreground mb-3">Today's Posts</h3>
      <div className="space-y-2.5">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
              <div className="flex items-center gap-2 mt-1">
                {post.platforms?.map(p => <PlatformBadge key={p} platform={p} size="xs" />)}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {post.scheduled_time && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.scheduled_time}
                </span>
              )}
              <StatusBadge status={post.status} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}