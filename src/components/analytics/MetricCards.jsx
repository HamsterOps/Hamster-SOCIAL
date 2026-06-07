import React from 'react';
import { Card } from '@/components/ui/card';
import { Eye, Heart, TrendingUp, Star } from 'lucide-react';

export default function MetricCards({ metrics }) {
  const cards = [
    { label: 'Total Impressions', value: metrics.impressions?.toLocaleString() || '0', icon: Eye },
    { label: 'Total Engagements', value: metrics.engagements?.toLocaleString() || '0', icon: Heart },
    { label: 'Follower Growth', value: metrics.followerGrowth ? `+${metrics.followerGrowth}` : '0', icon: TrendingUp },
    { label: 'Best Post', value: metrics.bestPost || 'N/A', icon: Star, small: true },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ label, value, icon: Icon, small }) => (
        <Card key={label} className="p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
          <p className={`font-heading font-bold ${small ? 'text-sm' : 'text-xl'}`}>{value}</p>
        </Card>
      ))}
    </div>
  );
}