/**
 * Sync Service — Orchestrates bulk data pull from Udemy Business and CSOD
 * 
 * Currently uses mock data. Once Lovable Cloud is enabled and API credentials
 * are added, this will call edge functions that hit the real APIs.
 * 
 * Architecture:
 *   Browser → syncAllData() → fetchUdemyTrainings() + fetchCSODTrainings()
 *                              ↓ (when Cloud is ready)
 *                            Edge Functions → Udemy API / CSOD API
 */

import { fetchUdemyTrainings } from './udemy-api';
import { fetchCSODTrainings } from './csod-api';
import { fetchUdemyLicenses } from './udemy-api';
import type { Training, UdemyLicense } from '@/lib/mock-data';

export interface SyncResult {
  trainings: Training[];
  licenses: UdemyLicense[];
  syncedAt: string;
  sources: {
    udemy: { trainings: number; licenses: number; status: 'success' | 'error'; error?: string };
    csod: { trainings: number; status: 'success' | 'error'; error?: string };
  };
}

/**
 * Pull all data from both Udemy Business and CSOD in bulk.
 * Each source is fetched independently so one failure doesn't block the other.
 */
export async function syncAllData(): Promise<SyncResult> {
  const result: SyncResult = {
    trainings: [],
    licenses: [],
    syncedAt: new Date().toISOString(),
    sources: {
      udemy: { trainings: 0, licenses: 0, status: 'success' },
      csod: { trainings: 0, status: 'success' },
    },
  };

  // Fetch from both sources concurrently — each wrapped in its own try/catch
  const [udemyResult, csodResult, licensesResult] = await Promise.allSettled([
    fetchUdemyTrainings(),
    fetchCSODTrainings(),
    fetchUdemyLicenses(),
  ]);

  // Process Udemy trainings
  if (udemyResult.status === 'fulfilled') {
    result.trainings.push(...udemyResult.value);
    result.sources.udemy.trainings = udemyResult.value.length;
  } else {
    result.sources.udemy.status = 'error';
    result.sources.udemy.error = udemyResult.reason?.message || 'Unknown error';
  }

  // Process CSOD trainings
  if (csodResult.status === 'fulfilled') {
    result.trainings.push(...csodResult.value);
    result.sources.csod.trainings = csodResult.value.length;
  } else {
    result.sources.csod.status = 'error';
    result.sources.csod.error = csodResult.reason?.message || 'Unknown error';
  }

  // Process Udemy licenses
  if (licensesResult.status === 'fulfilled') {
    result.licenses = licensesResult.value;
    result.sources.udemy.licenses = licensesResult.value.length;
  } else {
    result.sources.udemy.status = 'error';
    result.sources.udemy.error = licensesResult.reason?.message || 'Unknown error';
  }

  return result;
}
