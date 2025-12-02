import { flowService } from '../services/flowService';
import type { FlowResponse } from '../flows/definitions';

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

export interface WebhookResponse {
  status: 'success' | 'error';
  to?: string;
  message?: FlowResponse | string;
}

export class WebhookController {
  async handleIncomingMessage(payload: WebhookPayload): Promise<WebhookResponse> {
    try {
      if (!payload.object) {
        throw new Error("Missing object field");
      }
      
      const messageData = payload.entry[0].changes[0].value.messages[0];
      const phoneNumber = messageData.from;
      const text = messageData.text.body;

      const normalizedText = text.trim();

      const response = await flowService.processMessage(phoneNumber, normalizedText);

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
