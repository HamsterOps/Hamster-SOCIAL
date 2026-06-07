import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const platformChipColors = {
  instagram: 'bg-orange-400',
  linkedin: 'bg-blue-500',
  x: 'bg-gray-400',
  tiktok: 'bg-purple-400',
};

export default function CalendarGrid({ currentDate, posts, view, onDayClick }) {
  const navigate = useNavigate();

  const getWeekDays = () => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  };

  const days = view === 'week' ? getWeekDays() : getMonthDays();

  const getPostsForDay = (day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return posts.filter(p => p.scheduled_date === dayStr);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      {/* Day headers */}
      <div className="grid grid-cols-7 bg-muted/50">
        {dayNames.map(d => (
          <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground border-b">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const dayPosts = getPostsForDay(day);
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);

          return (
            <div
              key={idx}
              onClick={() => onDayClick(day)}
              className={`min-h-[90px] md:min-h-[110px] p-1.5 border-b border-r cursor-pointer transition-colors hover:bg-muted/30 ${
                !inMonth ? 'opacity-40 bg-muted/10' : ''
              } ${today ? 'bg-primary/5' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${today ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' : 'text-muted-foreground'}`}>
                  {format(day, 'd')}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/compose?date=${format(day, 'yyyy-MM-dd')}`);
                  }}
                  className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-0.5">
                {dayPosts.slice(0, 3).map(post => (
                  <div key={post.id} className="flex items-center gap-1">
                    {post.platforms?.slice(0, 2).map(p => (
                      <div key={p} className={`w-2 h-2 rounded-full ${platformChipColors[p] || 'bg-gray-300'}`} />
                    ))}
                    <span className="text-[10px] text-foreground/70 truncate">{post.title}</span>
                  </div>
                ))}
                {dayPosts.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">+{dayPosts.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}