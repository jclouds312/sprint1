// FLOW SERVICE
// Business logic for handling flow transitions
import { contextStore, UserContext } from '../context/memory';
import { FLOWS, FlowResponse } from '../flows/definitions';

export class FlowService {
  async processMessage(phoneNumber: string, message: string): Promise<FlowResponse> {
    const context = await contextStore.getContext(phoneNumber);
    const normalizedMsg = message.trim().toUpperCase();

    // Global Reset Command
    if (normalizedMsg === 'RESET' || normalizedMsg === 'MENU') {
      await contextStore.updateContext(phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
      return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
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
        return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
    }
  }

  private async handleWelcomeFlow(ctx: UserContext, msg: string): Promise<FlowResponse> {
    if (ctx.step === 'INIT') {
       // Should not happen if initialized correctly, but auto-advance
       await contextStore.updateContext(ctx.phoneNumber, { step: 'AWAITING_MENU_SELECTION' });
       return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
    }

    if (ctx.step === 'AWAITING_MENU_SELECTION') {
      if (msg === 'A' || msg.includes('INFO')) {
        await contextStore.updateContext(ctx.phoneNumber, { currentFlow: 'INFO_LAB', step: 'INIT' });
        return { text: FLOWS.INFO_LAB.INIT.message };
      } else if (msg === 'B' || msg.includes('ROLES')) {
        await contextStore.updateContext(ctx.phoneNumber, { currentFlow: 'ROLES', step: 'INIT' });
        return { text: FLOWS.ROLES.INIT.message };
      } else if (msg === 'C' || msg.includes('SOPORTE')) {
        await contextStore.updateContext(ctx.phoneNumber, { currentFlow: 'SUPPORT', step: 'INIT' });
        return { text: FLOWS.SUPPORT.INIT.message };
      } else {
        return { text: "Opción no válida. Por favor envía A, B o C.", options: FLOWS.WELCOME.INIT.options };
      }
    }
    
    return { text: "Error de estado. Escribe RESET." };
  }

  private async handleInfoFlow(ctx: UserContext, msg: string): Promise<FlowResponse> {
     if (msg === '1' || msg.includes('VOLVER')) {
       await contextStore.updateContext(ctx.phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
       return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
     }
     return { text: "Escribe 1 para volver al menú." };
  }

  private async handleRolesFlow(ctx: UserContext, msg: string): Promise<FlowResponse> {
     if (msg === '1' || msg.includes('VOLVER')) {
       await contextStore.updateContext(ctx.phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
       return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
     }
     return { text: "Escribe 1 para volver al menú." };
  }

  private async handleSupportFlow(ctx: UserContext, msg: string): Promise<FlowResponse> {
    if (ctx.step === 'INIT') {
      // User just entered support, we showed the prompt, now waiting for input
      // Actually, if we just transitioned, we should be in AWAITING_ISSUE
      // But for this simulation, let's assume we need to advance manually or the first msg was the transition
      await contextStore.updateContext(ctx.phoneNumber, { step: 'AWAITING_ISSUE' });
      return { text: FLOWS.SUPPORT.INIT.message }; // Re-send prompt if they type something else? Or accept it?
      // Let's assume this message IS the issue if they are already in INIT? 
      // No, usually INIT sends the prompt.
    }

    if (ctx.step === 'AWAITING_ISSUE') {
      // Capture the issue (mock variable storage)
      await contextStore.updateContext(ctx.phoneNumber, { 
        variables: { ...ctx.variables, lastTicketIssue: msg },
        step: 'AWAITING_EXIT'
      });
      return { text: FLOWS.SUPPORT.AWAITING_ISSUE.message };
    }

    if (ctx.step === 'AWAITING_EXIT') {
       if (msg === '1' || msg.includes('VOLVER')) {
         await contextStore.updateContext(ctx.phoneNumber, { currentFlow: 'WELCOME', step: 'INIT' });
         return { text: FLOWS.WELCOME.INIT.message, options: FLOWS.WELCOME.INIT.options };
       }
       return { text: "Escribe 1 para volver al menú." };
    }

    return { text: "Error en soporte. Escribe MENU." };
  }
}

export const flowService = new FlowService();
