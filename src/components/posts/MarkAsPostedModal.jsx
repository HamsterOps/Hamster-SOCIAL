import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ALL_PLATFORMS = ['instagram', 'linkedin', 'x', 'tiktok'];

export default function MarkAsPostedModal({ post, open, onClose }) {
  const queryClient = useQueryClient();
  const [publishedDate, setPublishedDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [selectedPlatforms, setSelectedPlatforms] = useState(post?.platforms || []);
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [shares, setShares] = useState('');
  const [impressions, setImpressions] = useState('');

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.Post.update(post.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post marked as published!');
      onClose();
    },
  });

  const handleConfirm = () => {
    const updates = {
      status: 'published',
      published_date: new Date(publishedDate).toISOString(),
      platforms: selectedPlatforms,
    };
    if (likes) updates.likes = Number(likes);
    if (comments) updates.comments = Number(comments);
    if (shares) updates.shares = Number(shares);
    if (impressions) updates.impressions = Number(impressions);
    mutation.mutate(updates);
  };

  const togglePlatform = (p) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Mark as Posted</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-medium line-clamp-1">{post.title}</p>

          <div>
            <label className="text-xs text-muted-foreground">Platforms Published On</label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {ALL_PLATFORMS.map(p => (
                <label key={p} className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <Checkbox checked={selectedPlatforms.includes(p)} onCheckedChange={() => togglePlatform(p)} />
                  <span className="capitalize">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Date & Time Posted</label>
            <Input type="datetime-local" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Engagement Data (optional — fill in later)</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground">Likes</label>
                <Input type="number" value={likes} onChange={(e) => setLikes(e.target.value)} placeholder="0" className="h-8 text-xs" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground">Comments</label>
                <Input type="number" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="0" className="h-8 text-xs" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground">Shares</label>
                <Input type="number" value={shares} onChange={(e) => setShares(e.target.value)} placeholder="0" className="h-8 text-xs" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground">Impressions</label>
                <Input type="number" value={impressions} onChange={(e) => setImpressions(e.target.value)} placeholder="0" className="h-8 text-xs" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleConfirm} disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Confirm Posted'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}