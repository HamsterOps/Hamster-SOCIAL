import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import PlatformBadge from '@/components/shared/PlatformBadge';
import PostTypeBadge from '@/components/shared/PostTypeBadge';
import { format } from 'date-fns';

export default function UpcomingPosts({ posts }) {
  return (
    <Card className="p-4 border border-border/60">
      <h3 className="text-sm font-medium text-foreground mb-3">Upcoming Posts</h3>
      {(!posts || posts.length === 0) ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No upcoming posts in queue</p>
      ) : (
        <div className="space-y-2.5">
          {posts.slice(0, 5).map((post) => (
            <div key={post.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{post.caption?.substring(0, 60)}...</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {post.platforms?.map(p => <PlatformBadge key={p} platform={p} size="xs" />)}
                  <PostTypeBadge type={post.post_type} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 pt-0.5">
                <Clock className="w-3 h-3" />
                {post.scheduled_date ? format(new Date(post.scheduled_date), 'MMM d') : 'Unscheduled'}
                {post.scheduled_time && ` ${post.scheduled_time}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}