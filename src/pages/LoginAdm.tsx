import React from 'react';
import loginImg from "../assets/img-login.png";
// 1. Importa el formulario "inteligente" que acabamos de crear
import { AdminLoginForm } from '../components/features/admin/AdminLoginForm';

const LoginAdm = () => (
  <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
    <div className='flex flex-col lg:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden'>
      
      {/* Columna de la Imagen */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <img
          src={loginImg}
          alt='Login'
          className='w-full h-auto max-w-md'
        />
      </div>

      {/* Columna del Formulario */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        {/* 2. Simplemente renderiza el componente del formulario */}
        <AdminLoginForm />
      </div>

    </div>
  </div>
);

export default LoginAdm;