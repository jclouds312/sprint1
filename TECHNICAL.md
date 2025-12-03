# Especificaciones Técnicas - Sprint 1 (Full-Stack)

Este documento detalla la pila tecnológica y las especificaciones técnicas del sistema de automatización de WhatsApp desarrollado para AILucid Studio.

## 🛠 Stack Tecnológico

### Backend (Server)
*   **Runtime**: [Node.js 20+](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Lenguaje**: [TypeScript 5.x](https://www.typescriptlang.org/) (Tipado estricto)
*   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
*   **Base de Datos**: [PostgreSQL](https://www.postgresql.org/) (Neon Serverless)
*   **Bundler**: [esbuild](https://esbuild.github.io/) (para producción)

### Frontend (Client)
*   **Framework**: [React 19](https://react.dev/)
*   **Lenguaje**: [TypeScript 5.x](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite 7](https://vitejs.dev/)
*   **Routing**: [Wouter](https://github.com/molefrog/wouter)

### UI & Estilos
*   **Styling Engine**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Component Library**: [Shadcn/UI](https://ui.shadcn.com/) (Radix Primitives)
*   **Iconos**: [Lucide React](https://lucide.dev/)
*   **Animaciones**: `tailwindcss-animate`, `framer-motion`

## ⚙️ Arquitectura del Sistema

### 1. Flujo de Datos
```
[Usuario] → [Simulador UI] → [fetch /api/webhook]
                                    ↓
                            [Express Server]
                                    ↓
                            [WebhookController]
                              (Validación/Normalización)
                                    ↓
                            [FlowService]
                              (Lógica de Estados)
                                    ↓
                            [DatabaseStorage]
                              (Drizzle → PostgreSQL)
                                    ↓
                            [Respuesta JSON]
                                    ↓
                            [UI Actualizada]
```

### 2. Arquitectura MVC en Backend

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| Routes | `server/routes.ts` | Define endpoints HTTP |
| Controller | `server/controllers/webhookController.ts` | Valida y normaliza entradas |
| Service | `server/services/flowService.ts` | Lógica de negocio y estados |
| Model | `shared/schema.ts` | Definiciones de tablas Drizzle |
| Storage | `server/storage.ts` | Operaciones CRUD con PostgreSQL |

### 3. Manejo de Contexto (State Machine)
El sistema utiliza una máquina de estados persistente en PostgreSQL.

*   **Persistencia**: PostgreSQL (datos sobreviven reinicios del servidor).
*   **Estructura de Tabla**:
    ```typescript
    userContexts = pgTable("user_contexts", {
      id: serial("id").primaryKey(),
      phoneNumber: text("phone_number").notNull().unique(),
      currentFlow: text("current_flow").notNull().default("WELCOME"),
      step: text("step").notNull().default("INIT"),
      variables: jsonb("variables").notNull().default({}),
      lastInteraction: timestamp("last_interaction").notNull().defaultNow(),
    });
    ```

### 4. Flujos Implementados

| Flujo | Steps | Descripción |
|-------|-------|-------------|
| WELCOME | INIT, AWAITING_MENU_SELECTION | Menú principal A/B/C |
| INFO_LAB | INIT, AWAITING_EXIT | Información de AILucid Studio |
| ROLES | INIT | Lista de vacantes |
| SUPPORT | INIT, AWAITING_ISSUE, AWAITING_EXIT | Captura tickets de soporte |

### 5. Estándares de Código
*   **Tipado**: TypeScript estricto en todo el proyecto.
*   **Modularidad**: Principio de Responsabilidad Única (SRP).
*   **Schemas**: Drizzle-Zod para validación de datos.
*   **Imports**: Alias `@shared/` para módulos compartidos.

## 🚀 Scripts de NPM

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot-reload |
| `npm run build` | Compila frontend (Vite) y backend (esbuild) |
| `npm start` | Ejecuta versión de producción |
| `npm run db:push` | Sincroniza esquemas Drizzle con PostgreSQL |

## 🔐 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de conexión PostgreSQL |
| `NODE_ENV` | Entorno (development/production) |

## 📊 Métricas de Rendimiento

*   **Tiempo de respuesta API**: ~50-100ms (incluyendo DB)
*   **Tamaño del bundle frontend**: ~200KB (gzipped)
*   **Cold start del servidor**: ~1s
