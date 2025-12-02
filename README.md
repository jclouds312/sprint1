# WhatsApp Automation - Sprint 1: Arquitectura Modular

Este repositorio contiene la implementación del **Primer Sprint** del sistema de automatización de WhatsApp para el Laboratorio. 

El objetivo principal ha sido validar una arquitectura modular que separa la recepción de mensajes, la lógica de negocio, el control de flujo y la persistencia de estado (contexto).

## 🚀 Funcionalidades Implementadas

1.  **Simulador de WhatsApp Web**: Interfaz de chat completa para probar flujos sin necesidad de teléfonos reales.
2.  **Dashboard de Servidor**: Visualización en tiempo real de lo que ocurre "detrás de escena" (Logs, Estado de Memoria, Arquitectura).
3.  **Manejo de Contexto**: Sistema de memoria persistente (simulada) que recuerda en qué paso está el usuario y sus variables.
4.  **Flujos Conversacionales**:
    *   **Bienvenida**: Menú principal (A/B/C).
    *   **Información**: Detalles del laboratorio.
    *   **Roles**: Lista de vacantes.
    *   **Soporte**: Flujo de captura de tickets.

## 📂 Estructura del Proyecto

La lógica del bot se encuentra aislada en `client/src/simulation` para mantener la separación de responsabilidades:

```
client/src/simulation/
├── controllers/       # WebhookController: Valida y normaliza entradas
├── services/          # FlowService: Cerebro que decide qué responder
├── flows/             # Definitions: Configuración estática de los textos y menús
├── context/           # Memory: "Base de datos" simulada (Redis/Postgres)
└── hooks/             # useSimulation: Conector entre la UI y la lógica del bot
```

## 🛠 Guía de Uso

1.  **Iniciar Chat**: Escribe "Hola" en el simulador de teléfono (panel derecho).
2.  **Navegar**: Usa las opciones A, B o C para moverte por los flujos.
3.  **Ver Contexto**: Observa el panel izquierdo ("Active Flow State") para ver cómo cambia el estado interno (`currentFlow`, `step`) en tiempo real.
4.  **Resetear**: Escribe `RESET` o `MENU` en cualquier momento, o usa el botón "Reset System" en el dashboard.

## 🏗 Arquitectura de Datos (Schemas)

El sistema utiliza modelos estrictos para garantizar la escalabilidad:

*   **UserContext**: Define qué información guardamos de cada usuario.
*   **FlowResponse**: Estandariza cómo el bot responde (texto, opciones, transiciones).
*   **WebhookPayload**: Estructura estándar de mensajes de Meta/WhatsApp.

Para más detalles técnicos, ver `docs/ARCHITECTURE.md` (creado en este sprint).

## 🔜 Siguientes Pasos (Sprint 2)

*   Integración con API real de Notion.
*   Persistencia real en base de datos (PostgreSQL).
*   Integración con Twilio/Meta API real.
