import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/ui/layout/Layout';

// --- Importa TODAS las páginas (las tuyas y las de Ren) ---
// Públicas
import HomePage from './pages/public/HomePage';
import ProductsPage from './pages/public/ProductsPage';
import AboutPage from './pages/public/AboutPage';   // <-- La página nueva de REN
import TrackingPage from './pages/public/TrackingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';


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
    <BrowserRouter> 
      <Routes>
        
        {/* --- GRUPO 1: Rutas Públicas (CON Header/Footer) --- */}
        <Route element={<PublicLayoutWrapper />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/tracking/:orderId" element={<TrackingPage />} />
          <Route path="/nosotros" element={<AboutPage />} /> {/* <-- ¡AQUÍ ESTÁ LA RUTA DE REN! */}
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
  )
}

export default App;