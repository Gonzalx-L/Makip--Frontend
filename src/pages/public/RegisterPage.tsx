import React from 'react';
// Importamos el formulario que acabamos de crear
import { UserRegisterForm } from '../../components/features/auth/UserRegisterForm';

const RegisterPage: React.FC = () => {
  return (
    // Este div centra el formulario en toda la pantalla
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <UserRegisterForm />
    </div>
  );
};

export default RegisterPage;