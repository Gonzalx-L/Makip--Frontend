import React, { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Client } from "../services/authService";

interface AuthContextType {
  user: Client | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: Client) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Añade esta línea de comentario para corregir el error
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
