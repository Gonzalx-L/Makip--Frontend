import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HybridAuthForm } from '../../components/features/auth/HybridAuthForm';

const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSuccess = () => {
    setSuccessMessage('¡Autenticación exitosa! Redirigiendo...');
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
    setSuccessMessage('');
  };

  const handleSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage('');
  };

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {/* Mensajes de estado */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Formulario híbrido de autenticación */}
        <HybridAuthForm
          onSuccess={handleSuccess}
          onError={handleError}
          onSuccessMessage={handleSuccessMessage}
        />
        
        {/* Opción de continuar sin cuenta */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-3">
            ¿Solo quieres hacer un pedido?
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 px-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
          >
            Continuar sin cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;