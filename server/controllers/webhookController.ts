import { flowService } from '../services/flowService';
import type { FlowResponse } from '../flows/definitions';
import { webhookPayloadSchema, type WebhookPayload } from '@shared/schema';
import { createHmac } from 'crypto';

export interface WebhookResponse {
  status: 'success' | 'error' | 'validation_error' | 'unauthorized';
  to?: string;
  message?: FlowResponse | string;
  errors?: string[];
}

export class WebhookController {
  private verifyToken: string | undefined;
  private appSecret: string | undefined;

  constructor() {
    this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    this.appSecret = process.env.WHATSAPP_APP_SECRET;
  }

  verifySignature(payload: string, signature: string | undefined): boolean {
    if (!this.appSecret) {
      console.warn("WHATSAPP_APP_SECRET not configured - signature verification skipped");
      return true;
    }

    if (!signature) {
      return false;
    }

    const expectedSignature = createHmac('sha256', this.appSecret)
      .update(payload)
      .digest('hex');

    const signatureHash = signature.replace('sha256=', '');
    return signatureHash === expectedSignature;
  }

  validatePayload(body: unknown): { success: true; data: WebhookPayload } | { success: false; errors: string[] } {
    const result = webhookPayloadSchema.safeParse(body);
    
    if (!result.success) {
      const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return { success: false, errors };
    }
    
    return { success: true, data: result.data };
  }

  async handleIncomingMessage(payload: WebhookPayload): Promise<WebhookResponse> {
    try {
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
      return { status: 'error', message: 'Internal processing error' };
    }
  }
}

export const webhookController = new WebhookController();
export type { WebhookPayload } from '@shared/schema';
