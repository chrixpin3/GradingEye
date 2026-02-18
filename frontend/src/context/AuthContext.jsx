import React, { createContext, useContext, useState, useEffect } from "react";
import { API_CONFIG } from "../config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/me`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Auth check failed", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.mfaRequired) {
                    return { success: true, mfaRequired: true, userId: data.userId, username: data.username };
                }
                setUser(data.user);
                return { success: true };
            }
            return { success: false, error: data.error || "Login failed" };
        } catch (err) {
            return { success: false, error: "Network error" };
        }
    };

    const verifyMFA = async (userId, descriptor) => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/verify-face-mfa`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ userId, descriptor }),
            });

            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                return { success: true };
            }
            return { success: false, error: data.error || "MFA verification failed" };
        } catch (err) {
            return { success: false, error: "Network error" };
        }
    };

    const enableMFA = async (descriptor) => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/enable-face-mfa`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ descriptor }),
            });

            if (res.ok) {
                // Refresh user state to reflect MFA enabled
                await checkUser();
                return { success: true };
            }
            const data = await res.json();
            return { success: false, error: data.error || "Failed to enable MFA" };
        } catch (err) {
            return { success: false, error: "Network error" };
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                return { success: true };
            }
            return { success: false, error: data.error || "Registration failed" };
        } catch (err) {
            return { success: false, error: "Network error" };
        }
    };

    const logout = async () => {
        await fetch(`${API_CONFIG.BASE_URL}/api/auth/logout`, {
            method: "POST",
            credentials: 'include'
        });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, verifyMFA, enableMFA }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
