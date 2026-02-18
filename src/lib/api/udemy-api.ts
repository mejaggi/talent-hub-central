/**
 * Udemy Business API Service
 * 
 * TODO: Enable Lovable Cloud and add these secrets:
 *   - UDEMY_BASE_URL (e.g. https://yourdomain.udemy.com/api-2.0)
 *   - UDEMY_CLIENT_ID
 *   - UDEMY_CLIENT_SECRET
 * 
 * Udemy Business API docs: https://business-support.udemy.com/hc/en-us/articles/360005783814
 */

import type { Training, UdemyLicense } from '@/lib/mock-data';

const USE_MOCK = true; // Set to false once edge functions are deployed

// ─── Types matching Udemy Business API responses ───

export interface UdemyUserActivity {
  user_email: string;
  user_name: string;
  course_title: string;
  course_category: string;
  num_video_consumed_minutes: number;
  completion_ratio: number;
  date_started: string;
  date_completed: string | null;
}

export interface UdemyLicenseInfo {
  user_email: string;
  user_name: string;
  license_activated_date: string;
  last_accessed_date: string;
  num_courses_started: number;
  num_courses_completed: number;
  is_active: boolean;
}

// ─── API Functions ───

/**
 * Fetch all user course activity from Udemy Business API
 * Maps to: GET /organizations/{org_id}/analytics/user-course-activity/
 */
export async function fetchUdemyTrainings(): Promise<Training[]> {
  if (USE_MOCK) {
    const { mockTrainings } = await import('@/lib/mock-data');
    return mockTrainings.filter(t => t.source === 'Udemy');
  }

  // TODO: Call edge function when Cloud is enabled
  // const { data, error } = await supabase.functions.invoke('udemy-sync', {
  //   body: { action: 'fetch-trainings' }
  // });
  // if (error) throw new Error(`Failed to fetch Udemy trainings: ${error.message}`);
  // return data.trainings;

  throw new Error('Udemy API not configured. Enable Lovable Cloud and add API credentials.');
}

/**
 * Fetch Udemy license utilization data
 * Maps to: GET /organizations/{org_id}/analytics/user-activity/
 */
export async function fetchUdemyLicenses(): Promise<UdemyLicense[]> {
  if (USE_MOCK) {
    const { mockUdemyLicenses } = await import('@/lib/mock-data');
    return mockUdemyLicenses;
  }

  // TODO: Call edge function when Cloud is enabled
  // const { data, error } = await supabase.functions.invoke('udemy-sync', {
  //   body: { action: 'fetch-licenses' }
  // });
  // if (error) throw new Error(`Failed to fetch Udemy licenses: ${error.message}`);
  // return data.licenses;

  throw new Error('Udemy API not configured. Enable Lovable Cloud and add API credentials.');
}

/**
 * Revoke a Udemy Business license for given user emails
 * Maps to: POST /organizations/{org_id}/users/licenses/revoke/
 */
export async function revokeUdemyLicenses(userEmails: string[]): Promise<{ success: boolean; revoked: number }> {
  if (USE_MOCK) {
    console.log('[MOCK] Revoking Udemy licenses for:', userEmails);
    return { success: true, revoked: userEmails.length };
  }

  // TODO: Call edge function when Cloud is enabled
  // const { data, error } = await supabase.functions.invoke('udemy-sync', {
  //   body: { action: 'revoke-licenses', userEmails }
  // });
  // if (error) throw new Error(`Failed to revoke licenses: ${error.message}`);
  // return data;

  throw new Error('Udemy API not configured. Enable Lovable Cloud and add API credentials.');
}
