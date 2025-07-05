/**
 * Bridge service to send security events to the admin API
 */

const ADMIN_API_ENDPOINT = 'https://admin.ignislabs.ai';

export class AdminBridge {
  static async sendSecurityEvent(event: {
    userId: string;
    eventType: string;
    details: string;
    requestPath: string;
    timestamp?: string;
    ip?: string;
  }): Promise<void> {
    try {
      // Send to admin API
      await fetch(`${ADMIN_API_ENDPOINT}/security/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You might want to add a server-to-server auth token here
        },
        body: JSON.stringify({
          ...event,
          timestamp: event.timestamp || new Date().toISOString(),
        }),
      });
    } catch (error) {
      // Log but don't fail the main request
      console.error('Failed to send event to admin API:', error);
    }
  }
}