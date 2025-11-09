import React from 'react';
// Importamos el formulario que acabamos de crear
import { UserLoginForm } from '../../components/features/auth/UserLoginForm';

const LoginPage: React.FC = () => {
  return (
    // Este div centra el formulario en toda la pantalla
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <UserLoginForm />
    </div>
  );
};

export default LoginPage;