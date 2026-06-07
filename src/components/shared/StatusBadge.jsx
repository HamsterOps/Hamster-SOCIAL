import React from 'react';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  published: { label: 'Published', color: 'bg-green-100 text-green-700 border-green-200' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700 border-red-200' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, color: 'bg-muted text-muted-foreground' };
  return (
    <Badge variant="outline" className={`${config.color} font-medium text-xs`}>
      {config.label}
    </Badge>
  );
}