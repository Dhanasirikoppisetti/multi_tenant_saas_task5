import { createContext, useContext, useEffect, useState } from "react";
import httpClient from "../services/httpClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user on mount
  useEffect(() => {
    async function loadMe() {
      try {
        const res = await httpClient.get("/auth/me");
        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadMe();
  }, []);

  const login = async ({ email, password, tenantSubdomain }) => {
    const res = await httpClient.post("/auth/login", {
      email,
      password,
      tenantSubdomain,
    });

    const { token, user: userData } = res.data.data;

    // store token + user
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await httpClient.post("/auth/logout");
    } catch {
      // ignore
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
