"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * CONTEXTO DE AUTENTICAÇÃO (STATE MANAGEMENT)
 * O uso de Context API permite que qualquer componente do app saiba
 * se existe um usuário logado sem a necessidade de passar "props" manualmente.
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

/**
 * PROVIDER: Envolve toda a aplicação (no layout.tsx) para monitorar
 * a sessão do usuário em tempo real.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // OBSERVER: O Firebase fornece um observador que detecta automaticamente
    // mudanças no estado de login (login, logout, token expirado).
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // CLEANUP: Remove o observador quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// HOOK PERSONALIZADO: Facilita o acesso aos dados do usuário (ex: useAuth())
export const useAuth = () => useContext(AuthContext);
