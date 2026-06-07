import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, subDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, Eye, Zap } from 'lucide-react';

const PLATFORMS = ['instagram', 'linkedin', 'x', 'tiktok'];

const PLATFORM_COLORS = {
  instagram: '#e1306c',
  linkedin: '#0077b5',
  x: '#14171a',
  tiktok: '#69c9d0',
};

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X',
  tiktok: 'TikTok',
};

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-heading font-bold">{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function PlatformLineChart({ title, dataKey, data, formatter, yLabel }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatter} width={40} />
            <Tooltip formatter={(v, name) => [formatter(v), PLATFORM_LABELS[name] || name]} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            {PLATFORMS.map(p => (
              <Line
                key={p}
                type="monotone"
                dataKey={p}
                stroke={PLATFORM_COLORS[p]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name={p}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default function MetricsDashboard() {
  const [days, setDays] = useState('30');

  const { data: snapshots = [], isLoading } = useQuery({
    queryKey: ['metric-snapshots'],
    queryFn: () => base44.entities.MetricSnapshot.list('-date', 500),
  });

  // Build daily chart rows pivoted by platform
  const chartData = useMemo(() => {
    const cutoff = subDays(new Date(), parseInt(days));
    const filtered = snapshots.filter(s => s.platform !== 'all' && parseISO(s.date) >= cutoff);

    // Group by date
    const byDate = {};
    filtered.forEach(s => {
      if (!byDate[s.date]) byDate[s.date] = { date: s.date };
      byDate[s.date][s.platform] = s;
    });

    return Object.values(byDate)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(row => ({
        date: format(parseISO(row.date), 'MMM d'),
        ...Object.fromEntries(
          PLATFORMS.map(p => [p, row[p]?.engagement_rate ?? null])
        ),
      }));
  }, [snapshots, days]);

  const followerData = useMemo(() => {
    const cutoff = subDays(new Date(), parseInt(days));
    const filtered = snapshots.filter(s => s.platform !== 'all' && parseISO(s.date) >= cutoff);
    const byDate = {};
    filtered.forEach(s => {
      if (!byDate[s.date]) byDate[s.date] = { date: s.date };
      byDate[s.date][s.platform] = s;
    });
    return Object.values(byDate)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(row => ({
        date: format(parseISO(row.date), 'MMM d'),
        ...Object.fromEntries(
          PLATFORMS.map(p => [p, row[p]?.followers ?? null])
        ),
      }));
  }, [snapshots, days]);

  const impressionsData = useMemo(() => {
    const cutoff = subDays(new Date(), parseInt(days));
    const filtered = snapshots.filter(s => s.platform !== 'all' && parseISO(s.date) >= cutoff);
    const byDate = {};
    filtered.forEach(s => {
      if (!byDate[s.date]) byDate[s.date] = { date: s.date };
      byDate[s.date][s.platform] = s;
    });
    return Object.values(byDate)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(row => ({
        date: format(parseISO(row.date), 'MMM d'),
        ...Object.fromEntries(
          PLATFORMS.map(p => [p, row[p]?.impressions ?? null])
        ),
      }));
  }, [snapshots, days]);

  // Summary stats across all platforms
  const allSnapshots = useMemo(() => {
    const cutoff = subDays(new Date(), parseInt(days));
    return snapshots.filter(s => s.platform !== 'all' && parseISO(s.date) >= cutoff);
  }, [snapshots, days]);

  const totalImpressions = allSnapshots.reduce((s, m) => s + (m.impressions || 0), 0);
  const totalEngagements = allSnapshots.reduce((s, m) => s + (m.engagements || 0), 0);
  const totalFollowers = useMemo(() => {
    // Latest follower count per platform
    const latest = {};
    allSnapshots.forEach(s => {
      if (!latest[s.platform] || s.date > latest[s.platform].date) latest[s.platform] = s;
    });
    return Object.values(latest).reduce((sum, s) => sum + (s.followers || 0), 0);
  }, [allSnapshots]);
  const avgEngRate = allSnapshots.length
    ? (allSnapshots.reduce((s, m) => s + (m.engagement_rate || 0), 0) / allSnapshots.length).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Metrics Dashboard</h1>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-36 h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="60">Last 60 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Loading metrics…</div>
      ) : (
        <>
          {/* Summary stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Eye} label="Total Impressions" value={totalImpressions.toLocaleString()} color="bg-primary" />
            <StatCard icon={Zap} label="Total Engagements" value={totalEngagements.toLocaleString()} color="bg-accent" />
            <StatCard icon={Users} label="Total Followers" value={totalFollowers.toLocaleString()} color="bg-chart-4" />
            <StatCard icon={TrendingUp} label="Avg Engagement Rate" value={`${avgEngRate}%`} color="bg-chart-5" />
          </div>

          {/* Engagement rate comparison — the primary chart */}
          <PlatformLineChart
            title="Engagement Rate by Platform (%)"
            dataKey="engagement_rate"
            data={chartData}
            formatter={v => (v == null ? '–' : `${v}%`)}
          />

          {/* Secondary charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PlatformLineChart
              title="Followers by Platform"
              dataKey="followers"
              data={followerData}
              formatter={v => (v == null ? '–' : v.toLocaleString())}
            />
            <PlatformLineChart
              title="Impressions by Platform"
              dataKey="impressions"
              data={impressionsData}
              formatter={v => (v == null ? '–' : v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
            />
          </div>
        </>
      )}
    </div>
  );
}