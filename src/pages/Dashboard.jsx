import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format, isToday, isAfter } from 'date-fns';
import StatsStrip from '@/components/dashboard/StatsStrip';
import ContentScore from '@/components/dashboard/ContentScore';
import TodaysPosts from '@/components/dashboard/TodaysPosts';
import UpcomingPosts from '@/components/dashboard/UpcomingPosts';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';

const taglines = [
  "Keep the wheel spinning. 🐹",
  "Your business never sleeps — neither does your content.",
  "Small steps, big reach. Let's go.",
];

export default function Dashboard() {
  const tagline = useMemo(() => taglines[Math.floor(Math.random() * taglines.length)], []);

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-scheduled_date', 100),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => base44.entities.Notification.list('-created_date', 10),
  });

  const { data: metrics = [] } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => base44.entities.MetricSnapshot.list('-date', 30),
  });

  const { data: socialAccounts = [] } = useQuery({
    queryKey: ['social-accounts'],
    queryFn: () => base44.entities.SocialAccount.list(),
  });

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayPosts = posts.filter(p => p.scheduled_date === todayStr);
  const upcomingPosts = posts
    .filter(p => p.scheduled_date && isAfter(new Date(p.scheduled_date), new Date()) && p.status !== 'published')
    .slice(0, 5);

  // Week content score: how many of the 5 weekly slots are scheduled/published
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekPosts = posts.filter(p => {
    if (!p.scheduled_date) return false;
    const d = new Date(p.scheduled_date);
    return d >= weekStart && d <= weekEnd && (p.status === 'scheduled' || p.status === 'published');
  });

  // Stats
  const latestMetric = metrics[0] || {};
  const publishedThisMonth = posts.filter(p => {
    if (p.status !== 'published' || !p.published_date) return false;
    return new Date(p.published_date).getMonth() === now.getMonth();
  }).length;

  const totalFollowers = socialAccounts.reduce((sum, a) => sum + (a.follower_count || 0), 0);
  const publishedPosts = posts.filter(p => p.status === 'published');
  const avgEngRate = publishedPosts.length
    ? (publishedPosts.reduce((s, p) => s + (p.engagement_rate || 0), 0) / publishedPosts.length).toFixed(1)
    : (latestMetric.engagement_rate || 0);

  const statsData = {
    followers: totalFollowers || latestMetric.followers || 0,
    posts: publishedThisMonth || publishedPosts.length,
    engagement: Number(avgEngRate),
    waitlist: latestMetric.waitlist_signups || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1 italic">{tagline}</p>
      </div>

      {/* Stats strip */}
      <StatsStrip data={statsData} />

      {/* Content score + Today's posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-4">
          <ContentScore filled={Math.min(weekPosts.length, 5)} total={5} />
          <NotificationsPanel notifications={notifications} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <TodaysPosts posts={todayPosts} />
          <UpcomingPosts posts={upcomingPosts} />
        </div>
      </div>
    </div>
  );
}