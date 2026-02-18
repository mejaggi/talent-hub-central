/**
 * Microsoft O365 Email Service (via Microsoft Graph API)
 * 
 * TODO: Enable Lovable Cloud and add these secrets:
 *   - AZURE_TENANT_ID
 *   - AZURE_CLIENT_ID
 *   - AZURE_CLIENT_SECRET
 *   - O365_SENDER_EMAIL (the shared mailbox or user to send from)
 * 
 * Requires Azure AD app registration with Mail.Send permission (Application type).
 * Graph API endpoint: POST /users/{sender}/sendMail
 */

const USE_MOCK = true; // Set to false once edge functions are deployed

export interface EmailPayload {
  to: { name: string; email: string }[];
  subject: string;
  body: string;
  /** Optional placeholders to replace in subject/body per recipient */
  placeholders?: Record<string, Record<string, string>>;
}

export interface EmailResult {
  success: boolean;
  sent: number;
  failed: number;
  errors?: string[];
}

/**
 * Send emails via MS O365 / Microsoft Graph API
 * Each recipient gets a personalized email with placeholders replaced.
 */
export async function sendO365Email(payload: EmailPayload): Promise<EmailResult> {
  if (USE_MOCK) {
    console.log('[MOCK] Sending O365 emails:', {
      recipientCount: payload.to.length,
      subject: payload.subject,
    });
    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, sent: payload.to.length, failed: 0 };
  }

  // TODO: Call edge function when Cloud is enabled
  // const { data, error } = await supabase.functions.invoke('send-o365-email', {
  //   body: payload
  // });
  // if (error) throw new Error(`Failed to send emails: ${error.message}`);
  // return data;

  throw new Error('O365 email not configured. Enable Lovable Cloud and add Azure AD credentials.');
}

/**
 * Personalize an email body by replacing {{placeholders}} with actual values
 */
export function personalizeEmail(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.split(`{{${key}}}`).join(value);
  }
  return result;
}
