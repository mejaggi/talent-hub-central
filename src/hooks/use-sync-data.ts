import { useState, useCallback } from 'react';
import { syncAllData, type SyncResult } from '@/lib/api/sync-service';
import type { Training, UdemyLicense } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';

interface UseSyncDataReturn {
  trainings: Training[];
  licenses: UdemyLicense[];
  isSyncing: boolean;
  lastSyncedAt: string | null;
  triggerSync: () => Promise<void>;
}

/**
 * Hook to manage synced training data with manual refresh.
 * Initialises with null (no data loaded) until first sync or mount.
 */
export function useSyncData(initialTrainings: Training[] = [], initialLicenses: UdemyLicense[] = []): UseSyncDataReturn {
  const [trainings, setTrainings] = useState<Training[]>(initialTrainings);
  const [licenses, setLicenses] = useState<UdemyLicense[]>(initialLicenses);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const triggerSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result: SyncResult = await syncAllData();

      setTrainings(result.trainings);
      setLicenses(result.licenses);
      setLastSyncedAt(result.syncedAt);

      const udemyOk = result.sources.udemy.status === 'success';
      const csodOk = result.sources.csod.status === 'success';

      if (udemyOk && csodOk) {
        toast({
          title: 'Data synced successfully',
          description: `Pulled ${result.sources.udemy.trainings} Udemy and ${result.sources.csod.trainings} CSOD training records, plus ${result.sources.udemy.licenses} Udemy licenses.`,
        });
      } else {
        const errors: string[] = [];
        if (!udemyOk) errors.push(`Udemy: ${result.sources.udemy.error}`);
        if (!csodOk) errors.push(`CSOD: ${result.sources.csod.error}`);
        toast({
          title: 'Sync completed with errors',
          description: errors.join(' | '),
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Sync failed',
        description: err.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return { trainings, licenses, isSyncing, lastSyncedAt, triggerSync };
}
