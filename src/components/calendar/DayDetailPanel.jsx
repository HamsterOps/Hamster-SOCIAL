import React from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PlatformBadge from '@/components/shared/PlatformBadge';
import PostTypeBadge from '@/components/shared/PostTypeBadge';
import StatusBadge from '@/components/shared/StatusBadge';
import PostActionButton from '@/components/posts/PostActionButton';

export default function DayDetailPanel({ day, posts, onClose }) {
  const navigate = useNavigate();

  if (!day) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-heading font-bold text-lg">{format(day, 'EEEE, MMMM d')}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-3xl">🐹</span>
            <p className="text-sm text-muted-foreground mt-2">No posts scheduled for this day</p>
            <Button
              className="mt-4"
              size="sm"
              onClick={() => navigate(`/compose?date=${format(day, 'yyyy-MM-dd')}`)}
            >
              Add Post
            </Button>
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              className="p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
              onClick={() => navigate(`/compose?edit=${post.id}`)}
            >
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm">{post.title}</h4>
                <StatusBadge status={post.status} />
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.caption}</p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {post.platforms?.map(p => <PlatformBadge key={p} platform={p} size="xs" />)}
                <PostTypeBadge type={post.post_type} />
                {post.scheduled_time && (
                  <span className="text-[10px] text-muted-foreground ml-auto">{post.scheduled_time}</span>
                )}
              </div>
              <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                <PostActionButton post={post} size="sm" />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <Button
          className="w-full"
          onClick={() => navigate(`/compose?date=${format(day, 'yyyy-MM-dd')}`)}
        >
          + Add Post for {format(day, 'MMM d')}
        </Button>
      </div>
    </div>
  );
}