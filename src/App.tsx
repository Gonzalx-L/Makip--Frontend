import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom"; // 1. Importa Navigate
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
import { TestConnection } from "./pages/TestConnection";

// --- Páginas Admin ---
import LoginAdm from "./pages/Admin/LoginAdm";
import InicioAdm from "./pages/Admin/InicioAdm";

// --- Componentes de Admin ---
import AdminLayout from "./components/admin/AdminLayout";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

// --- Wrapper de Layout Público ---
const PublicLayoutWrapper = () => (
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
            {/* --- GRUPO 1: Rutas Públicas (CON Header/Footer) --- */}
            <Route element={<PublicLayoutWrapper />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/productos' element={<ProductsPage />} />
              <Route path='/productos/:id' element={<ProductDetailPage />} />
              <Route path='/tracking/:orderId' element={<TrackingPage />} />
              <Route path='/nosotros' element={<AboutPage />} />
              <Route path='/contacto' element={<ContactPage />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/test-connection' element={<TestConnection />} />
            </Route>

            {/* --- GRUPO 2: Rutas Públicas (SIN Header/Footer) --- */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/registro' element={<RegisterPage />} />

            {/* --- GRUPO 3: Rutas de Admin (CORREGIDAS) --- */}

            {/* 1. El Login de Admin es PÚBLICO y único */}
            <Route path='/admin/login' element={<LoginAdm />} />

            {/* 2. APLICA EL GUARDIÁN Y EL LAYOUT DE ADMIN */}
            <Route element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                {/* 3. Esta es la ruta correcta a la que te redirige el login.
                  Ahora sí existe y está protegida. 
                */}
                <Route path='/admin/dashboard' element={<InicioAdm />} />

                {/* 4. (Opcional) Redirige /admin a /admin/dashboard */}
                <Route
                  path='/admin'
                  element={<Navigate to='/admin/dashboard' replace />}
                />

                {/* Aquí pondremos las futuras rutas:
                <Route path='/admin/productos' element={<PaginaProductos />} />
                <Route path='/admin/ordenes' element={<PaginaOrdenes />} />
                */}
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
