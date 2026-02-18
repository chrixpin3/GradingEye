import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiShield, FiCamera, FiLoader, FiAlertCircle } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import * as faceapi from "face-api.js";

const Login = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, verifyMFA } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    // MFA States
    const [mfaRequired, setMfaRequired] = useState(false);
    const [mfaUser, setMfaUser] = useState(null);
    const [status, setStatus] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const videoRef = React.useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const [capturedImage, setCapturedImage] = useState(null);

    const loadModels = async () => {
        if (modelsLoaded) return;
        setStatus(t('loadingBiometricModels'));
        const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/weights";
        try {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);
            setModelsLoaded(true);
        } catch (err) {
            console.error("Failed to load models", err);
            setError(t('securityInitFailed'));
        }
    };

    const captureSnapshot = (videoElement) => {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg');
    };

    const startMFACamera = async () => {
        setIsVerifying(true);
        setStatus(t('activatingScanner'));
        await loadModels();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    performFaceChallenge(stream);
                };
            }
        } catch (err) {
            setError(t('cameraAccessRequired'));
            setIsVerifying(false);
        }
    };

    const performFaceChallenge = async (stream) => {
        setStatus(t('scanningBiometricMatch'));
        const startTime = Date.now();

        const interval = setInterval(async () => {
            // Timeout check (10 seconds)
            if (Date.now() - startTime > 10000) {
                clearInterval(interval);
                setError(t('verificationTimedOut'));
                setIsVerifying(false);
                stream.getTracks().forEach(track => track.stop());
                return;
            }

            if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
                return;
            }

            try {
                const detections = await faceapi
                    .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (detections) {
                    clearInterval(interval);
                    setStatus(t('biometricDataDetected'));

                    // Capture and show snapshot
                    const snapshot = captureSnapshot(videoRef.current);
                    setCapturedImage(snapshot);

                    const descriptor = Array.from(detections.descriptor);

                    const res = await verifyMFA(mfaUser.userId, descriptor);
                    if (res.success) {
                        setStatus(t('identityConfirmed'));
                        setTimeout(() => {
                            stream.getTracks().forEach(track => track.stop());
                            navigate("/");
                        }, 1500); // Slight delay to show success on snapshot
                    } else {
                        setError(t('biometricMismatch'));
                        setIsVerifying(false);
                        setCapturedImage(null);
                        stream.getTracks().forEach(track => track.stop());
                    }
                }
            } catch (error) {
                console.error("Detection error:", error);
            }
        }, 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const res = await login(email, password);
        if (res.success) {
            if (res.mfaRequired) {
                setMfaRequired(true);
                setMfaUser({ userId: res.userId, username: res.username });
            } else {
                navigate("/");
            }
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b1120] relative overflow-hidden font-sans p-4 sm:p-6">

            {/* Background Glows */}
            <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-[1000px] relative z-10 flex flex-col md:flex-row bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.7)] rounded-[24px] sm:rounded-[32px] overflow-hidden min-h-[500px] sm:min-h-[600px]">

                {/* Left Column: Branding & Identity */}
                <div className="md:w-[45%] bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent p-8 sm:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
                    <div>
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.3)] mb-8">
                            <FiLogIn className="text-white" size={24} sm:size={26} />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 text-center sm:text-left">
                            {t('loginWelcome').replace('{0}', 'GradingEye ai')}
                        </h2>
                        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xs text-center sm:text-left mx-auto sm:mx-0">
                            {t('brandingDescription')}
                        </p>
                    </div>

                    <div className="mt-8 hidden sm:flex flex-col">
                        <div className="flex items-center gap-3 text-emerald-500/80 mb-4">
                            <FiShield size={18} />
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">{t('highEntropySecurity')}</span>
                        </div>
                        <p className="text-slate-500 text-xs">
                            © 2026 Veritas Institutional Partners. All rights reserved.
                        </p>
                    </div>
                </div>

                {/* Right Column: Authenticated Form */}
                <div className="flex-1 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
                    <div className="mb-8 sm:mb-10 text-center">
                        <p className="text-blue-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mb-2">{t('authenticatedAccess')}</p>
                        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">{t('gradingAuthorization')}</h1>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm backdrop-blur-md">
                            {error}
                        </div>
                    )}

                    {!mfaRequired ? (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        {t('institutionEmail')}
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-transparent border border-white/10 px-5 py-4 rounded-none text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                                            placeholder={t('emailAddress')}
                                        />
                                        <FiMail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        {t('accessCredential')}
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-transparent border border-white/10 px-5 py-4 rounded-none text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                                            placeholder="••••••••••••"
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

                                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider px-1">
                                    <label className="flex items-center gap-2 text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500/50"
                                        />
                                        {t('persistSession')}
                                    </label>
                                    <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">{t('recover')}</button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group relative w-full py-5 rounded-none bg-blue-600 text-white font-bold text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-300 hover:bg-blue-500 active:scale-[0.98] mt-2 shadow-[0_0_20px_rgba(37,99,235,0.1)] hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                            >
                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                                <span className="relative z-10 flex items-center justify-center gap-2 p-12">
                                    {t('authorizeEntry')}
                                    <FiLogIn className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-8 animate-slide-up">
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest">
                                    <FiShield size={14} />
                                    {t('identityVerification')}
                                </div>
                                <p className="text-slate-500 text-sm">{t('welcomeBack')}, <span className="text-white font-bold">{mfaUser?.username}</span>. {t('verificationRequired')}</p>
                            </div>

                            {!isVerifying ? (
                                <button
                                    onClick={startMFACamera}
                                    className="group relative w-full py-6 rounded-none bg-blue-600 text-white font-bold text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-300 hover:bg-blue-500 shadow-xl active:scale-95"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        <FiCamera size={18} />
                                        {t('initializeFaceScan')}
                                    </span>
                                </button>
                            ) : (
                                <div className="space-y-6">
                                    <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                        {capturedImage ? (
                                            <div className="relative w-full h-full">
                                                <img src={capturedImage} alt="Captured Face" className="w-full h-full object-cover grayscale brightness-125 contrast-75 animate-flash" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 mix-blend-overlay">
                                                    <div className="px-6 py-2 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-full shadow-lg scale-110 animate-bounce">
                                                        {t('analyzing')}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <video
                                                    ref={videoRef}
                                                    className="w-full h-full object-cover grayscale brightness-110 contrast-125"
                                                    muted
                                                />
                                                <div className="absolute inset-0 border-[15px] border-[#0a0a0c]/40 z-10"></div>
                                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                                    {/* Corners */}
                                                    <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-blue-500/50 rounded-tl-lg"></div>
                                                    <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-blue-500/50 rounded-tr-lg"></div>
                                                    <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-blue-500/50 rounded-bl-lg"></div>
                                                    <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-blue-500/50 rounded-br-lg"></div>

                                                    {/* Scanning Line */}
                                                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                                                        <div className="relative w-full h-full">
                                                            <div style={{
                                                                position: 'absolute',
                                                                left: 0,
                                                                width: '100%',
                                                                height: '2px',
                                                                background: '#3b82f6',
                                                                boxShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f6',
                                                                animation: 'scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                                                            }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <style>{`
                                        @keyframes scan {
                                            0% { top: 0%; opacity: 0; }
                                            10% { opacity: 1; }
                                            90% { opacity: 1; }
                                            100% { top: 100%; opacity: 0; }
                                        }
                                    `}</style>
                                    <div className="flex items-center justify-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 text-slate-300">
                                        <FiLoader className="animate-spin text-blue-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setMfaRequired(false);
                                    setIsVerifying(false);
                                }}
                                className="w-full py-2 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition"
                            >
                                {t('backToLogin')}
                            </button>
                        </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-xs text-slate-500">
                            {t('newBoardMember')}{" "}
                            <Link
                                to="/signup"
                                className="text-white font-semibold hover:text-blue-400 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-blue-400"
                            >
                                {t('requestCredentials')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
