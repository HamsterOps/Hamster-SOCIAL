import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ContentTypeChart({ posts }) {
  const typeData = ['awareness', 'education', 'social_proof', 'hype', 'community'].map(type => {
    const typePosts = posts.filter(p => p.post_type === type && p.status === 'published');
    const avgEng = typePosts.length > 0
      ? typePosts.reduce((s, p) => s + (p.engagement_rate || 0), 0) / typePosts.length
      : 0;
    return {
      type: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      engagement: parseFloat(avgEng.toFixed(2)),
      count: typePosts.length,
    };
  });

  return (
    <Card className="p-4 border">
      <h3 className="text-sm font-medium mb-4">Content Type Performance</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={typeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="type" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="engagement" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}