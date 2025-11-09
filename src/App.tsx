import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/ui/layout/Layout';
import ScrollToTop from './components/common/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';

// Públicas
import HomePage from './pages/public/HomePage';
import ProductsPage from './pages/public/ProductsPage';
import AboutPage from './pages/public/AboutPage';   // <-- La página nueva de REN
import TrackingPage from './pages/public/TrackingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import CartPage from './pages/public/CartPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import ContactPage from './pages/public/ContactPage';
import { TestConnection } from './pages/TestConnection';

// Admin
import LoginAdm from "./pages/LoginAdm"
import InicioAdm from './pages/InicioAdm';

// --- Tu componente "envoltorio" que aplica el Layout ---
const PublicLayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop/>
        <Routes>
        {/* --- GRUPO 1: Rutas Públicas (CON Header/Footer) --- */}
        <Route element={<PublicLayoutWrapper />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/productos/:id" element={<ProductDetailPage />} />
          <Route path="/tracking/:orderId" element={<TrackingPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/test-connection" element={<TestConnection />} />
          {/* Aquí puedes agregar /productos, /contacto, etc. */}
        </Route>

        {/* --- GRUPO 2: Rutas de Pantalla Completa (SIN Header/Footer) --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* 2. AÑADE LA NUEVA RUTA AQUÍ */}
        <Route path="/registro" element={<RegisterPage />} />
        {/* (Usamos /registro para que coincida con el botón de tu HomePage) */}

        <Route path="/admin" element={<InicioAdm />} />
        <Route path="/login-admin" element={<LoginAdm />} />

      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;