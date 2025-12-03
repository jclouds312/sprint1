# Documentación Técnica y Esquemas

Este documento detalla los esquemas de datos y la arquitectura de flujo implementada en el Sprint 1.

## 1. Diagrama de Flujo de Datos

```mermaid
graph TD
    A[Webhook (WhatsApp)] -->|Payload| B(WebhookController)
    B -->|Normalización| C{FlowService}
    C -->|Consulta Estado| D[(ContextStore / Redis)]
    D -->|Retorna Contexto| C
    C -->|Procesa Reglas| E[Flow Definitions]
    E -->|Respuesta Texto/Menu| C
    C -->|Actualiza Estado| D
    C -->|Respuesta Final| A
```

## 2. Esquemas de Datos (Data Schemas)

### 2.1 Contexto de Usuario (`UserContext`)
Este esquema representa la "memoria" del bot. Se almacena por número de teléfono.

```typescript
interface UserContext {
  phoneNumber: string;        // Identificador único (PK)
  currentFlow: string;        // Flujo actual (ej: 'WELCOME', 'SUPPORT')
  step: string;               // Paso dentro del flujo (ej: 'INIT', 'AWAITING_ISSUE')
  variables: Record<string, any>; // Almacén flexible de datos (ej: { ticketIssue: "..." })
  lastInteraction: Date;      // Timestamp para timeout de sesiones
}
```

### 2.2 Definición de Flujo (`FlowDefinition`)
Estructura estática que define qué dice el bot en cada paso.

```typescript
type FlowStep = {
  message: string;            // Texto a enviar al usuario
  options?: string[];         // Opciones de menú (botones/listas)
  nextStep?: string;          // Siguiente paso automático (opcional)
}

type FlowStructure = {
  [FlowName: string]: {
    [StepName: string]: FlowStep
  }
}
```

### 2.3 Respuesta del Servicio (`FlowResponse`)
Objeto estandarizado que devuelve el `FlowService` hacia el controlador.

```typescript
type FlowResponse = {
  text: string;               // Mensaje final para el usuario
  options?: string[];         // Opciones visuales si las hay
  nextStep?: string;          // Instrucción de transición (uso interno)
  nextFlow?: string;          // Instrucción de cambio de flujo (uso interno)
};
```

## 3. Diccionario de Flujos

### Flujo: WELCOME
*   **INIT**: Mensaje de bienvenida.
*   **AWAITING_MENU_SELECTION**: Espera A, B o C. Router principal.

### Flujo: SUPPORT
*   **INIT**: Pregunta "¿En qué podemos ayudarte?".
*   **AWAITING_ISSUE**: Captura la entrada de texto libre del usuario y la guarda en `variables.lastTicketIssue`.
*   **AWAITING_EXIT**: Confirma recepción y ofrece volver.

## 4. Notas de Implementación

*   **Desacoplamiento**: El `WebhookController` no sabe nada de lógica de negocio, solo normaliza datos.
*   **Persistencia**: Implementada con PostgreSQL usando Drizzle ORM. Los datos persisten entre sesiones.
*   **Escalabilidad**: Agregar un nuevo flujo solo requiere:
    1.  Agregarlo en `server/flows/definitions.ts`.
    2.  Agregar un `case` en `FlowService` para manejar sus transiciones específicas.

## 5. API REST Endpoints

### POST /api/webhook
Recibe mensajes entrantes en formato Meta WhatsApp Business API.

**Request Body:**
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "5215555555555",
          "text": { "body": "Hola" },
          "type": "text"
        }]
      }
    }]
  }]
}
```

**Response:**
```json
{
  "status": "success",
  "to": "5215555555555",
  "message": {
    "text": "¡Hola! Bienvenido al Laboratorio...",
    "options": ["A: Información del Lab", "B: Roles Disponibles", "C: Soporte"]
  }
}
```

### GET /api/contexts
Obtiene todos los contextos de usuario almacenados (para debugging).

### POST /api/contexts/reset
Elimina todos los contextos de usuario (para testing).

## 6. Base de Datos

### Tabla: user_contexts
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | Primary key |
| phone_number | TEXT | Identificador único del usuario (WhatsApp) |
| current_flow | TEXT | Flujo activo (WELCOME, INFO_LAB, ROLES, SUPPORT) |
| step | TEXT | Paso dentro del flujo |
| variables | JSONB | Variables dinámicas (ej: lastTicketIssue) |
| last_interaction | TIMESTAMP | Última interacción para timeout |
