import { Outlet } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import AppSidebar from './AppSidebar';
import { Button } from '@/components/ui/button';

export default function AppLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <header className="flex items-center justify-end px-6 lg:px-8 pt-4">
          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </header>
        <main className="flex-1 px-6 lg:px-8 pb-6 lg:pb-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
