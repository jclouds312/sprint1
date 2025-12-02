import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Database, Server, GitBranch, Terminal, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServerDashboardProps {
  logs: string[];
  context: any;
  onReset: () => void;
}

export function ServerDashboard({ logs, context, onReset }: ServerDashboardProps) {
  const userContext = context["5215555555555"] || null;

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500" />
           <div className="w-3 h-3 rounded-full bg-yellow-500" />
           <div className="w-3 h-3 rounded-full bg-green-500" />
           <span className="ml-2 font-mono text-sm text-muted-foreground">admin@lab-server:~/whatsapp-bot</span>
        </div>
        <button onClick={onReset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors">
            <RefreshCcw className="w-3 h-3" /> Reset System
        </button>
      </div>

      <Tabs defaultValue="context" className="flex-1 flex flex-col min-h-0">
        <div className="px-4 pt-2">
            <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0">
            <TabsTrigger value="context" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 gap-2">
                <Database className="w-4 h-4" /> Context (Redis)
            </TabsTrigger>
            <TabsTrigger value="logs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 gap-2">
                <Terminal className="w-4 h-4" /> Server Logs
            </TabsTrigger>
            <TabsTrigger value="architecture" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 gap-2">
                <Server className="w-4 h-4" /> Architecture
            </TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="context" className="flex-1 p-4 min-h-0 overflow-auto">
            <div className="grid gap-4">
                <Card className="bg-black/20 border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <GitBranch className="w-4 h-4 text-primary" /> Active Flow State
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {userContext ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground block">Current Flow</span>
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-lg py-1">
                                            {userContext.currentFlow}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground block">Current Step</span>
                                        <Badge variant="secondary" className="text-md py-1">
                                            {userContext.step}
                                        </Badge>
                                    </div>
                                </div>
                                <Separator className="bg-border/50" />
                                <div className="space-y-2">
                                    <span className="text-xs text-muted-foreground block">Stored Variables</span>
                                    <pre className="bg-black/40 p-3 rounded-md text-xs font-mono text-green-400 overflow-x-auto">
                                        {JSON.stringify(userContext.variables, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                Waiting for first interaction...
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="logs" className="flex-1 p-0 min-h-0 bg-[#0d1117]">
            <ScrollArea className="h-full w-full p-4">
                <div className="font-mono text-xs space-y-1">
                    {logs.length === 0 && <span className="text-gray-600">System ready. Waiting for events...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-2 border-b border-white/5 pb-1 mb-1 last:border-0">
                            <span className="text-gray-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                            <span className={cn(
                                "break-all",
                                log.includes("[POST]") ? "text-blue-400" : "text-green-400"
                            )}>{log}</span>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </TabsContent>

        <TabsContent value="architecture" className="flex-1 p-4 min-h-0 overflow-auto">
             <div className="flex flex-col gap-4 items-center justify-center h-full text-sm text-muted-foreground">
                <div className="border border-dashed border-border p-6 rounded-lg bg-muted/10 w-full max-w-md text-center space-y-4">
                    <div className="p-3 border border-blue-500/30 bg-blue-500/10 rounded-md text-blue-200 font-mono">
                        POST /webhook
                    </div>
                    <div className="w-0.5 h-6 bg-border mx-auto"></div>
                    <div className="p-3 border border-yellow-500/30 bg-yellow-500/10 rounded-md text-yellow-200 font-mono">
                        WebhookController
                        <div className="text-[10px] text-muted-foreground mt-1">Validates & Normalizes</div>
                    </div>
                    <div className="w-0.5 h-6 bg-border mx-auto"></div>
                    <div className="p-3 border border-purple-500/30 bg-purple-500/10 rounded-md text-purple-200 font-mono">
                        FlowService
                        <div className="text-[10px] text-muted-foreground mt-1">Manages Logic & State</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 relative">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-border"></div>
                         <div className="absolute top-4 left-[25%] right-[25%] h-0.5 bg-border"></div>
                         <div className="absolute top-4 left-[25%] w-0.5 h-4 bg-border"></div>
                         <div className="absolute top-4 right-[25%] w-0.5 h-4 bg-border"></div>
                         
                         <div className="p-2 border border-green-500/30 bg-green-500/10 rounded-md text-green-200 font-mono text-xs">
                            Flow Definitions
                         </div>
                         <div className="p-2 border border-red-500/30 bg-red-500/10 rounded-md text-red-200 font-mono text-xs">
                            Context Store (DB)
                         </div>
                    </div>
                </div>
             </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
