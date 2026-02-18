/**
 * Cornerstone OnDemand (CSOD) API Service
 * 
 * TODO: Enable Lovable Cloud and add these secrets:
 *   - CSOD_BASE_URL (e.g. https://yourdomain.csod.com)
 *   - CSOD_CLIENT_ID
 *   - CSOD_CLIENT_SECRET
 *   - CSOD_API_KEY
 * 
 * CSOD uses OAuth2 client_credentials flow for authentication.
 * Docs: https://apiexplorer.csod.com/
 */

import type { Training } from '@/lib/mock-data';

const USE_MOCK = true; // Set to false once edge functions are deployed

// ─── Types matching CSOD API responses ───

export interface CSODTranscript {
  userId: string;
  userName: string;
  userEmail: string;
  trainingTitle: string;
  trainingDescription: string;
  trainingType: string;
  status: 'Completed' | 'In Progress' | 'Not Started' | 'Registered';
  dateAssigned: string;
  dateCompleted: string | null;
  duration: number; // minutes
  category: string;
}

// ─── API Functions ───

/**
 * Fetch all training transcripts from CSOD
 * Maps to: GET /services/api/x/odata/api/views/vw_rpt_training
 */
export async function fetchCSODTrainings(): Promise<Training[]> {
  if (USE_MOCK) {
    const { mockTrainings } = await import('@/lib/mock-data');
    return mockTrainings.filter(t => t.source === 'CSOD');
  }

  // TODO: Call edge function when Cloud is enabled
  // const { data, error } = await supabase.functions.invoke('csod-sync', {
  //   body: { action: 'fetch-trainings' }
  // });
  // if (error) throw new Error(`Failed to fetch CSOD trainings: ${error.message}`);
  // return data.trainings;

  throw new Error('CSOD API not configured. Enable Lovable Cloud and add API credentials.');
}
