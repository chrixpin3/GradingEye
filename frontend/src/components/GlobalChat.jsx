import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiCpu, FiMinimize2, FiMessageSquare, FiX, FiPaperclip } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import { API_CONFIG } from "../config";

const GlobalChat = () => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: t('chatGreeting') }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/chat-global`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content, history: messages })
            });
            const data = await response.json();
            if (data.success) {
                setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: t('chatError') }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: t('connectionError') }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                title={t('openChat')}
                className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[100] p-4 sm:p-5 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-full shadow-[0_15px_40px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_50px_-5px_rgba(37,99,235,0.6)] hover:-translate-y-2 transition-all duration-500 active:scale-95 group no-print"
            >
                <div className="relative">
                    <FiMessageSquare size={24} sm:size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-2 sm:w-3 h-2 sm:h-3 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></span>
                </div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 sm:bottom-10 right-4 sm:right-10 w-[calc(100%-2rem)] sm:w-[420px] h-[calc(100%-6rem)] sm:h-[650px] bg-[#0f172a]/95 backdrop-blur-2xl border border-slate-700/50 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] z-[200] flex flex-col overflow-hidden animate-slide-up no-print ring-1 ring-white/5">
            {/* Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#1e293b] to-[#0f172a] border-b border-slate-700/50 flex justify-between items-center group">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-blue-500/10 rounded-xl sm:rounded-2xl text-blue-400 group-hover:scale-110 transition-transform duration-500">
                        <FiCpu size={20} sm:size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] leading-none">{t('gradingEye')}</h3>
                        <div className="flex items-center gap-2 mt-1 sm:mt-2">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            <span className="text-[9px] sm:text-[10px] text-emerald-400 font-black uppercase tracking-widest">{t('globalIntelligence')}</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
                    <FiX size={20} />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 sm:space-y-8 scrollbar-hide">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-5 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-xl ${msg.role === 'user'
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none border border-white/10'
                            : 'bg-slate-800/50 text-slate-300 rounded-tl-none border border-slate-700/50 backdrop-blur-md'
                            }`}>
                            {msg.role === 'ai' && (
                                <div className="flex items-center gap-2 mb-3 font-black text-[10px] uppercase tracking-widest text-blue-400">
                                    <FiCpu size={12} />
                                    <span>{t('assistant')}</span>
                                </div>
                            )}
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 px-2">
                            {msg.role === 'ai' ? t('gradingEye') : t('instructor')} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-3 p-5 bg-slate-800/30 rounded-2xl rounded-tl-none border border-slate-700/30 w-1/3 animate-pulse">
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="p-6 sm:p-8 bg-slate-900/40 border-t border-slate-800/60 relative">
                <form onSubmit={handleSend} className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                        <FiPaperclip size={18} className="text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('askAnything')}
                        className="w-full bg-slate-800/40 border border-slate-700/50 text-white pl-10 sm:pl-12 pr-12 sm:pr-16 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-600 text-xs sm:text-sm font-medium"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute inset-y-1.5 right-1.5 px-3 sm:px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-0 transition-all duration-300 flex items-center justify-center active:scale-90"
                    >
                        <FiSend size={14} sm:size={16} />
                    </button>
                </form>
                <p className="text-[8px] sm:text-[9px] text-slate-600 text-center mt-3 sm:mt-4 uppercase tracking-[0.2em] font-black">{t('aiPoweredIntelligence')}</p>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes slide-up {
                from { opacity: 0; transform: translateY(30px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-slide-up {
                animation: slide-up 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            }
        `}} />
        </div>
    );
};

export default GlobalChat;
