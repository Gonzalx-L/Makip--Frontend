import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/auth.admin.service";
// Asumiendo que guardaste tu imagen en public/admin-login-bg.png
const imageUrl = "/admin-login-bg.png";

export default function LoginAdm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginAdmin(email, password);
      // ¡Éxito! Redirigimos al dashboard del admin
      // (Usaremos /admin/inicio como la ruta del dashboard)
      navigate("/admin/inicio");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
      {/* --- COLUMNA 1: EL FORMULARIO --- */}
      <div className='flex flex-col justify-center items-center p-8 lg:p-12 order-2 lg:order-1'>
        <div className='w-full max-w-md'>
          <div className='mb-10 text-center lg:text-left'>
            <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
              Bienvenido, Administrador
            </h2>
            <p className='mt-2 text-lg text-gray-600'>
              Gestiona Makip, impulsa tu negocio.
            </p>
          </div>

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                id='email'
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'>
                Contraseña
              </label>
              <input
                id='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            {error && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                <p className='text-sm text-red-700'>{error}</p>
              </div>
            )}

            <div>
              <button
                type='submit'
                disabled={loading}
                className='w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'>
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- COLUMNA 2: LA IMAGEN --- */}
      <div
        className='hidden lg:block relative order-1 lg:order-2 bg-cover bg-center'
        style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className='absolute inset-0 bg-blue-900 opacity-20'></div>
      </div>
    </div>
  );
}
