import React from 'react';
import { PhoneFrame } from '@/components/simulation/PhoneFrame';
import { ChatInterface } from '@/components/simulation/ChatInterface';
import { ServerDashboard } from '@/components/simulation/ServerDashboard';
import { useWhatsAppSimulation } from '@/simulation/hooks/useSimulation';

export default function Dashboard() {
  const { messages, logs, contextState, sendMessage, resetSimulation } = useWhatsAppSimulation();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans overflow-hidden flex flex-col">
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Sprint 1: WhatsApp Flow Architecture</h1>
            <p className="text-muted-foreground text-sm">Simulador de entorno de desarrollo • Laboratorio Bot</p>
        </div>
        <div className="text-xs text-right text-muted-foreground hidden md:block">
            <div className="flex items-center gap-2 justify-end">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Online
            </div>
            <div>v1.0.0-alpha</div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        {/* Left Panel: Server State */}
        <div className="lg:col-span-7 xl:col-span-8 h-[600px] lg:h-auto">
            <ServerDashboard 
                logs={logs} 
                context={contextState} 
                onReset={resetSimulation}
            />
        </div>

        {/* Right Panel: Phone Simulator */}
        <div className="lg:col-span-5 xl:col-span-4 flex justify-center items-center bg-muted/5 rounded-xl p-4 border border-white/5">
          <PhoneFrame className="scale-90 sm:scale-100 transition-transform duration-300">
            <ChatInterface 
                messages={messages} 
                onSendMessage={sendMessage} 
            />
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}
