import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

const themes = [
  { id: 'light' as const, label: 'Light', icon: Sun, description: 'Clean light interface' },
  { id: 'dark' as const, label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
];

export default function Preferences() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Preferences</h1>
        <p className="text-sm text-muted-foreground">Customize your portal experience</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Theme</h2>
        <div className="grid grid-cols-2 gap-4">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                'flex items-center gap-4 rounded-xl border-2 p-4 transition-all',
                theme === t.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30'
              )}
            >
              <div className={cn('rounded-lg p-2.5', theme === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                <t.icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-card-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-3">
        <h2 className="text-lg font-semibold text-card-foreground">About</h2>
        <p className="text-sm text-muted-foreground">
          TMD Learning Portal v1.0 — Consolidating training data from Udemy Business and Cornerstone Learning (CSOD) for the Training Management & Development team.
        </p>
      </div>
    </div>
  );
}
