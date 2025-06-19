"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { IUserSession } from "@/types";

export interface AuthContextProps {
  userData: IUserSession | null;
  setUserData: (userData: IUserSession | null) => void;
  isUserReady: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  userData: null,
  setUserData: () => {},
  isUserReady: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<IUserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserReady, setIsUserReady] = useState(false);

  // 1. Carga inicial desde localStorage
  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed && typeof parsed === "object") {
          setUserData(parsed);
        } else {
          localStorage.removeItem("userSession");
        }
      } catch {
        localStorage.removeItem("userSession");
      }
    }
    setIsUserReady(true); // ✅ Ya cargamos (o determinamos) la sesión
    setLoading(false);
  }, []);

  // 2. Sincroniza cambios de userData a localStorage y cookies
  useEffect(() => {
    if (userData) {
      const normalized = {
        ...userData,
        isAdmin: Boolean(userData.user.isAdmin),
      };
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h
      localStorage.setItem("userSession", JSON.stringify(normalized));
      Cookies.set("userSession", JSON.stringify(normalized), {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires,
      });
    } else {
      localStorage.removeItem("userSession");
      Cookies.remove("userSession");
    }
  }, [userData]);

  if (loading) {
    // Evita renderizar hijos hasta cargar la sesión
    return null;
  }

  return (
    <AuthContext.Provider value={{ userData, setUserData, isUserReady }}>
      {children}
    </AuthContext.Provider>
  );
};