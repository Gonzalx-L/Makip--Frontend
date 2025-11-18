import React, { useState } from 'react';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { authService } from '../../../services/authService';

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBack,
  onSuccess,
  onError
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      onError('Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      onSuccess(response.message);
      setEmail(''); // Limpiar el formulario
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al enviar el enlace de recuperación';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          Recuperar Contraseña
        </h2>
      </div>
      
      <div className="mb-4 text-gray-600">
        <p>Ingresa tu correo electrónico y te enviaremos un enlace para recuperar tu contraseña.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tu@email.com"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Enviando enlace...
            </>
          ) : (
            'Enviar Enlace de Recuperación'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿Recordaste tu contraseña?{' '}
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Volver al login
          </button>
        </p>
      </div>
    </div>
  );
};