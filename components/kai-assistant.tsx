"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Sparkles, Loader2, Minus, Maximize2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { marked } from 'marked';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

export default function KaiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (instant = false) => {
        messagesEndRef.current?.scrollIntoView({ behavior: instant ? "auto" : "smooth" });
    };

    useEffect(() => {
        if (isOpen && messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleClearChat = () => {
        if (messages.length === 0) return;
        if (window.confirm("Are you sure you want to clear your conversation?")) {
            setMessages([]);
            toast.success("Chat history cleared");
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage = text.trim();
        setInput("");
        
        // Add user message
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) throw new Error("Failed to get response");

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No reader");

            const decoder = new TextDecoder();
            let aiContent = "";
            
            // Add placeholder AI message
            setMessages(prev => [...prev, { role: 'ai', content: "" }]);
            setIsLoading(false); // Stop general loading once stream starts

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                aiContent += chunk;

                // Update the last message (the AI's) with the accumulated content
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1] = { role: 'ai', content: aiContent };
                    return newMsgs;
                });
                
                // Keep scrolling as new content arrives
                scrollToBottom();
            }
        } catch (error: any) {
            toast.error("K.AI is currently offline. Please try again later.");
            console.error(error);
            setIsLoading(false);
        }
    };


    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 sm:gap-2 bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-[0_10px_40px_-10px_var(--color-primary)] transition-all duration-300 hover:scale-105 group"
            >
                <div className="relative">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white"></span>
                    </span>
                </div>
                <span className="font-bold tracking-tight text-sm sm:text-base hidden sm:inline">Ask CareerMind AI</span>
                <span className="font-bold tracking-tight text-sm sm:hidden">Ask AI</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[95vw] md:w-[500px] h-[calc(100vh-8rem)] sm:h-[750px] max-h-[85vh] flex flex-col transition-all duration-500 animate-in slide-in-from-bottom-10 fade-in">
            <Card className="flex-1 flex flex-col bg-[#090812]/98 backdrop-blur-3xl border-white/10 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] overflow-hidden rounded-3xl sm:rounded-[2.5rem]">
                {/* Header */}
                <CardHeader className="p-4 sm:p-5 bg-gradient-to-br from-primary/15 via-transparent to-transparent border-b border-white/5 flex flex-row items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_-5px_var(--color-primary)]">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-sm sm:text-base font-black text-white leading-none mb-1">CareerMind AI</CardTitle>
                            <p className="text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Your Personal Mentor</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleClearChat}
                            disabled={messages.length === 0}
                            className="rounded-lg sm:rounded-xl hover:bg-white/5 text-white/40 hover:text-red-400 transition-colors w-8 h-8 sm:w-10 sm:h-10"
                            title="Clear Chat"
                        >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg sm:rounded-xl hover:bg-white/5 text-white/40 hover:text-white w-8 h-8 sm:w-10 sm:h-10"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                    </div>
                </CardHeader>

                {/* Body */}
                <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 py-8 sm:py-10">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-2 sm:mb-4">
                                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white/20" />
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                <h3 className="text-lg sm:text-xl font-bold text-white">How can I help you?</h3>
                                <p className="text-white/40 text-xs sm:text-sm max-w-[220px] sm:max-w-[240px] leading-relaxed mx-auto">
                                    I am CareerMind AI, your personalized career mentor. Ask me anything about your career path.
                                </p>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div 
                            key={idx} 
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div className={`max-w-[85%] sm:max-w-[90%] p-4 sm:p-6 rounded-2xl sm:rounded-3xl ${
                                msg.role === 'user' 
                                ? 'bg-primary text-white font-bold rounded-tr-sm shadow-[0_10px_25px_-5px_rgba(168,85,247,0.4)]' 
                                : 'bg-white/5 border border-white/10 text-zinc-100 font-medium rounded-tl-sm'
                            }`}>
                                <div 
                                    className="text-[14px] sm:text-[16px] leading-[1.6] tracking-tight chatbot-content"
                                    dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }}
                                />
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-primary/10 border border-primary/20 p-4 rounded-3xl rounded-tl-sm flex items-center gap-3 shadow-[0_0_20px_-5px_var(--color-primary)]">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-[0_0_8px_var(--color-primary)]" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-[0_0_8px_var(--color-primary)]" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-[0_0_8px_var(--color-primary)]" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-[11px] uppercase font-black tracking-[0.1em] text-primary animate-pulse">CareerMind AI is typing...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="p-4 sm:p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl shrink-0">
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend(input);
                        }}
                        className="relative flex items-center gap-2 sm:gap-3"
                    >
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your career..."
                            disabled={isLoading}
                            className="flex-1 bg-white/5 border-white/10 rounded-xl sm:rounded-2xl h-12 sm:h-14 pl-4 sm:pl-5 pr-12 sm:pr-14 text-xs sm:text-sm focus-visible:ring-primary/40"
                        />
                        <Button 
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className="absolute right-1.5 sm:right-2 h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                        </Button>
                    </form>
                    <p className="text-[9px] sm:text-[10px] text-center text-white/20 mt-3 sm:mt-4 font-medium uppercase tracking-[0.2em]">
                        AI guidance can be inaccurate. Cross-verify important steps.
                    </p>
                </div>
            </Card>
        </div>
    );
}
