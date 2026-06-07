import React from 'react';
import { Textarea } from '@/components/ui/textarea';

const charLimits = {
  instagram: 2200,
  linkedin: 3000,
  x: 280,
  tiktok: 2200,
};

export default function CaptionEditor({ caption, setCaption, platforms }) {
  const len = caption?.length || 0;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Caption</label>
      <Textarea
        value={caption || ''}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Write your caption here..."
        className="min-h-[160px] resize-y"
      />
      <div className="flex flex-wrap gap-3">
        {platforms?.map(p => {
          const limit = charLimits[p] || 2200;
          const over = len > limit;
          return (
            <span key={p} className={`text-xs ${over ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
              {p}: {len}/{limit} {over && '⚠'}
            </span>
          );
        })}
      </div>
    </div>
  );
}