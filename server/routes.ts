import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { webhookController } from "./controllers/webhookController";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/webhook", async (req: Request, res: Response) => {
    try {
      const rawBody = JSON.stringify(req.body);
      const signature = req.headers['x-hub-signature-256'] as string | undefined;

      if (!webhookController.verifySignature(rawBody, signature)) {
        res.status(401).json({ 
          status: 'unauthorized', 
          message: 'Invalid signature' 
        });
        return;
      }

      const validation = webhookController.validatePayload(req.body);
      
      if (!validation.success) {
        res.status(400).json({ 
          status: 'validation_error', 
          message: 'Invalid payload structure',
          errors: validation.errors 
        });
        return;
      }

      const response = await webhookController.handleIncomingMessage(validation.data);
      res.json(response);
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });

  app.get("/api/contexts", async (req: Request, res: Response) => {
    try {
      const contexts = await storage.getAllContexts();
      res.json(contexts);
    } catch (error) {
      console.error("Get contexts error:", error);
      res.status(500).json({ error: 'Failed to fetch contexts' });
    }
  });

  app.post("/api/contexts/reset", async (req: Request, res: Response) => {
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
