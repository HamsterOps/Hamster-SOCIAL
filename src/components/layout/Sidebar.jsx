import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  LayoutDashboard,
  Calendar,
  PenSquare,
  Library,
  Zap,
  BarChart3,
  Activity,
  BookOpen,
  Settings,
  Info,
  Mail,
  Moon,
  Sun
} from 'lucide-react';
import HamsterIcon from './HamsterIcon';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/compose', label: 'Compose', icon: PenSquare },
  { path: '/library', label: 'Library', icon: Library },
  { path: '/automation', label: 'Automation', icon: Zap },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/metrics', label: 'Metrics', icon: Activity },
  { path: '/brand-voice', label: 'Brand Voice', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'About', icon: Info },
  { path: '/contact', label: 'Contact', icon: Mail },
];

export default function Sidebar({ darkMode, setDarkMode }) {
  const location = useLocation();
  const { data: user } = useQuery({ queryKey: ['current-user'], queryFn: () => base44.auth.me() });
  const initials = (user?.full_name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50">
      {/* Logo area */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2.5">
          <HamsterIcon size={36} className="text-primary-foreground opacity-90" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-sidebar-primary">
              Hamster
            </h1>
          </div>
        </div>
        <p className="text-[11px] italic text-sidebar-foreground/50 mt-1.5 pl-0.5">
          For businesses that never stop.
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Dark mode toggle */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {user && (
          <Link to="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-bold">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user.full_name || 'My Account'}</p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">{user.email}</p>
            </div>
          </Link>
        )}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 w-full transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  );
}