'use client';

import { IUserSession } from '@/types';
import React, { useState, useEffect, useContext, createContext } from 'react';
import Cookies from 'js-cookie';

export interface AuthContextProps {
  userData: IUserSession | null;
  setUserData: (userData: IUserSession | null) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  userData: null,
  setUserData: () => {},
});

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<IUserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const session = localStorage.getItem('userSession');

    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession && typeof parsedSession === 'object') {
          setUserData(parsedSession);
        } else {
          console.error("Formato inválido en userSession:", session);
          localStorage.removeItem('userSession');
        }
      } catch (error) {
        console.error("Error al parsear userSession desde localStorage:", error);
        localStorage.removeItem('userSession');
      }
    }
    setLoading(false);
  }, []);

  // Guardar o limpiar datos según userData
  useEffect(() => {
    if (userData) {
      const normalizedData = {
        ...userData,
        isAdmin: Boolean(userData?.user?.isAdmin), // ← Asegurar que siempre sea booleano
      };

      localStorage.setItem('userSession', JSON.stringify(normalizedData));
      Cookies.set('userSession', JSON.stringify(normalizedData), {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

    } else {
      localStorage.removeItem('userSession');
      Cookies.remove('userSession');
    }
  }, [userData]);

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};