import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FiAlertTriangle, FiClock } from 'react-icons/fi';

const WARNING_DURATION = 60 * 1000; // 1 minute warning

const InactivityHandler = ({ children }) => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const timeoutRef = useRef(null);
    const countdownRef = useRef(null);

    // Get timeout from storage or default to 30 mins
    const getTimeoutDuration = () => {
        const stored = localStorage.getItem('inactivity_timeout');
        return stored ? parseInt(stored, 10) * 60 * 1000 : 30 * 60 * 1000;
    };

    const handleLogout = useCallback(async () => {
        console.log("🕒 Auto-logout triggered due to inactivity");
        await logout();
        setShowWarning(false);
        setCountdown(60);
    }, [logout]);

    const resetTimer = useCallback(() => {
        if (showWarning) return;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (user) {
            const duration = getTimeoutDuration();
            timeoutRef.current = setTimeout(() => {
                setShowWarning(true);
                setCountdown(60);
            }, duration);
        }
    }, [user, showWarning]);

    useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        const listener = () => resetTimer();

        // Listen for storage changes (settings update)
        const storageListener = (e) => {
            if (e.key === 'inactivity_timeout' || e.type === 'settings_changed') {
                resetTimer();
            }
        };

        events.forEach(event => window.addEventListener(event, listener));
        window.addEventListener('storage', storageListener);
        window.addEventListener('settings_changed', storageListener);

        resetTimer();

        return () => {
            events.forEach(event => window.removeEventListener(event, listener));
            window.removeEventListener('storage', storageListener);
            window.removeEventListener('settings_changed', storageListener);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [resetTimer]);

    useEffect(() => {
        if (showWarning) {
            if (countdown > 0) {
                countdownRef.current = setInterval(() => {
                    setCountdown(prev => prev - 1);
                }, 1000);
            } else {
                handleLogout();
            }
        }

        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [showWarning, countdown, handleLogout]);

    return (
        <>
            {children}
            {showWarning && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse"></div>

                        <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-6 scale-110 animate-bounce">
                            <FiAlertTriangle size={40} />
                        </div>

                        <h2 className="text-2xl font-black text-white mb-2">{t('securityWarning')}</h2>
                        <p className="text-slate-400 mb-8">
                            {t('inactivityWarningDesc')}
                        </p>

                        <div className="flex flex-col items-center gap-6">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-slate-800"
                                    />
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray="251.2"
                                        strokeDashoffset={251.2 * (1 - countdown / 60)}
                                        className="text-amber-500 transition-all duration-1000"
                                    />
                                </svg>
                                <span className="absolute text-3xl font-black text-white">{countdown}</span>
                            </div>

                            <button
                                onClick={() => {
                                    setShowWarning(false);
                                    setCountdown(60);
                                    resetTimer();
                                }}
                                className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all duration-300"
                            >
                                {t('stillHere')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InactivityHandler;
