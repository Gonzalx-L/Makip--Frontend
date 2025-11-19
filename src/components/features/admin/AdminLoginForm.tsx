import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminLoginForm: React.FC = () => {
  const [email, setEmail] = useState("admin@makip.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/v1/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      localStorage.setItem("adminToken", data.token);
      navigate("/admin"); // Redirige al Dashboard
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form className='w-full max-w-sm' onSubmit={handleSubmit}>
      <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>
        Panel de Acceso
      </h1>

      <div className='mb-4'>
        <label
          htmlFor='usuario'
          className='block text-sm font-medium text-gray-700 mb-1'>
          Usuario
        </label>
        <input
          id='usuario'
          name='usuario'
          type='email'
          placeholder='Tu usuario'
          className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
          autoComplete='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className='mb-6'>
        <label
          htmlFor='clave'
          className='block text-sm font-medium text-gray-700 mb-1'>
          Contraseña
        </label>
        <input
          id='clave'
          name='clave'
          type='password'
          placeholder='Tu contraseña'
          className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
          autoComplete='current-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <p className='text-red-500 text-sm text-center mb-4'>{error}</p>
      )}

      <button
        type='submit'
        className='w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300'>
        Ingresar
      </button>

      <div className='text-center mt-4'>
        <a href='#' className='text-sm text-blue-600 hover:underline'>
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </form>
  );
};
