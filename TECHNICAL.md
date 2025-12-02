# Especificaciones Técnicas - Sprint 1

Este documento detalla la pila tecnológica y las especificaciones técnicas del simulador de flujo de WhatsApp desarrollado para el Sprint 1.

## 🛠 Stack Tecnológico

### Frontend (Core)
*   **Framework**: [React 18+](https://react.dev/)
*   **Lenguaje**: [TypeScript 5.x](https://www.typescriptlang.org/) (Tipado estricto)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Routing**: [Wouter](https://github.com/molefrog/wouter) (Router ligero para SPAs)

### UI & Estilos
*   **Styling Engine**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Component Library**: [Shadcn/UI](https://ui.shadcn.com/) (Radix Primitives)
*   **Iconos**: [Lucide React](https://lucide.dev/)
*   **Animaciones**: `tailwindcss-animate`

### Estado & Simulación Backend
*   **State Management**: React `useState` + `Context API` (simulando persistencia)
*   **Mock Database**: Clase `ContextStore` (Simulación en memoria de Redis/Key-Value Store)
*   **Arquitectura**: MVC (Model-View-Controller) adaptado al cliente:
    *   `WebhookController`: Normalización de entradas.
    *   `FlowService`: Máquina de estados finitos para la lógica conversacional.

## ⚙️ Especificaciones de Arquitectura

### 1. Simulación de Webhook
El sistema no utiliza un backend real (Node/Express) para esta demo, sino que emula el comportamiento de un servidor dentro del navegador.

*   **Input**: `WebhookPayload` (Estructura idéntica a la API de Meta Graph API).
*   **Procesamiento**: Asíncrono con delay artificial (600ms) para realismo.
*   **Output**: JSON estandarizado con la respuesta del bot.

### 2. Manejo de Contexto (State Machine)
El sistema utiliza una máquina de estados simple para rastrear al usuario.

*   **Persistencia**: Volátil (se reinicia al recargar la página).
*   **Estructura de Memoria**:
    ```typescript
    Map<PhoneNumber, {
      currentFlow: 'WELCOME' | 'INFO' | 'ROLES' | 'SUPPORT',
      step: string,
      variables: Object
    }>
    ```

### 3. Estándares de Código
*   **Linter**: ESLint con configuración estándar de React.
*   **Formatting**: Prettier.
*   **Modularidad**: Principio de Responsabilidad Única (SRP). Cada flujo tiene su propia definición en `flows/definitions.ts`.

## 🚀 Despliegue (Vercel)

El proyecto está configurado para desplegarse como una **Single Page Application (SPA)** estática.

### Configuración de Build
*   **Comando**: `npm run build`
*   **Output Directory**: `dist/public`
*   **Configuración**: Ver `vercel.json` en la raíz.

### Rutas
Debido al uso de `wouter` en modo cliente, todas las rutas se redirigen a `/index.html` mediante la configuración de rewrites de Vercel.
