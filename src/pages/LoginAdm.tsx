import React from 'react'; // <--- ¡Asegúrate de importar React!
import loginImg from "../assets/img-login.png";

const LoginAdm = () => (
  // Contenedor principal: pantalla completa, centrado, fondo gris claro
  <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
    
    {/* Contenedor de la tarjeta: dos columnas en pantallas grandes (lg), una columna en móvil */}
    <div className='flex flex-col lg:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden'>
      
      {/* Columna de la Imagen */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <img
          src={loginImg}
          alt='Login'
          className='w-full h-auto max-w-md' // Ancho completo, pero con un máximo
        />
      </div>

      {/* Columna del Formulario */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <form
          className='w-full max-w-sm' // Ancho completo, pero con un máximo
        >
          <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>Panel de Acceso</h1>
          
          {/* Grupo de Usuario */}
          <div className='mb-4'>
            <label htmlFor='usuario' className='block text-sm font-medium text-gray-700 mb-1'>
              Usuario
            </label>
            <input
              id='usuario'
              name='usuario'
              type='text'
              placeholder='Tu usuario'
              className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              autoComplete='username'
            />
          </div>
          
          {/* Grupo de Contraseña */}
          <div className='mb-6'>
            <label htmlFor='clave' className='block text-sm font-medium text-gray-700 mb-1'>
              Contraseña
            </label>
            <input
              id='clave'
              name='clave'
              type='password'
              placeholder='Tu contraseña'
              className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              autoComplete='current-password'
            />
          </div>
          
          {/* Botón de Ingresar */}
          <button type='submit' className='w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300'>
            Ingresar
          </button>
          
          {/* Enlace de Olvidaste Contraseña */}
          <div className='text-center mt-4'>
            <a href='#' className='text-sm text-blue-600 hover:underline'>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>
      
    </div>
  </div>
);

export default LoginAdm;