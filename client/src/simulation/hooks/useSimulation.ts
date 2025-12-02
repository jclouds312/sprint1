import { useState, useEffect } from 'react';
import { webhookController } from '../controllers/webhookController';
import { contextStore } from '../context/memory';

export function useWhatsAppSimulation() {
  const [logs, setLogs] = useState<string[]>([]);
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'bot', time: Date}>>([]);
  const [contextState, setContextState] = useState<any>({});

  const refreshContext = async () => {
    const all = contextStore.getAll();
    // Force a new object reference to trigger React renders
    setContextState(JSON.parse(JSON.stringify(all)));
  };

  const sendMessage = async (text: string) => {
    const phoneNumber = "5215555555555"; // Mock user
    
    // Add user message to UI
    const userMsg = { id: Date.now().toString(), text, sender: 'user' as const, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    
    // Log the request
    const logEntry = `[POST] /webhook - Payload: { from: "${phoneNumber}", text: "${text}" }`;
    setLogs(prev => [...prev, logEntry]);

    // Simulate Network Delay
    await new Promise(r => setTimeout(r, 600));

    // Call Controller
    const payload = {
      object: "whatsapp_business_account",
      entry: [{
        changes: [{
          value: {
            messages: [{
              from: phoneNumber,
              text: { body: text },
              type: "text"
            }]
          }
        }]
      }]
    };

    const response = await webhookController.handleIncomingMessage(payload as any);

    // Log the response
    const logResponse = `[RES] 200 OK - Response: ${JSON.stringify(response.message)}`;
    setLogs(prev => [...prev, logResponse]);

    // Add bot response to UI
    if (response.status === 'success') {
      const botMsg = { 
        id: (Date.now() + 1).toString(), 
        text: response.message.text, 
        sender: 'bot' as const, 
        time: new Date() 
      };
      setMessages(prev => [...prev, botMsg]);
    }

    // Update context view
    refreshContext();
  };

  useEffect(() => {
    // Initial Context Load
    refreshContext();
  }, []);

  return {
    logs,
    messages,
    contextState,
    sendMessage,
    resetSimulation: () => {
      contextStore.reset();
      setMessages([]);
      setLogs([]);
      refreshContext();
    }
  };
}
