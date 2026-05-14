import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, X, Send, User, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../lib/utils';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: 'Hello! I am SecureMate AI. How can I help you strengthen your digital fortress today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: userMessage,
                history: messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }))
            }, {
                headers: { 'x-auth-token': token }
            });

            setMessages(prev => [...prev, { role: 'model', content: response.data.response }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'model', content: '**Error**: I encountered a network issue. Please check your connection and try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className={cn(
                    "mb-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-500",
                    isMaximized ? "w-[90vw] h-[80vh] sm:w-[600px] sm:h-[700px]" : "w-80 sm:w-96 h-[550px]"
                )}>
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h3 className="text-white font-bold text-sm tracking-tight">SecureMate AI</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase text-xs">Online Expert Assistant</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                            >
                                <Maximize2 size={16} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-slate-400 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth relative">
                        {messages.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <div className="p-8 rounded-full bg-blue-500/5 animate-vibrate">
                                    <Bot size={80} className="text-blue-500/30" />
                                </div>
                                <p className="mt-4 text-[10px] font-bold tracking-[0.2em] uppercase text-blue-500/20">SecureMate AI</p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={cn("flex items-start gap-3", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                <div className={cn(
                                    "p-2 rounded-xl shrink-0 shadow-sm transition-all animate-in zoom-in-50",
                                    m.role === 'user' ? "bg-primary-600" : "bg-slate-800"
                                )}>
                                    {m.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-primary-400" />}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm prose prose-invert max-w-[85%] animate-in fade-in slide-in-from-top-1",
                                    m.role === 'user'
                                        ? "bg-primary-600 text-white rounded-tr-none"
                                        : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none"
                                )}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {m.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3 animate-pulse">
                                <div className="p-2 rounded-xl bg-slate-800 shrink-0">
                                    <Bot className="h-4 w-4 text-primary-400" />
                                </div>
                                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="h-1.5 w-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="h-1.5 w-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="h-1.5 w-1.5 bg-primary-500 rounded-full animate-bounce" />
                                    </div>
                                    <span className="text-slate-400 text-[11px] font-medium italic">Analyzing security data...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-xl flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about cybersecurity, device safety..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all placeholder:text-slate-600"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center group"
                        >
                            <Send className={cn("h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5", isLoading && "animate-ping")} />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-[0_10px_40px_rgba(37,99,235,0.4)] transition-all duration-500 transform active:scale-90 relative overflow-hidden group",
                    isOpen ? "bg-slate-800 rotate-[360deg] scale-90" : "bg-primary-600 hover:bg-primary-500 hover:scale-110 animate-bounce-subtle"
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent transition-opacity group-hover:opacity-100 opacity-0" />
                {isOpen ? (
                    <X className="h-7 w-7 text-white" />
                ) : (
                    <Bot className="h-8 w-8 text-white animate-in zoom-in-50 duration-500" />
                )}
                {!isOpen && (
                    <div className="absolute top-0 right-0 flex h-6 w-6 -mr-1 -mt-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500 border-2 border-slate-950 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white leading-none">AI</span>
                        </span>
                    </div>
                )}
            </button>
        </div>
    );
}
