import React from 'react';
import { Card } from '@/components/ui/card';

const platformLabels = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
  tiktok: 'TikTok',
};

export default function PostPreview({ caption, platforms, mediaUrls, hashtags }) {
  if (!platforms || platforms.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Select a platform to see preview
      </div>
    );
  }

  const fullCaption = caption + (hashtags?.length > 0 ? '\n\n' + hashtags.map(t => `#${t}`).join(' ') : '');

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Live Preview</h3>
      {platforms.map(p => (
        <Card key={p} className="p-4 border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">H</span>
            </div>
            <div>
              <p className="text-sm font-medium">Hamster</p>
              <p className="text-[10px] text-muted-foreground">{platformLabels[p]}</p>
            </div>
          </div>
          {mediaUrls?.length > 0 && (
            <div className="rounded-lg overflow-hidden mb-3 bg-muted aspect-video">
              <img src={mediaUrls[0]} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap line-clamp-6">
            {fullCaption || 'Your caption will appear here...'}
          </p>
        </Card>
      ))}
    </div>
  );
}