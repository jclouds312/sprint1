import { storage } from "../storage";
import { FLOWS, type FlowResponse } from "../flows/definitions";
import type { UserContextDB } from "@shared/schema";

export class FlowService {
  async processMessage(phoneNumber: string, message: string): Promise<FlowResponse> {
    const context = await storage.getOrCreateContext(phoneNumber);
    const normalizedMsg = message.trim().toUpperCase();

    if (normalizedMsg === 'RESET' || normalizedMsg === 'MENU') {
      await storage.updateContext(phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
      return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
    }

    switch (context.currentFlow) {
      case 'WELCOME':
        return this.handleWelcomeFlow(context, normalizedMsg);
      case 'INFO_LAB':
        return this.handleInfoFlow(context, normalizedMsg);
      case 'ROLES':
        return this.handleRolesFlow(context, normalizedMsg);
      case 'SUPPORT':
        return this.handleSupportFlow(context, normalizedMsg);
      default:
        await storage.updateContext(phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
        return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
    }
  }

  private async handleWelcomeFlow(ctx: UserContextDB, msg: string): Promise<FlowResponse> {
    if (ctx.step === 'INIT') {
      // First interaction: send welcome message and advance to menu selection
      await storage.updateContext(ctx.phoneNumber, { step: 'AWAITING_MENU_SELECTION' });
      return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
    }

    if (ctx.step === 'AWAITING_MENU_SELECTION') {
      if (msg === 'A' || msg.includes('INFO')) {
        await storage.updateContext(ctx.phoneNumber, { currentFlow: 'INFO_LAB', step: 'INIT' });
        return { text: FLOWS.INFO_LAB.INIT.message };
      } else if (msg === 'B' || msg.includes('ROLES')) {
        await storage.updateContext(ctx.phoneNumber, { currentFlow: 'ROLES', step: 'INIT' });
        return { text: FLOWS.ROLES.INIT.message };
      } else if (msg === 'C' || msg.includes('SOPORTE')) {
        await storage.updateContext(ctx.phoneNumber, { currentFlow: 'SUPPORT', step: 'INIT' });
        return { text: FLOWS.SUPPORT.INIT.message };
      } else {
        return { text: "Opción no válida. Por favor envía A, B o C.", options: FLOWS.WELCOME.INIT.options };
      }
    }
    
    return { text: "Error de estado. Escribe RESET." };
  }

  private async handleInfoFlow(ctx: UserContextDB, msg: string): Promise<FlowResponse> {
    if (msg === '1' || msg.includes('VOLVER')) {
      await storage.updateContext(ctx.phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
      return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
    }
    return { text: "Escribe 1 para volver al menú." };
  }

  private async handleRolesFlow(ctx: UserContextDB, msg: string): Promise<FlowResponse> {
    if (msg === '1' || msg.includes('VOLVER')) {
      await storage.updateContext(ctx.phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
      return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
    }
    return { text: "Escribe 1 para volver al menú." };
  }

  private async handleSupportFlow(ctx: UserContextDB, msg: string): Promise<FlowResponse> {
    if (ctx.step === 'INIT') {
      // Show support message and wait for issue description
      await storage.updateContext(ctx.phoneNumber, { step: 'AWAITING_ISSUE' });
      return { text: FLOWS.SUPPORT.INIT.message };
    }

    if (ctx.step === 'AWAITING_ISSUE') {
      // User sent their issue, save it and confirm
      const currentVars = (ctx.variables as Record<string, any>) || {};
      await storage.updateContext(ctx.phoneNumber, { 
        variables: { ...currentVars, lastTicketIssue: msg },
        step: 'AWAITING_EXIT'
      });
      return { text: FLOWS.SUPPORT.AWAITING_ISSUE.message };
    }

    if (ctx.step === 'AWAITING_EXIT') {
      if (msg === '1' || msg.includes('VOLVER') || msg.includes('MENU')) {
        await storage.updateContext(ctx.phoneNumber, { 
          currentFlow: 'WELCOME', 
          step: 'INIT',
          variables: {} // Clear variables when returning to menu
        });
        return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
      }
      return { text: "Escribe 1 para volver al menú." };
    }

    return { text: "Error en soporte. Escribe MENU para reiniciar." };
  }
}

export const flowService = new FlowService();
