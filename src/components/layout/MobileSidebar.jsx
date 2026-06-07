import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, PenSquare, Library, Zap,
  BarChart3, BookOpen, Settings, Moon, Sun, X
} from 'lucide-react';
import HamsterIcon from './HamsterIcon';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/compose', label: 'Compose', icon: PenSquare },
  { path: '/library', label: 'Library', icon: Library },
  { path: '/automation', label: 'Automation', icon: Zap },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/brand-voice', label: 'Brand Voice', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function MobileSidebar({ open, onClose, darkMode, setDarkMode }) {
  const location = useLocation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HamsterIcon size={32} className="text-primary-foreground opacity-90" />
            <h1 className="font-display text-lg font-bold text-sidebar-primary">Hamster</h1>
          </div>
          <button onClick={onClose} className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
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

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground w-full"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>
    </div>
  );
}