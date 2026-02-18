import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const { t } = useLanguage();

    if (loading) return <div className="text-white">{t('loading')}</div>;
    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
