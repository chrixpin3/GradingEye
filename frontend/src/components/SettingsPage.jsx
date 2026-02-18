import React, { useState, useEffect } from "react";
import bgImage from "../assets/bg.jpeg";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { API_CONFIG } from "../config";
import {
    FiSettings, FiUser, FiLock, FiShield,
    FiCpu, FiGlobe, FiLogOut, FiCheck,
    FiClock, FiX, FiLayout, FiMaximize
} from "react-icons/fi";

function SettingsPage() {
    const { user, logout } = useAuth();
    const { language, setLanguage, allLanguages, t } = useLanguage();

    const [activeTab, setActiveTab] = useState("security");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" });
    const [passStatus, setPassStatus] = useState({ type: "", msg: "" });
    const [sessionTimeout, setSessionTimeout] = useState("30");

    useEffect(() => {
        const storedTimeout = localStorage.getItem("inactivity_timeout");
        if (storedTimeout) setSessionTimeout(storedTimeout);
    }, []);

    const tabs = [
        { id: "account", label: t('account'), icon: FiUser },
        { id: "general", label: t('general'), icon: FiLayout },
        { id: "security", label: t('security'), icon: FiShield },
    ];

    const handleTimeoutChange = (minutes) => {
        setSessionTimeout(minutes);
        localStorage.setItem("inactivity_timeout", minutes);
        window.dispatchEvent(new Event("settings_changed"));
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPassStatus({ type: "", msg: "" });

        if (passForm.new !== passForm.confirm) {
            setPassStatus({ type: "error", msg: t('passwordsDoNotMatch') });
            return;
        }

        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/update-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passForm.current,
                    newPassword: passForm.new
                }),
                credentials: "include"
            });

            const data = await res.json();
            if (res.ok) {
                setPassStatus({ type: "success", msg: t('passwordUpdatedSuccess') });
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setPassForm({ current: "", new: "", confirm: "" });
                    setPassStatus({ type: "", msg: "" });
                }, 1500);
            } else {
                setPassStatus({ type: "error", msg: data.error || t('incorrectCurrentPassword') });
            }
        } catch {
            setPassStatus({ type: "error", msg: t('serverConnectionFailed') });
        }
    };

    const Card = ({ children }) => (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl hover:border-blue-500/30 transition-all duration-300">
            {children}
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {

            case "account":
                return (
                    <div className="space-y-10">
                        <Card>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{user?.username}</h2>
                                        <p className="text-slate-400 text-sm">{user?.email}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition"
                                >
                                    <FiLogOut />
                                    {t('signOutSession')}
                                </button>
                            </div>
                        </Card>
                    </div>
                );

            case "security":
                return (
                    <div className="space-y-10">
                        <Card>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <FiLock className="text-blue-500" size={24} />
                                    <div>
                                        <h3 className="text-white font-semibold">{t('password')}</h3>
                                        <p className="text-slate-400 text-sm">{t('passwordDescription')}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm transition"
                                >
                                    {t('updatePassword')}
                                </button>
                                <br />
                            </div>
                        </Card>
                        <br /><br />
                        <Card>
                            <h3 className="text-white font-semibold mb-6">{t('sessionManagement')}</h3>
                            <div className="flex gap-4 flex-wrap">
                                {["1", "5", "15", "30", "60"].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => handleTimeoutChange(val)}
                                        className={`px-6 py-3 rounded-xl border transition ${sessionTimeout === val
                                            ? "bg-blue-600 text-white border-blue-500"
                                            : "bg-white/5 text-slate-400 border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>
                );

            case "general":
                return (
                    <div className="space-y-10"><br />
                        <Card><br /><br />
                            <div className="flex items-center gap-4 mb-6">
                                <FiGlobe className="text-blue-500" size={24} />
                                <h3 className="text-white font-semibold">{t('language')}</h3>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {allLanguages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={`p-6 rounded-xl border transition text-sm ${language === lang.code
                                            ? "bg-blue-600 text-white border-blue-500"
                                            : "bg-white/5 text-slate-400 border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>
                );



            default:
                return null;
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-[#0a0f1a] p-8"
            style={{
                backgroundImage: `linear-gradient(rgba(23, 23, 117, 0.45), rgba(20, 2, 91, 1), rgba(4, 22, 114, 0.68), rgba(3, 22, 61, 0.71), rgba(14, 16, 66, 0.67)), url(${bgImage})`,

            }}
        >
            <div className="w-full max-w-7xl h-[85vh] bg-black/40 border border-white/10 rounded-3xl shadow-2xl flex overflow-hidden">

                {/* Sidebar */}
                <div className="w-72 border-r border-white/10 p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-10">
                        <FiSettings className="text-blue-500" size={24} />
                        <h1 className="text-white font-bold text-lg">{t('settingsTitle')}</h1>
                    </div>

                    {tabs.map((tab) => (
                        <React.Fragment key={tab.id}>
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === tab.id
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                            <br />
                        </React.Fragment>
                    ))}

                    <div className="pt-10 border-t border-white/10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-300 text-sm">{user?.username}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-12 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
                    <div className="bg-[#0f172a] w-full max-w-md p-8 rounded-2xl border border-white/10">
                        <h3 className="text-white font-semibold mb-6">{t('updatePassword')}</h3>

                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <input
                                type="password"
                                placeholder={t('currentPassword')}
                                value={passForm.current}
                                onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
                                required
                            />
                            <input
                                type="password"
                                placeholder={t('newPassword')}
                                value={passForm.new}
                                onChange={(e) => setPassForm({ ...passForm, new: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
                                required
                            />
                            <input
                                type="password"
                                placeholder={t('confirmNewPassword')}
                                value={passForm.confirm}
                                onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white"
                                required
                            />

                            {passStatus.msg && (
                                <div className={`text-sm ${passStatus.type === "error"
                                    ? "text-red-500"
                                    : "text-green-500"
                                    }`}>
                                    {passStatus.msg}
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 py-2 bg-white/10 rounded-lg text-slate-300"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
                                >
                                    {t('update')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SettingsPage;
