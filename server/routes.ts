import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { webhookController } from "./controllers/webhookController";
import type { WebhookPayload } from "./controllers/webhookController";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Webhook endpoint for incoming messages
  app.post("/api/webhook", async (req, res) => {
    try {
      const payload: WebhookPayload = req.body;
      const response = await webhookController.handleIncomingMessage(payload);
      res.json(response);
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });

  // Get all user contexts (for debugging/dashboard)
  app.get("/api/contexts", async (req, res) => {
    try {
      const contexts = await storage.getAllContexts();
      res.json(contexts);
    } catch (error) {
      console.error("Get contexts error:", error);
      res.status(500).json({ error: 'Failed to fetch contexts' });
    }
  });

  // Reset all contexts (for testing)
  app.post("/api/contexts/reset", async (req, res) => {
    try {
      await storage.resetAllContexts();
      res.json({ success: true });
    } catch (error) {
      console.error("Reset contexts error:", error);
      res.status(500).json({ error: 'Failed to reset contexts' });
    }
  });

  return httpServer;
}
