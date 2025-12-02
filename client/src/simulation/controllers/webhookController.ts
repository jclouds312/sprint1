// WEBHOOK CONTROLLER
// Handles incoming HTTP requests (simulated)
import { flowService } from '../services/flowService';

export interface WebhookPayload {
  object: string;
  entry: Array<{
    changes: Array<{
      value: {
        messages: Array<{
          from: string;
          text: {
            body: string;
          };
          type: string;
        }>;
      };
    }>;
  }>;
}

export class WebhookController {
  async handleIncomingMessage(payload: WebhookPayload) {
    // 1. Validate & Normalize (Simplified for prototype)
    try {
      // Simulate Signature Validation
      if (!payload.object) throw new Error("Missing object field");
      
      const messageData = payload.entry[0].changes[0].value.messages[0];
      const phoneNumber = messageData.from;
      const text = messageData.text.body;

      // Normalize: Trim and ensure clean input
      const normalizedText = text.trim();

      // 2. Pass to Service
      const response = await flowService.processMessage(phoneNumber, normalizedText);

      // 3. Return formatted response (simulating WhatsApp API response)
      return {
        status: 'success',
        to: phoneNumber,
        message: response
      };

    } catch (error) {
      console.error("Error processing webhook:", error);
      return { status: 'error', message: 'Invalid payload' };
    }
  }
}

export const webhookController = new WebhookController();
