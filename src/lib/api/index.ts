/**
 * Unified API layer for the TMD Learning Portal
 * 
 * All data fetching goes through these functions.
 * Currently uses mock data; flip USE_MOCK in each service file
 * once Lovable Cloud edge functions are deployed.
 */

export { fetchUdemyTrainings, fetchUdemyLicenses, revokeUdemyLicenses } from './udemy-api';
export { fetchCSODTrainings } from './csod-api';
export { sendO365Email, personalizeEmail } from './o365-email';
export type { EmailPayload, EmailResult } from './o365-email';

import { fetchUdemyTrainings } from './udemy-api';
import { fetchCSODTrainings } from './csod-api';
import type { Training } from '@/lib/mock-data';

/**
 * Fetch consolidated trainings from both Udemy and CSOD
 */
export async function fetchAllTrainings(): Promise<Training[]> {
  const [udemy, csod] = await Promise.all([
    fetchUdemyTrainings(),
    fetchCSODTrainings(),
  ]);
  return [...udemy, ...csod];
}
