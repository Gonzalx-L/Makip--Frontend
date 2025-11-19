import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { authService } from '../../../services/authService';
import { useAuthContext } from '../../../contexts/AuthContext';

interface TraditionalLoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  onError: (error: string) => void;
}

export const TraditionalLoginForm: React.FC<TraditionalLoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onForgotPassword,
  onError
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      onError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });

      // Actualizar contexto con los datos del usuario
      login(response.client);
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Error al iniciar sesión';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-teal-700">
        Iniciar Sesión
      </h2>

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
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="tu@email.com"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Tu contraseña"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿No tienes cuenta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};