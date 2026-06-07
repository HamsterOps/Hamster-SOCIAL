import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function UpdateEngagementModal({ post, open, onClose }) {
  const queryClient = useQueryClient();
  const [likes, setLikes] = useState(post?.likes || '');
  const [comments, setComments] = useState(post?.comments || '');
  const [shares, setShares] = useState(post?.shares || '');
  const [impressions, setImpressions] = useState(post?.impressions || '');

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.Post.update(post.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Engagement updated!');
      onClose();
    },
  });

  const handleSave = () => {
    const total = (Number(likes) || 0) + (Number(comments) || 0) + (Number(shares) || 0);
    const engRate = impressions ? ((total / Number(impressions)) * 100).toFixed(2) : 0;
    mutation.mutate({
      likes: Number(likes) || 0,
      comments: Number(comments) || 0,
      shares: Number(shares) || 0,
      impressions: Number(impressions) || 0,
      engagement_rate: Number(engRate),
    });
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Engagement</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground line-clamp-1">{post.title}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Likes</label>
            <Input type="number" value={likes} onChange={(e) => setLikes(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Comments</label>
            <Input type="number" value={comments} onChange={(e) => setComments(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Shares</label>
            <Input type="number" value={shares} onChange={(e) => setShares(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Impressions</label>
            <Input type="number" value={impressions} onChange={(e) => setImpressions(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}