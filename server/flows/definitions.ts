
export type FlowResponse = {
  text: string;
  options?: string[];
  nextStep?: string;
  nextFlow?: string;
};

export const FLOWS = {
  WELCOME: {
    INIT: {
      message: "¡Hola! 👋 Bienvenido al *Laboratorio AILucid Studio* 🧪\n\nSomos un laboratorio digital enfocado en inteligencia artificial, automatización y desarrollo de software.",
      nextStep: "AWAITING_MENU_REQUEST"
    },
    AWAITING_MENU_REQUEST: {
      message: "¿Te gustaría ver el menú principal?",
      options: ["Sí, ver menú", "No, gracias"],
      nextStep: "AWAITING_MENU_SELECTION"
    },
    AWAITING_MENU_SELECTION: {
      message: "*Menú Principal:*\n\nA: Información del laboratorio\nB: Roles disponibles\nC: Soporte\n\nPor favor, selecciona una opción.",
      options: ["A: Información del laboratorio", "B: Roles disponibles", "C: Soporte"],
      fallback: "Por favor, responde con A, B o C."
    }
  },
  INFO_LAB: {
    INIT: {
      message: "📍 *Información del laboratorio*\n\n*¿Quiénes somos?*\nAILucid Studio es un laboratorio digital especializado en:\n• Inteligencia Artificial\n• Automatización de procesos\n• Desarrollo de software a medida\n\n*Nuestra misión:*\nConstruir sistemas inteligentes que impulsen el futuro del trabajo y la creatividad humana.\n\n1. Volver al menú",
      nextStep: "AWAITING_EXIT"
    },
    AWAITING_EXIT: {}
  },
  ROLES: {
    INIT: {
      message: "👥 *Roles disponibles*\n\nActualmente estamos evaluando talento para:\n• Integrador de Sistemas\n• Arquitecto en Notion\n• Community Manager IA\n• Content Automation Specialist (CAS)\n\n1. Volver al menú",
      nextStep: "AWAITING_EXIT"
    }
  },
  SUPPORT: {
    INIT: {
      message: "🛠 *Soporte*\n\nPara soporte general puedes responder: \"hablar con soporte\".\nEn esta fase es soporte limitado porque estamos construyendo el sistema interno.",
      nextStep: "AWAITING_ISSUE"
    },
    AWAITING_ISSUE: {
      message: "Gracias. Hemos registrado tu solicitud. Un agente te contactará pronto.\n\n1. Volver al menú",
      nextStep: "AWAITING_EXIT"
    }
  }
};
