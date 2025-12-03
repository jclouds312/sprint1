import { useState, useEffect } from 'react';

export function useWhatsAppSimulation() {
  const [logs, setLogs] = useState<string[]>([]);
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'bot', time: Date}>>([]);
  const [contextState, setContextState] = useState<any>({});

  const refreshContext = async () => {
    try {
      const response = await fetch('/api/contexts');
      const contexts = await response.json();
      
      // Convert array to object keyed by phoneNumber for display
      const contextMap: any = {};
      contexts.forEach((ctx: any) => {
        contextMap[ctx.phoneNumber] = ctx;
      });
      
      setContextState(contextMap);
    } catch (error) {
      console.error('Failed to refresh context:', error);
    }
  };

  const sendMessage = async (text: string) => {
    const phoneNumber = "5215555555555"; // Mock user
    
    // Add user message to UI
    const userMsg = { id: Date.now().toString(), text, sender: 'user' as const, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    
    // Log the request
    const logEntry = `[POST] /api/webhook - Payload: { from: "${phoneNumber}", text: "${text}" }`;
    setLogs(prev => [...prev, logEntry]);

    try {
      // Call real backend API
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

      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      // Log the response
      const logResponse = `[RES] ${response.status} - Response: ${JSON.stringify(data.message)}`;
      setLogs(prev => [...prev, logResponse]);

      // Add bot response to UI
      if (data.status === 'success' && typeof data.message !== 'string') {
        const botMsg = { 
          id: (Date.now() + 1).toString(), 
          text: data.message.text, 
          sender: 'bot' as const, 
          time: new Date() 
        };
        setMessages(prev => [...prev, botMsg]);
      }

      // Update context view
      await refreshContext();
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorLog = `[ERROR] Failed to send message: ${error}`;
      setLogs(prev => [...prev, errorLog]);
    }
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
    resetSimulation: async () => {
      try {
        await fetch('/api/contexts/reset', { method: 'POST' });
        setMessages([]);
        setLogs([]);
        await refreshContext();
      } catch (error) {
        console.error('Failed to reset:', error);
      }
    }
  };
}
