import React, { useState } from "react";
import { Link } from "react-router-dom";

// --- Placeholder (si aún no tienes los componentes de UI) ---
// Borra esto cuando importes los componentes reales de "ui/forms"
const Input = (props: any) => (
  <input
    {...props}
    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white'
  />
);
const Button = (props: any) => (
  <button
    {...props}
    className='w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg'
  />
);
// --- Fin del Placeholder ---

export const UserRegisterForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    // Aquí irá tu lógica para registrar al usuario
    console.log("Register data:", { name, email, password });
    // Simular proceso de registro
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      {/* Botón de retorno al inicio */}
      <div className='mb-4'>
        <Link
          to='/'
          className='inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors duration-200 group'>
          <svg
            className='w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M15 19l-7-7 7-7'
            />
          </svg>
          Volver al inicio
        </Link>
      </div>

      {/* Contenedor principal con diseño mejorado */}
      <div className='bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100'>
        {/* Header con logo/icono */}
        <div className='text-center space-y-2'>
          <div className='mx-auto w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg'>
            <svg
              className='w-8 h-8 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
              />
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-gray-900'>
            ¡Únete a nosotros!
          </h2>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-1'>
            <label
              htmlFor='name'
              className='block text-sm font-semibold text-gray-700 mb-2'>
              Nombre Completo
            </label>
            <Input
              type='text'
              id='name'
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              required
              placeholder='Ingresa tu nombre completo'
            />
          </div>

          <div className='space-y-1'>
            <label
              htmlFor='email'
              className='block text-sm font-semibold text-gray-700 mb-2'>
              Correo Electrónico
            </label>
            <Input
              type='email'
              id='email'
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
              placeholder='Ingresa tu correo electrónico'
            />
          </div>

          <div className='space-y-1'>
            <label
              htmlFor='password'
              className='block text-sm font-semibold text-gray-700 mb-2'>
              Contraseña
            </label>
            <Input
              type='password'
              id='password'
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
              placeholder='Crea una contraseña segura'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Mínimo 8 caracteres con letras y números
            </p>
          </div>

          <div className='space-y-1'>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-semibold text-gray-700 mb-2'>
              Confirmar Contraseña
            </label>
            <Input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              required
              placeholder='Confirma tu contraseña'
            />
            {confirmPassword && password !== confirmPassword && (
              <p className='text-xs text-red-500 mt-1'>
                ❌ Las contraseñas no coinciden
              </p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className='text-xs text-green-500 mt-1'>
                ✅ Las contraseñas coinciden
              </p>
            )}
          </div>

          {/* Términos y condiciones */}
          <div className='flex items-start space-x-2 pt-2'>
            <input
              id='terms'
              name='terms'
              type='checkbox'
              required
              className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1'
            />
            <label htmlFor='terms' className='text-sm text-gray-700'>
              Acepto los{" "}
              <Link
                to='/terms'
                className='font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200'>
                términos y condiciones
              </Link>{" "}
              y la{" "}
              <Link
                to='/privacy'
                className='font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200'>
                política de privacidad
              </Link>
            </label>
          </div>

          <div className='pt-2'>
            <Button type='submit' disabled={loading}>
              {loading ? (
                <div className='flex items-center justify-center'>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Creando cuenta...
                </div>
              ) : (
                "Crear Mi Cuenta"
              )}
            </Button>
          </div>
        </form>

        {/* Footer del formulario */}
        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            ¿Ya tienes una cuenta?{" "}
            <Link
              to='/login'
              className='font-semibold text-teal-600 hover:text-teal-500 transition-colors duration-200'>
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
