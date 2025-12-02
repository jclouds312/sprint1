import React, { useRef, useEffect } from 'react';
import { Send, MoreVertical, Phone, Video } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export function ChatInterface({ messages, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = React.useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#efe7dd] dark:bg-[#0b141a] relative font-sans">
      {/* Header */}
      <div className="h-16 bg-[#008069] dark:bg-[#202c33] flex items-center px-4 justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>LB</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-white font-medium text-sm">Laboratorio Bot 🤖</span>
            <span className="text-white/70 text-xs">Online</span>
          </div>
        </div>
        <div className="flex gap-4 text-white">
          <Video className="w-5 h-5" />
          <Phone className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-2 pb-4">
            {/* Encryption Notice */}
            <div className="flex justify-center my-4">
                <div className="bg-[#fcf4cb] dark:bg-[#1f2c34] px-3 py-1.5 rounded-lg shadow-sm max-w-[80%] text-center">
                    <p className="text-[10px] text-gray-600 dark:text-[#8696a0]">
                        🔒 Los mensajes están cifrados de extremo a extremo. Nadie fuera de este chat puede leerlos.
                    </p>
                </div>
            </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[80%] rounded-lg px-3 py-2 shadow-sm relative text-[14px] leading-snug",
                msg.sender === 'user' 
                  ? "self-end bg-[#d9fdd3] dark:bg-[#005c4b] text-gray-900 dark:text-white rounded-tr-none" 
                  : "self-start bg-white dark:bg-[#202c33] text-gray-900 dark:text-white rounded-tl-none"
              )}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={cn(
                "text-[10px] mt-1 flex justify-end",
                msg.sender === 'user' ? "text-gray-500 dark:text-[#8696a0]" : "text-gray-400 dark:text-[#8696a0]"
              )}>
                {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.sender === 'user' && <span className="ml-1 text-[#53bdeb]">✓✓</span>}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-2 bg-[#f0f2f5] dark:bg-[#202c33] flex gap-2 items-center shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-white dark:bg-[#2a3942] rounded-lg px-4 py-2 text-sm focus:outline-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-[#8696a0]"
        />
        <button 
            type="submit"
            disabled={!input.trim()}
            className="p-2 bg-[#008069] hover:bg-[#00a884] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
