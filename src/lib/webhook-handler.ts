/**
 * Unified webhook handler for Odoo CRM integration via n8n
 * Replaces Google Apps Script webhook with n8n → Odoo pipeline
 */

export interface LeadData {
  timestamp: string;
  formType: string;
  name: string;
  email: string;
  company?: string;
  companySize?: string;
  industry?: string;
  goal?: string;
  pain?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  language: string;
  source: string;
  utm_campaign: string;
  utm_source: string;
  utm_medium: string;
  page_url: string;
}

export interface WebhookResponse {
  success: boolean;
  lead_id?: number;
  message?: string;
}

/**
 * Get the webhook URL from environment
 * Falls back to Google Apps Script if n8n URL not configured
 */
function getWebhookUrl(): string {
  const n8nUrl = import.meta.env.PUBLIC_N8N_WEBHOOK_URL;
  if (n8nUrl) {
    return n8nUrl;
  }
  // Fallback to Google Apps Script for backwards compatibility
  return 'https://script.google.com/macros/s/AKfycby_23XSfxU0NBNgfbufOqhDa6ywjs34tjXp1-kEYLtNMauZiA2B64kzXUAKFKeRqB-VXA/exec';
}

/**
 * Check if using n8n webhook (supports CORS) or Google Apps Script (requires no-cors)
 */
function isN8nWebhook(): boolean {
  return !!import.meta.env.PUBLIC_N8N_WEBHOOK_URL;
}

/**
 * Submit lead data to webhook (n8n → Odoo or Google Apps Script)
 */
export async function submitToWebhook(data: LeadData): Promise<WebhookResponse> {
  const webhookUrl = getWebhookUrl();
  const useN8n = isN8nWebhook();

  try {
    if (useN8n) {
      // n8n webhook with CORS support - we can read the response
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // Skip ngrok interstitial
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      return {
        success: result.success ?? true,
        lead_id: result.lead_id,
        message: result.message,
      };
    } else {
      // Google Apps Script - no-cors mode, can't read response
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Assume success if no error thrown (can't verify with no-cors)
      return { success: true };
    }
  } catch (error) {
    console.error('Webhook submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
