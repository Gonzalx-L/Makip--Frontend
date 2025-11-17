import React, { createContext, useContext, useState, useEffect } from "react";

// Interfaz para los datos del admin (puedes expandirla)
interface AdminUser {
  id: string;
  email: string;
  name: string;
}

// Interfaz para el valor del contexto
interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  token: string | null;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  isLoading: boolean;
}

// 1. Crear el Contexto
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

// 2. Crear el Proveedor (Provider)
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Para saber si estamos listos

  // Al cargar, revisar si hay un token en localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("adminToken");
      const storedUser = localStorage.getItem("adminUser");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setAdminUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al cargar datos de admin del localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, user: AdminUser) => {
    setToken(newToken);
    setAdminUser(user);
    localStorage.setItem("adminToken", newToken);
    localStorage.setItem("adminUser", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  };

  const value = {
    isAdminAuthenticated: !!token && !!adminUser,
    adminUser,
    token,
    login,
    logout,
    isLoading, // Importante para las rutas protegidas
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// 3. Crear el Hook para consumir el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error(
      "useAdminAuth debe ser usado dentro de un AdminAuthProvider"
    );
  }
  return context;
};
