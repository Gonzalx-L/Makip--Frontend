// src/App.tsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import Layout from "./components/ui/layout/Layout";
import ScrollToTop from "./components/common/ScrollToTop";

// --- Contextos ---
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

// --- Páginas Públicas ---
import HomePage from "./pages/public/HomePage";
import ProductsPage from "./pages/public/ProductsPage";
import AboutPage from "./pages/public/AboutPage";
import TrackingPage from "./pages/public/TrackingPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import CartPage from "./pages/public/CartPage";
import ProductDetailPage from "./pages/public/ProductDetailPage";
import ContactPage from "./pages/public/ContactPage";
import MisPedidosPage from "./pages/public/MisPedidosPage";
import { TestConnection } from "./pages/TestConnection";

// --- Páginas Admin ---
import LoginAdm from "./pages/Admin/LoginAdm";
import InicioAdm from "./pages/Admin/InicioAdm";
import ProductsPageAdmin from "./pages/Admin/ProductsPage";
import ProductForm from "./pages/Admin/ProductForm";
import OrdersPage from "./pages/Admin/OrdersPage";
import OrderDetailPage from "./pages/Admin/OrderDetailPage";
import ClientsPage from "./pages/Admin/ClientsPage";
import ReportesPage from "./pages/Admin/ReportesPage";
import ConfiguracionPage from "./pages/Admin/ConfiguracionPage";

// --- Componentes de Admin ---
import AdminLayout from "./components/admin/AdminLayout";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

// --- Wrapper de Layout Público ---
const PublicLayoutWrapper: React.FC = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* ---------- GRUPO 1: Rutas Públicas (CON Header/Footer) ---------- */}
            <Route element={<PublicLayoutWrapper />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/productos' element={<ProductsPage />} />
              <Route path='/productos/:id' element={<ProductDetailPage />} />
              <Route path='/tracking/:orderId' element={<TrackingPage />} />
              <Route path='/tracking' element={<TrackingPage />} />
              <Route path='/nosotros' element={<AboutPage />} />
              <Route path='/contacto' element={<ContactPage />} />
              <Route path='/mis-pedidos' element={<MisPedidosPage />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/test-connection' element={<TestConnection />} />
            </Route>

            {/* ---------- GRUPO 2: Rutas Públicas (SIN Header/Footer) ---------- */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/registro' element={<RegisterPage />} />

            {/* ---------- GRUPO 3: Rutas de Admin ---------- */}

            {/* Login Admin (público) */}
            <Route path='/admin/login' element={<LoginAdm />} />

            {/* Rutas protegidas de Admin */}
            <Route element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                {/* Dashboard */}
                <Route path='/admin/dashboard' element={<InicioAdm />} />

                {/* Redirect /admin → /admin/dashboard */}
                <Route
                  path='/admin'
                  element={<Navigate to='/admin/dashboard' replace />}
                />

                {/* Productos */}
                <Route
                  path='/admin/productos'
                  element={<ProductsPageAdmin />}
                />
                <Route
                  path='/admin/productos/nuevo'
                  element={<ProductForm />}
                />
                <Route
                  path='/admin/productos/editar/:id'
                  element={<ProductForm />}
                />

                {/* Órdenes */}
                <Route path='/admin/ordenes' element={<OrdersPage />} />
                <Route
                  path='/admin/ordenes/:id'
                  element={<OrderDetailPage />}
                />

                {/* Clientes */}
                <Route path='/admin/clientes' element={<ClientsPage />} />
                
                {/* Reportes */}
                <Route path='/admin/reportes' element={<ReportesPage />} />
                
                {/* Configuración */}
                <Route path='/admin/configuracion' element={<ConfiguracionPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
