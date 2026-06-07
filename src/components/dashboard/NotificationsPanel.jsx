import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

const iconMap = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
  error: XCircle,
};

const colorMap = {
  warning: 'text-amber-500',
  info: 'text-blue-500',
  success: 'text-green-500',
  error: 'text-red-500',
};

export default function NotificationsPanel({ notifications }) {
  return (
    <Card className="p-4 border border-border/60">
      <h3 className="text-sm font-medium text-foreground mb-3">Notifications</h3>
      {(!notifications || notifications.length === 0) ? (
        <p className="text-sm text-muted-foreground py-4 text-center">You're all caught up! 🎉</p>
      ) : (
        <div className="space-y-2">
          {notifications.slice(0, 5).map((n) => {
            const Icon = iconMap[n.type] || Info;
            return (
              <div key={n.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg ${n.is_read ? 'opacity-60' : 'bg-muted/40'}`}>
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${colorMap[n.type] || 'text-muted-foreground'}`} />
                <p className="text-sm text-foreground">{n.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}