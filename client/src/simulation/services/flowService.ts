
// FLOW SERVICE
// Business logic for handling flow transitions
import { contextStore, UserContext } from '../context/memory';
import { FLOWS, FlowResponse } from '../flows/definitions';

export class FlowService {
  async processMessage(phoneNumber: string, message: string): Promise<FlowResponse> {
    let context = await contextStore.getContext(phoneNumber);
    const normalizedMsg = message.trim().toUpperCase();

    // Global Reset Command
    if (normalizedMsg === 'RESET' || normalizedMsg === 'MENU') {
      await contextStore.updateContext(phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
      return { text: FLOWS.WELCOME.INIT.message };
    }

    // Router Logic based on Current Flow & Step
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
        // Fallback to Welcome
        await contextStore.updateContext(phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
        return { text: FLOWS.WELCOME.INIT.message };
    }
  }

  private async handleWelcomeFlow(ctx: UserContext, msg: string): Promise<FlowResponse> {
    if (ctx.step === 'INIT') {
      // First message: just show greeting
      await contextStore.updateContext(ctx.phoneNumber, { step: 'AWAITING_MENU_REQUEST' });
      return { text: FLOWS.WELCOME.INIT.message };
    }

    if (ctx.step === 'AWAITING_MENU_REQUEST') {
      // Second interaction: ask if they want to see menu
      if (msg.includes('SI') || msg.includes('SÍ') || msg.includes('VER') || msg.includes('MENU')) {
        await contextStore.updateContext(ctx.phoneNumber, { step: 'AWAITING_MENU_SELECTION' });
        return { text: FLOWS.WELCOME.AWAITING_MENU_SELECTION.message, options: FLOWS.WELCOME.AWAITING_MENU_SELECTION.options };
      } else {
        return { text: FLOWS.WELCOME.AWAITING_MENU_REQUEST.message, options: FLOWS.WELCOME.AWAITING_MENU_REQUEST.options };
      }
    }

    if (ctx.step === 'AWAITING_MENU_SELECTION') {
      // Third interaction onwards: validate A/B/C
      if (msg === 'A' || msg.includes('INFO')) {
        await contextStore.updateContext(ctx.phoneNumber, { currentFlow: 'INFO_LAB', step: 'INIT' });
        return { text: FLOWS.INFO_LAB.INIT.message };
      } else if (msg === 'B' || msg.includes('ROLES')) {
        await contextStore.updateContext(ctx.phoneNumber, { currentFlow: 'ROLES', step: 'INIT' });
        return { text: FLOWS.ROLES.INIT.message };
      } else if (msg === 'C' || msg.includes('SOPORTE') || msg.includes('SUPPORT')) {
        await contextStore.updateContext(ctx.phoneNumber, { currentFlow: 'SUPPORT', step: 'INIT' });
        return { text: FLOWS.SUPPORT.INIT.message };
      } else {
        return { text: "Opción no válida. Por favor envía A, B o C.", options: FLOWS.WELCOME.AWAITING_MENU_SELECTION.options };
      }
    }
    
    return { text: "Error de estado. Escribe RESET." };
  }

  private async handleInfoFlow(ctx: UserContext, msg: string): Promise<FlowResponse> {
     if (msg === '1' || msg.includes('VOLVER')) {
       await contextStore.updateContext(ctx.phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
       return { text: FLOWS.WELCOME.INIT.message };
     }
     return { text: "Escribe 1 para volver al menú." };
  }

  private async handleRolesFlow(ctx: UserContext, msg: string): Promise<FlowResponse> {
     if (msg === '1' || msg.includes('VOLVER')) {
       await contextStore.updateContext(ctx.phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
       return { text: FLOWS.WELCOME.INIT.message };
     }
     return { text: "Escribe 1 para volver al menú." };
  }

  private async handleSupportFlow(ctx: UserContext, msg: string): Promise<FlowResponse> {
    if (ctx.step === 'INIT') {
      // Show support message and wait for issue description
      await contextStore.updateContext(ctx.phoneNumber, { step: 'AWAITING_ISSUE' });
      return { text: FLOWS.SUPPORT.INIT.message };
    }

    if (ctx.step === 'AWAITING_ISSUE') {
      // User sent their issue, save it and confirm
      await contextStore.updateContext(ctx.phoneNumber, { 
        variables: { ...ctx.variables, lastTicketIssue: msg },
        step: 'AWAITING_EXIT'
      });
      return { text: FLOWS.SUPPORT.AWAITING_ISSUE.message };
    }

    if (ctx.step === 'AWAITING_EXIT') {
       if (msg === '1' || msg.includes('VOLVER') || msg.includes('MENU')) {
         await contextStore.updateContext(ctx.phoneNumber, { 
           currentFlow: 'WELCOME', 
           step: 'INIT',
           variables: {} // Clear variables when returning to menu
         });
         return { text: FLOWS.WELCOME.INIT.message };
       }
       return { text: "Escribe 1 para volver al menú." };
    }

    return { text: "Error en soporte. Escribe MENU para reiniciar." };
  }
}

export const flowService = new FlowService();
