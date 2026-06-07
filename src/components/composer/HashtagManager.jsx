import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export default function HashtagManager({ hashtags, setHashtags, platforms }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim().replace(/^#/, '');
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setInput('');
    }
  };

  const removeTag = (tag) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const overLimit = platforms?.includes('instagram') && hashtags.length > 30;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Hashtags</label>
        <span className={`text-xs ${overLimit ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
          {hashtags.length} tags {overLimit && '(Instagram max: 30)'}
        </span>
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder="Add hashtag and press Enter"
          className="flex-1"
        />
      </div>
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {hashtags.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1 cursor-pointer hover:bg-destructive/10" onClick={() => removeTag(tag)}>
              #{tag}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}