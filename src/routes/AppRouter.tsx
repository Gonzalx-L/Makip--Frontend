import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginAdm from "../pages/Admin/LoginAdm";

// --- PÁGINA DE INICIO (DESTINO) ---
// (Creamos un simple placeholder por ahora)
const InicioAdm = () => {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className='p-10'>
      <h1 className='text-3xl'>¡Bienvenido al Dashboard de Admin!</h1>
      <button
        onClick={handleLogout}
        className='mt-4 px-4 py-2 bg-red-600 text-white rounded'>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTA DE LOGIN --- */}
        <Route path='/admin/login' element={<LoginAdm />} />

        {/* --- RUTA DE INICIO (Dashboard) --- */}
        <Route path='/admin/inicio' element={<InicioAdm />} />

        {/* --- (Opcional) Ruta raíz --- */}
        <Route path='/' element={<div>Página de Inicio Pública</div>} />
      </Routes>
    </BrowserRouter>
  );
}
