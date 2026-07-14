"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Bot, User, Loader2, Sparkles, ArrowLeft, Stethoscope, Leaf } from "lucide-react";
import Link from "next/link";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
    "I have joint pain and stiffness in the morning — what dosha is imbalanced?",
    "What herbs help with stress and anxiety in Ayurveda?",
    "I feel very hot, irritable and have acid reflux. What does this indicate?",
    "What is the Ayurvedic approach to improve digestion?",
    "I'm always tired and feel cold — could this be Kapha imbalance?",
];

export default function AIChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Namaste 🙏 I am **PrakritiAI**, your Ayurvedic clinical assistant.\n\nI can help you with:\n- **Dosha assessment** based on your symptoms\n- **Herb & supplement recommendations**\n- **Diet and lifestyle guidance** (Dinacharya / Ritucharya)\n- **Panchakarma therapy** suggestions\n\nDescribe your symptoms or ask me any health-related question to get started.",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [useOllama, setUseOllama] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatMarkdown = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br/>');
    };

    const sendMessage = async (content = input.trim()) => {
        if (!content || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: new Date() };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) { router.push("/login"); return; }

            const apiMessages = updatedMessages
                .filter(m => m.id !== "welcome")
                .map(m => ({ role: m.role, content: m.content }));

            const endpoint = useOllama ? "/ai/chat" : "/ai/triage";
            const body = useOllama
                ? JSON.stringify({ messages: apiMessages })
                : JSON.stringify({ symptoms: content });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body,
            });

            if (!res.ok) throw new Error("AI service error");
            const data = await res.json();

            const reply = data.reply || data.response || "I was unable to process that request.";
            const model = data.model || "PrakritiAI";

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: reply,
                timestamp: new Date(),
            }]);
        } catch (err: any) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm having trouble connecting to the AI service right now. Please ensure Ollama is running (`ollama serve`), or try again in a moment.",
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0E1A14] text-white font-sans">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-4 bg-[#0E1A14] border-b border-white/5 shadow-2xl z-10">
                <Link href="/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 bg-[#2D7A5D] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/30">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0E1A14]" />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-100 leading-tight">PrakritiAI</h1>
                        <p className="text-xs text-emerald-400 font-medium">Ayurvedic Clinical Assistant · phi3:mini</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2 text-xs text-gray-500 bg-white/5 rounded-xl px-3 py-2">
                    <Stethoscope className="w-3.5 h-3.5 text-[#4ade80]" />
                    Powered by Ollama
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        {/* Avatar */}
                        <div className={`shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg ${
                            msg.role === "user"
                                ? "bg-indigo-600"
                                : "bg-[#2D7A5D] shadow-green-900/30"
                        }`}>
                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                            <div className={`px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-xl ${
                                msg.role === "user"
                                    ? "bg-indigo-600 text-white rounded-tr-sm"
                                    : "bg-[#1A2F25] text-gray-200 border border-white/5 rounded-tl-sm"
                            }`}>
                                <div
                                    dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                                    className="prose prose-invert prose-sm max-w-none"
                                />
                            </div>
                            <span className="text-[10px] text-gray-600 px-1">
                                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-[#2D7A5D] flex items-center justify-center shadow-lg shadow-green-900/30 shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-[#1A2F25] border border-white/5 px-5 py-4 rounded-2xl rounded-tl-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Loader2 className="w-4 h-4 animate-spin text-[#4ade80]" />
                                <span className="text-sm">Consulting Ayurvedic corpus...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Suggested questions */}
            {messages.length === 1 && (
                <div className="px-4 pb-3">
                    <p className="text-xs text-gray-500 mb-2 px-1">Suggested questions:</p>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {SUGGESTED_QUESTIONS.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage(q)}
                                className="shrink-0 text-xs text-[#4ade80] bg-[#1A2F25] border border-[#2D7A5D]/30 rounded-xl px-3 py-2 hover:bg-[#2D7A5D]/20 transition-colors text-left"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="px-4 pb-6 pt-3 bg-[#0E1A14] border-t border-white/5">
                <div className="flex items-end gap-3 bg-[#1A2F25] border border-white/10 rounded-2xl px-4 py-3 shadow-2xl focus-within:border-[#2D7A5D]/50 transition-colors">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe your symptoms or ask an Ayurvedic question..."
                        rows={1}
                        className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 resize-none outline-none leading-relaxed max-h-32 overflow-y-auto"
                        style={{ scrollbarWidth: "none" }}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        className="shrink-0 w-9 h-9 rounded-xl bg-[#2D7A5D] hover:bg-[#24614A] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-lg shadow-green-900/20"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-600 mt-2">
                    PrakritiAI is an AI assistant, not a replacement for professional medical advice.
                </p>
            </div>
        </div>
    );
}
