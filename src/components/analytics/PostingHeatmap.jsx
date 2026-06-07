import React from 'react';
import { Card } from '@/components/ui/card';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = ['6am', '9am', '12pm', '3pm', '6pm', '9pm'];

export default function PostingHeatmap() {
  // Generate mock heatmap data
  const data = days.map(() => hours.map(() => Math.random()));

  const getColor = (val) => {
    if (val > 0.8) return 'bg-primary';
    if (val > 0.6) return 'bg-primary/70';
    if (val > 0.4) return 'bg-primary/40';
    if (val > 0.2) return 'bg-primary/20';
    return 'bg-muted';
  };

  return (
    <Card className="p-4 border">
      <h3 className="text-sm font-medium mb-4">Best Posting Times</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th></th>
              {hours.map(h => <th key={h} className="text-[10px] text-muted-foreground font-normal px-1 pb-1">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {days.map((day, di) => (
              <tr key={day}>
                <td className="text-[10px] text-muted-foreground pr-2 py-0.5">{day}</td>
                {hours.map((_, hi) => (
                  <td key={hi} className="px-0.5 py-0.5">
                    <div className={`w-8 h-6 rounded ${getColor(data[di][hi])}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}