import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CalendarHeader({
  currentDate, setCurrentDate, view, setView,
  platformFilter, setPlatformFilter, typeFilter, setTypeFilter, statusFilter, setStatusFilter
}) {
  const goMonth = (dir) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const goWeek = (dir) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + dir * 7);
    setCurrentDate(d);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => view === 'month' ? goMonth(-1) : goWeek(-1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="font-heading text-xl font-bold min-w-[160px] text-center">
          {format(currentDate, view === 'month' ? 'MMMM yyyy' : "'Week of' MMM d")}
        </h2>
        <Button variant="outline" size="icon" onClick={() => view === 'month' ? goMonth(1) : goWeek(1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="flex border rounded-lg overflow-hidden">
          <button onClick={() => setView('month')} className={`px-3 py-1.5 text-xs font-medium ${view === 'month' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}>Month</button>
          <button onClick={() => setView('week')} className={`px-3 py-1.5 text-xs font-medium ${view === 'week' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}>Week</button>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Platform" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="x">X</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Post Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="awareness">Awareness</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="social_proof">Social Proof</SelectItem>
            <SelectItem value="hype">Hype</SelectItem>
            <SelectItem value="community">Community</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}