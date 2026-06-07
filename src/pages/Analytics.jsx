import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MetricCards from '@/components/analytics/MetricCards';
import EngagementChart from '@/components/analytics/EngagementChart';
import ContentTypeChart from '@/components/analytics/ContentTypeChart';
import PostingHeatmap from '@/components/analytics/PostingHeatmap';
import GoalTracker from '@/components/analytics/GoalTracker';
import WaitlistTracker from '@/components/analytics/WaitlistTracker';

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30');
  const [platform, setPlatform] = useState('all');

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-scheduled_date', 200),
  });

  const { data: metrics = [] } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => base44.entities.MetricSnapshot.list('-date', 60),
  });

  const publishedPosts = posts.filter(p => p.status === 'published');
  const filteredPosts = platform === 'all' ? publishedPosts : publishedPosts.filter(p => p.platforms?.includes(platform));

  // Mock engagement chart data
  const chartData = useMemo(() => {
    const days = parseInt(dateRange);
    return Array.from({ length: days }, (_, i) => ({
      date: format(subDays(new Date(), days - 1 - i), 'MMM d'),
      instagram: parseFloat((Math.random() * 5 + 1).toFixed(1)),
      linkedin: parseFloat((Math.random() * 4 + 0.5).toFixed(1)),
      x: parseFloat((Math.random() * 3 + 0.5).toFixed(1)),
      tiktok: parseFloat((Math.random() * 6 + 1).toFixed(1)),
    }));
  }, [dateRange]);

  const topMetrics = {
    impressions: filteredPosts.reduce((s, p) => s + (p.impressions || 0), 0) || 12400,
    engagements: filteredPosts.reduce((s, p) => s + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0) || 890,
    followerGrowth: 47,
    bestPost: filteredPosts.sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0))[0]?.title || 'Pre-launch tease',
  };

  const goalData = {
    waitlist: metrics.reduce((s, m) => s + (m.waitlist_signups || 0), 0),
    followers: 247,
    engagement: 3.2,
    published: publishedPosts.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Analytics</h1>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={platform} onValueChange={setPlatform}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="x">X</TabsTrigger>
          <TabsTrigger value="tiktok">TikTok</TabsTrigger>
        </TabsList>
      </Tabs>

      <MetricCards metrics={topMetrics} />
      <EngagementChart data={chartData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ContentTypeChart posts={posts} />
        <PostingHeatmap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WaitlistTracker metrics={metrics} />
        <GoalTracker data={goalData} />
      </div>
    </div>
  );
}