/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [theme, setTheme] = useState(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) return JSON.parse(storedUser).theme || "light";
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        api.get("/auth/me")
            .then((res) => {
                setUser(res.data.user);
                setTheme(res.data.user.theme || "light");
                localStorage.setItem("user", JSON.stringify(res.data.user));
            })
            .catch(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            });
    }, []);

    const applySession = (token, nextUser) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(nextUser));
        setUser(nextUser);
        setTheme(nextUser.theme || "light");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const updateTheme = useCallback(async (nextTheme) => {
        setTheme(nextTheme);

        if (!user) return;

        try {
            const res = await api.patch("/auth/theme", { theme: nextTheme });
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (error) {
            console.error(error);
        }
    }, [user]);

    const value = useMemo(() => ({
        user,
        isAuthenticated: Boolean(user),
        theme,
        applySession,
        logout,
        updateTheme
    }), [user, theme, updateTheme]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
