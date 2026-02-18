import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiMessageSquare, FiMinimize2, FiUser, FiCpu, FiMoreVertical, FiPaperclip } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import { API_CONFIG } from "../config";

function ResultChat({ resultData }) {
    const { t } = useLanguage();
    const [messages, setMessages] = useState([
        { role: "ai", text: t('resultChatGreeting').replace('{0}', resultData.student_name) }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/chat-result`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resultData,
                    message: input,
                    history: messages.slice(-6)
                }),
            });

            const data = await response.json();
            if (data.success) {
                setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
            } else {
                setMessages((prev) => [...prev, { role: "ai", text: t('chatError') }]);
            }
        } catch (err) {
            setMessages((prev) => [...prev, { role: "ai", text: t('connectionError') }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] flex items-center justify-center hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all z-50 animate-bounce cursor-pointer group"
                title={t('openChat')}
            >
                <FiMessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
            </button>
        );
    }

    return (
        <div className="fixed top-20 sm:top-24 right-4 sm:right-6 bottom-4 sm:bottom-10 w-[calc(100%-2rem)] sm:w-[420px] bg-[#0f172a]/95 sm:bg-[#0f172a]/90 backdrop-blur-xl border border-slate-700/50 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden no-print animate-slide-in">
            {/* Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-[#1e293b] to-[#0f172a] border-b border-slate-700/50 flex justify-between items-center text-white">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3">
                            <FiCpu className="text-white text-xl" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#1e293b] rounded-full shadow-lg">
                            <div className="w-full h-full bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-black uppercase tracking-tight">{t('gradingEye')}</h3>
                        <div className="flex items-center gap-1.5 opacity-60">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t('contextuallyAware')}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsExpanded(false)} className="p-2.5 hover:bg-slate-700/50 rounded-xl transition-all text-slate-400 hover:text-white group">
                        <FiMinimize2 size={20} className="group-hover:scale-90 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-white/[0.02]">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} gap-2`}>
                        <div className="flex items-center gap-2 px-1">
                            {msg.role === "ai" ? (
                                <>
                                    <FiCpu className="text-blue-400 text-[10px]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('gradingEye')}</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('resultInquiry')}</span>
                                    <FiUser className="text-slate-400 text-[10px]" />
                                </>
                            )}
                        </div>
                        <div className={`max-w-[90%] p-5 rounded-[1.5rem] text-[14px] leading-relaxed transition-all hover:scale-[1.01] ${msg.role === "user"
                            ? "bg-gradient-to-tr from-blue-600 to-blue-500 text-white rounded-tr-none shadow-lg shadow-blue-900/20"
                            : "bg-slate-800/80 text-slate-100 border border-slate-700/50 rounded-tl-none backdrop-blur-sm"
                            }`}>
                            <div className="whitespace-pre-line font-medium">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-2 px-1">
                            <FiCpu className="text-blue-400 text-[10px]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('analyzingEvidence')}</span>
                        </div>
                        <div className="bg-slate-800/50 text-slate-400 p-5 rounded-[1.5rem] rounded-tl-none border border-slate-700/30 backdrop-blur-sm w-40 flex items-center justify-center">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Ultra-Modern Input Area */}
            <div className="p-4 sm:p-8 bg-gradient-to-b from-transparent to-[#0f172a] relative">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

                <form onSubmit={handleSend} className="relative group">
                    {/* Glowing background effect on focus */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 rounded-[2rem] opacity-0 group-focus-within:opacity-20 blur-xl transition-all duration-700"></div>

                    <div className="relative flex items-center bg-[#1e293b]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-2 pr-3 shadow-[0_8px_32px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-white/10 group-focus-within:border-blue-500/30 group-focus-within:bg-[#1e293b]/60">

                        <div className="pl-4 pr-2 text-blue-400 opacity-60 group-focus-within:opacity-100 transition-all duration-300">
                            <FiPaperclip size={18} className="hover:scale-110 cursor-pointer" />
                        </div>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('typeMessage')}
                            className="flex-1 bg-transparent border-none py-4 text-[15px] text-white focus:outline-none focus:ring-0 placeholder:text-slate-500/80 font-medium"
                        />

                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="relative overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 text-white h-10 sm:h-12 px-4 sm:px-6 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-20 disabled:grayscale transition-all duration-300 active:scale-95 group/btn"
                        >
                            <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest hidden xs:block">{t('send')}</span>
                            <FiSend size={16} className="sm:size-[18px] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />

                            {/* Shine effect on button */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        </button>
                    </div>
                </form>

                <div className="mt-4 flex justify-center items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-800"></div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] whitespace-nowrap opacity-40">
                        {t('aiEvidenceAnalysis')}
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #334155, #1e293b);
                    border-radius: 10px;
                }

                @keyframes slide-in {
                    from { transform: translateY(30px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }

                .animate-slide-in {
                    animation: slide-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
            `}</style>
        </div>
    );
}

export default ResultChat;
