import { createContext, useContext, type ReactNode } from 'react';
import { useSyncData } from '@/hooks/use-sync-data';
import { mockTrainings, mockUdemyLicenses, mockTopLearners } from '@/lib/mock-data';
import type { Training, UdemyLicense, TopLearner } from '@/lib/mock-data';

interface SyncContextValue {
  trainings: Training[];
  licenses: UdemyLicense[];
  topLearners: TopLearner[];
  isSyncing: boolean;
  lastSyncedAt: string | null;
  triggerSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const { trainings, licenses, isSyncing, lastSyncedAt, triggerSync } = useSyncData(mockTrainings, mockUdemyLicenses);

  // Derive top learners from current trainings data
  const topLearners: TopLearner[] = deriveTopLearners(trainings);

  return (
    <SyncContext.Provider value={{ trainings, licenses, topLearners, isSyncing, lastSyncedAt, triggerSync }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSyncContext() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSyncContext must be used within SyncProvider');
  return ctx;
}

/** Derive top learners from training records */
function deriveTopLearners(trainings: Training[]): TopLearner[] {
  const map = new Map<string, { name: string; email: string; dept: string; courses: number; hours: number; source: Training['source'] }>();
  
  for (const t of trainings) {
    if (t.status !== 'Completed') continue;
    const existing = map.get(t.employeeEmail);
    if (existing) {
      existing.courses++;
      existing.hours += t.hoursConsumed;
    } else {
      map.set(t.employeeEmail, {
        name: t.employeeName,
        email: t.employeeEmail,
        dept: t.department,
        courses: 1,
        hours: t.hoursConsumed,
        source: t.source,
      });
    }
  }

  return Array.from(map.entries())
    .map(([email, d], i) => ({
      id: `TL-${i + 1}`,
      employeeName: d.name,
      employeeEmail: email,
      department: d.dept,
      coursesCompleted: d.courses,
      totalHours: Math.round(d.hours * 10) / 10,
      source: d.source,
      avatar: d.name.split(' ').map(n => n[0]).join(''),
      streak: Math.floor(Math.random() * 30),
    }))
    .sort((a, b) => b.totalHours - a.totalHours)
    .slice(0, 15);
}
