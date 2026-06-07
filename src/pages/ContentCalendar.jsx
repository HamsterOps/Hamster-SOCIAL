import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import DayDetailPanel from '@/components/calendar/DayDetailPanel';

export default function ContentCalendar() {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedDay, setSelectedDay] = useState(null);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-scheduled_date', 200),
  });

  // Seed one example post on first load if no posts exist
  useEffect(() => {
    if (posts.length === 0) {
      const seeded = localStorage.getItem('hamster_example_post_seeded');
      if (!seeded) {
        base44.entities.Post.create({
          title: 'Example Post — Edit or Delete Me',
          caption: "This is a sample post to show you how the calendar works. Edit the caption, choose your platforms, set a schedule, and hit 'Schedule Post' or 'Mark as Posted' when done. 🐹",
          post_type: 'awareness',
          status: 'draft',
          platforms: ['instagram'],
          scheduled_date: format(new Date(), 'yyyy-MM-dd'),
        }).then(() => {
          localStorage.setItem('hamster_example_post_seeded', '1');
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        });
      }
    }
  }, [posts.length]);

  const filteredPosts = posts.filter(p => {
    if (platformFilter !== 'all' && !p.platforms?.includes(platformFilter)) return false;
    if (typeFilter !== 'all' && p.post_type !== typeFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const selectedDayPosts = selectedDay
    ? filteredPosts.filter(p => p.scheduled_date === format(selectedDay, 'yyyy-MM-dd'))
    : [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-heading font-bold">Content Calendar</h1>

      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
        platformFilter={platformFilter}
        setPlatformFilter={setPlatformFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <CalendarGrid
        currentDate={currentDate}
        posts={filteredPosts}
        view={view}
        onDayClick={setSelectedDay}
      />

      {selectedDay && (
        <DayDetailPanel
          day={selectedDay}
          posts={selectedDayPosts}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}