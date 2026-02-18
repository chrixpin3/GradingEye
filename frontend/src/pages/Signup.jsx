import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiCheck, FiX, FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAward } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

const Signup = () => {
    const { t } = useLanguage();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError(t('passwordsDoNotMatch'));
            return;
        }

        if (!hasSpecialChar || !hasMinLength) {
            setError(t('passwordRequirements'));
            return;
        }

        const res = await register(username, email, password);
        if (res.success) {
            navigate("/");
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b1120] relative overflow-hidden font-sans p-4 sm:p-6">

            {/* Background Glows (Same as Login) */}
            <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-[1100px] relative z-10 flex flex-col md:flex-row bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.7)] rounded-[24px] sm:rounded-[32px] overflow-hidden min-h-[550px] sm:min-h-[650px]">

                {/* Left Column: Branding & Info */}
                <div className="md:w-[40%] bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent p-8 sm:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
                    <div>
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.3)] mb-8">
                            <FiUser className="text-white" size={24} sm:size={26} />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 text-center sm:text-left">
                            {t('joinNetwork').replace('{0}', 'GradingEye ai')}
                        </h2>
                        <p className="text-slate-400 text-base sm:text-lg leading-relaxed text-center sm:text-left mx-auto sm:mx-0">
                            {t('signupDescription')}
                        </p>
                    </div>

                    <div className="mt-8 hidden sm:flex flex-col">
                        <div className="flex items-center gap-3 text-emerald-500/80 mb-4">
                            <FiAward size={18} />
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">{t('certifiedAccessPoint')}</span>
                        </div>
                        <p className="text-slate-500 text-xs text-center sm:text-left">
                            {t('accessRestricted')}
                        </p>
                    </div>
                </div>

                {/* Right Column: Registration Form */}
                <div className="flex-1 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
                    <div className="mb-6 sm:mb-8 text-center">
                        <p className="text-blue-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mb-2">{t('registrationRequired')}</p>
                        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">{t('boardMemberEnrollment')}</h1>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm backdrop-blur-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('fullName')}</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="w-full bg-transparent border border-white/10 px-5 py-4 rounded-none text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                                        placeholder={t('displayName')}
                                    />
                                    <FiUser className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('institutionEmail')}</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-transparent border border-white/10 px-5 py-4 rounded-none text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                                        placeholder="you@school.edu"
                                    />
                                    <FiMail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('accessPassword')}</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-transparent border border-white/10 px-5 py-4 rounded-none text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                                    placeholder={t('createSecurePassword')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('verifyPassword')}</label>
                            <div className="relative group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full bg-transparent border border-white/10 px-5 py-4 rounded-none text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                                    placeholder={t('repeatPassword')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative w-full py-5 rounded-none bg-blue-600 text-white font-bold text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-300 hover:bg-blue-500 active:scale-[0.98] shadow-[0_0_20px_rgba(37,99,235,0.1)] hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                        >
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                            <span className="relative z-10 flex items-center justify-center gap-2 p-12">
                                {t('requestCredentials')}
                                <FiAward className="group-hover:rotate-12 transition-transform" />
                            </span>
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-slate-500">
                            {t('possessCredentials')}{" "}
                            <Link
                                to="/login"
                                className="text-white font-semibold hover:text-blue-400 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-blue-400"
                            >
                                {t('secureLogin')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
