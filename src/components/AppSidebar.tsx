import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Trophy, AlertTriangle, Sun, Moon, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/udemy-licenses', icon: BookOpen, label: 'Udemy Licenses' },
  { to: '/top-learners', icon: Trophy, label: 'Top Learners' },
  { to: '/incomplete-trainings', icon: AlertTriangle, label: 'Incomplete Trainings' },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">TMD Portal</h1>
          <p className="text-xs text-sidebar-muted">Learning Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}
