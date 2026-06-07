import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, BarChart2 } from 'lucide-react';
import MarkAsPostedModal from './MarkAsPostedModal';
import UpdateEngagementModal from './UpdateEngagementModal';

export default function PostActionButton({ post, size = 'sm', className = '' }) {
  const [showMarkPosted, setShowMarkPosted] = useState(false);
  const [showUpdateEngagement, setShowUpdateEngagement] = useState(false);

  if (!post) return null;

  if (post.status === 'published') {
    return (
      <>
        <Button
          variant="outline"
          size={size}
          className={`text-xs ${className}`}
          onClick={(e) => { e.stopPropagation(); setShowUpdateEngagement(true); }}
        >
          <BarChart2 className="w-3 h-3 mr-1" /> Update Engagement
        </Button>
        <UpdateEngagementModal post={post} open={showUpdateEngagement} onClose={() => setShowUpdateEngagement(false)} />
      </>
    );
  }

  if (post.status === 'draft' || post.status === 'scheduled') {
    return (
      <>
        <Button
          variant="outline"
          size={size}
          className={`text-xs border-green-500 text-green-700 hover:bg-green-50 ${className}`}
          onClick={(e) => { e.stopPropagation(); setShowMarkPosted(true); }}
        >
          <CheckCircle2 className="w-3 h-3 mr-1" /> Mark as Posted
        </Button>
        <MarkAsPostedModal post={post} open={showMarkPosted} onClose={() => setShowMarkPosted(false)} />
      </>
    );
  }

  return null;
}