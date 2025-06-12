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
      setUserData(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  // Guardar o limpiar datos según userData
  useEffect(() => {
  if (userData) {
    localStorage.setItem('userSession', JSON.stringify(userData));

    // Usamos user.id o user.email como valor de cookie
    Cookies.set('userSession', userData.user.email, {
      path: '/',
      sameSite: 'lax',
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