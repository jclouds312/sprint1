# WhatsApp Automation - Sprint 1: Arquitectura Modular Full-Stack

Este repositorio contiene la implementación del **Primer Sprint** del sistema de automatización de WhatsApp para **AILucid Studio**. 

El objetivo principal ha sido validar una arquitectura modular **full-stack** que separa la recepción de mensajes, la lógica de negocio, el control de flujo y la persistencia de estado (contexto) en una base de datos PostgreSQL real.

## ✅ Criterios de Éxito Cumplidos

| Criterio | Estado |
|----------|--------|
| Bot responde de forma coherente a las 3 opciones (A/B/C) | ✅ |
| Mantiene el contexto sin reiniciar | ✅ (PostgreSQL) |
| Usa arquitectura modular (rutas, controladores, servicios, flujos) | ✅ |
| Responde correctamente a mensajes consecutivos | ✅ |
| Diseño escalable para futuras integraciones | ✅ |

## 🚀 Funcionalidades Implementadas

1.  **Backend Express con API REST**: Servidor Node.js con endpoints reales para webhooks.
2.  **Base de Datos PostgreSQL**: Persistencia real del contexto de usuario con Drizzle ORM.
3.  **Simulador de WhatsApp Web**: Interfaz de chat completa para probar flujos sin necesidad de teléfonos reales.
4.  **Dashboard de Servidor**: Visualización en tiempo real de logs, estado de memoria y arquitectura.
5.  **Flujos Conversacionales**:
    *   **A: Información del Lab**: Descripción de AILucid Studio.
    *   **B: Roles Disponibles**: Lista de vacantes actuales.
    *   **C: Soporte**: Flujo de captura de tickets.

## 📂 Estructura del Proyecto

### Backend (Server)
```
server/
├── controllers/           # WebhookController: Valida y normaliza entradas
│   └── webhookController.ts
├── services/              # FlowService: Cerebro que decide qué responder
│   └── flowService.ts
├── flows/                 # Definitions: Configuración estática de textos y menús
│   └── definitions.ts
├── storage.ts             # DatabaseStorage: Conexión a PostgreSQL con Drizzle
├── routes.ts              # API Routes: /api/webhook, /api/contexts
└── index.ts               # Punto de entrada del servidor Express
```

### Frontend (Client)
```
client/src/
├── components/simulation/ # UI del simulador (PhoneFrame, ChatInterface, Dashboard)
├── simulation/hooks/      # useSimulation: Conector entre UI y API del servidor
└── pages/                 # Páginas de la aplicación
```

### Shared
```
shared/
└── schema.ts              # Esquemas Drizzle para PostgreSQL (UserContext)
```

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/webhook` | Recibe mensajes de WhatsApp (formato Meta API) |
| GET | `/api/contexts` | Obtiene todos los contextos de usuarios (debug) |
| POST | `/api/contexts/reset` | Resetea todos los contextos (testing) |

## 🛠 Guía de Uso

1.  **Iniciar Chat**: Escribe "Hola" en el simulador de teléfono (panel derecho).
2.  **Navegar**: Usa las opciones A, B o C para moverte por los flujos.
3.  **Ver Contexto**: Observa el panel izquierdo ("Active Flow State") para ver cómo cambia el estado interno (`currentFlow`, `step`) en tiempo real.
4.  **Resetear**: Escribe `RESET` o `MENU` en cualquier momento, o usa el botón "Reset System" en el dashboard.

## 🚀 Despliegue

### Replit (Recomendado)
El proyecto está configurado para ejecutarse directamente en Replit con:
- `npm run dev` - Desarrollo con hot-reload
- `npm run build && npm start` - Producción

### Variables de Entorno Requeridas
```
DATABASE_URL=postgresql://...
```

## 🏗 Arquitectura de Datos (Schemas)

### Tabla: `user_contexts`
```sql
CREATE TABLE user_contexts (
  id SERIAL PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  current_flow TEXT NOT NULL DEFAULT 'WELCOME',
  step TEXT NOT NULL DEFAULT 'INIT',
  variables JSONB NOT NULL DEFAULT '{}',
  last_interaction TIMESTAMP NOT NULL DEFAULT NOW()
);
```

Para más detalles técnicos, ver `docs/ARCHITECTURE.md` y `TECHNICAL.md`.

## 🔜 Siguientes Pasos (Sprint 2)

*   Integración con API real de Notion.
*   Integración con Twilio/Meta API real.
*   Dashboards internos.
*   Sistema de usuarios.
