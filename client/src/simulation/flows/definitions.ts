// FLOW DEFINITIONS
// Defining the conversation structure

export type FlowResponse = {
  text: string;
  options?: string[]; // For button simulation
  nextStep?: string;
  nextFlow?: string;
};

export const FLOWS = {
  WELCOME: {
    INIT: {
      message: "¡Hola! Bienvenido al Laboratorio 🧪.\nSelecciona una opción del menú:",
      options: ["A: Información del Lab", "B: Roles Disponibles", "C: Soporte"],
      nextStep: "AWAITING_MENU_SELECTION"
    },
    AWAITING_MENU_SELECTION: {
      // Logic handled in service to route to other flows
      fallback: "Por favor, responde con A, B o C."
    }
  },
  INFO_LAB: {
    INIT: {
      message: "📍 *Información del Laboratorio*\n\nAILucid Studio es un laboratorio digital enfocado en inteligencia artificial, automatización y desarrollo de software.\n\nNuestra misión es construir sistemas inteligentes que impulsen el futuro del trabajo y la creatividad humana.\n\n1. Volver al menú",
      nextStep: "AWAITING_EXIT"
    },
    AWAITING_EXIT: {
       // Logic to go back
    }
  },
  ROLES: {
    INIT: {
      message: "👥 *Roles Disponibles*\n\nActualmente estamos evaluando talento para:\n* Integrador de Sistemas\n* Arquitecto en Notion\n* Community Manager IA\n* Content Automation Specialist (CAS)\n\n1. Volver al menú",
      nextStep: "AWAITING_EXIT"
    }
  },
  SUPPORT: {
    INIT: {
      message: "🛠 *Soporte*\n\nPara soporte general puedes responder: “hablar con soporte”.\nEn esta fase es soporte limitado porque estamos construyendo el sistema interno.",
      nextStep: "AWAITING_ISSUE"
    },
    AWAITING_ISSUE: {
      message: "Gracias. Hemos registrado tu solicitud. Un agente te contactará pronto.\n\n1. Volver al menú",
      nextStep: "AWAITING_EXIT"
    }
  }
};
