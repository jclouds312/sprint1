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
      message: "📍 *Información del Laboratorio*\n\nSomos un centro de innovación tecnológica enfocado en IA y automatización.\n\n1. Volver al menú",
      nextStep: "AWAITING_EXIT"
    },
    AWAITING_EXIT: {
       // Logic to go back
    }
  },
  ROLES: {
    INIT: {
      message: "👥 *Roles Disponibles*\n\n- Arquitecto de Software\n- Desarrollador Frontend\n- Especialista en IA\n\n1. Volver al menú",
      nextStep: "AWAITING_EXIT"
    }
  },
  SUPPORT: {
    INIT: {
      message: "🛠 *Soporte*\n\n¿En qué podemos ayudarte? Describe tu problema brevemente.",
      nextStep: "AWAITING_ISSUE"
    },
    AWAITING_ISSUE: {
      message: "Gracias. Hemos registrado tu solicitud. Un agente te contactará pronto.\n\n1. Volver al menú",
      nextStep: "AWAITING_EXIT"
    }
  }
};
