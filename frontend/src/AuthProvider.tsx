import React, { createContext, useContext, useState } from "react";
import api from "./axiosInstance";
import AuthRequest from "./domain/AuthRequest";
import AuthResponse from "./domain/AuthResponse";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const handleAuth = async (url: string, data: AuthRequest) => {
    const response = await api.post<AuthResponse>(url, data);
    setToken(response.data.token);
    localStorage.setItem("token", response.data.token);
  };

  const login = (username: string, password: string) =>
    handleAuth("/auth/login", { username, password });

  const register = (username: string, password: string) =>
    handleAuth("/auth/register", { username, password });

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
