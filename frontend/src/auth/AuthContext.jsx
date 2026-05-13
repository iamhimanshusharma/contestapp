/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        api.get("/auth/me")
            .then((res) => {
                setUser(res.data.user);
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
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const value = useMemo(() => ({
        user,
        isAuthenticated: Boolean(user),
        applySession,
        logout
    }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
