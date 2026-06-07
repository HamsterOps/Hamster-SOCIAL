import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, FileCheck, TrendingUp, UserPlus } from 'lucide-react';

const stats = [
  { label: 'Total Followers', icon: Users, key: 'followers' },
  { label: 'Posts This Month', icon: FileCheck, key: 'posts' },
  { label: 'Avg Engagement', icon: TrendingUp, key: 'engagement' },
  { label: 'Waitlist Signups', icon: UserPlus, key: 'waitlist' },
];

export default function StatsStrip({ data }) {
  const values = {
    followers: data.followers || 0,
    posts: data.posts || 0,
    engagement: data.engagement ? `${data.engagement}%` : '0%',
    waitlist: data.waitlist || 0,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, icon: Icon, key }) => (
        <Card key={key} className="p-4 border border-border/60 hover:border-border transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">{values[key]}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}