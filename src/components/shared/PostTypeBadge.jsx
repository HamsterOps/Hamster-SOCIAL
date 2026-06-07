import React from 'react';
import { Badge } from '@/components/ui/badge';

const postTypeConfig = {
  awareness: { label: 'Awareness', color: 'bg-teal-500/15 text-teal-700 border-teal-200' },
  education: { label: 'Education', color: 'bg-blue-500/15 text-blue-700 border-blue-200' },
  social_proof: { label: 'Social Proof', color: 'bg-orange-500/15 text-orange-700 border-orange-200' },
  hype: { label: 'Hype', color: 'bg-purple-500/15 text-purple-700 border-purple-200' },
  community: { label: 'Community', color: 'bg-pink-500/15 text-pink-700 border-pink-200' },
};

export default function PostTypeBadge({ type }) {
  const config = postTypeConfig[type] || { label: type, color: 'bg-muted text-muted-foreground' };
  return (
    <Badge variant="outline" className={`${config.color} font-medium text-xs`}>
      {config.label}
    </Badge>
  );
}

export { postTypeConfig };