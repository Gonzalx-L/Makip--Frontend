import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLoginButton } from './GoogleLoginButton';
import { authService } from '../../../services/authService';
import { useAuthContext } from '../../../contexts/AuthContext';

// Asumo que tus componentes de UI se exportan así.
// ¡Verifica la ruta y los nombres!
// import { Input } from '../../ui/forms/Input'; 
// import { Button } from '../../ui/forms/Button';

// --- Placeholder (si aún no tienes los componentes de UI) ---
// Borra esto cuando importes los componentes reales de "ui/forms"
const Input = (props: any) => (
  <input 
    {...props} 
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 outline-none bg-gray-50 hover:bg-white" 
  />
);
const Button = (props: any) => (
  <button 
    {...props} 
    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
  />
);
// --- Fin del Placeholder ---


export const UserLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá tu lógica de autenticación tradicional si la tienes
    console.log('Login data:', { email, password });
  };

  const handleGoogleSuccess = async (googleToken: string) => {
    try {
      setLoading(true);
      const response = await authService.loginWithGoogle(googleToken);
      
      console.log('Login exitoso:', response);
      
      // Actualizar el contexto de autenticación
      login(response.client);
      
      if (response.isNewUser) {
        alert(`¡Bienvenido ${response.client.name}! Tu cuenta ha sido creada exitosamente.`);
      } else {
        alert(`¡Hola de nuevo ${response.client.name}!`);
      }
      
      // Redirigir al usuario después del login
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al iniciar sesión con Google. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error: any) => {
    console.error('Error de Google Auth:', error);
    alert('Error al conectar con Google. Inténtalo de nuevo.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Contenedor principal con diseño mejorado */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100">
        {/* Header con logo/icono */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido de vuelta!
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Correo Electrónico
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
              placeholder="Ingresa tu correo electrónico"
            />
          </div>
          
          <div className="space-y-1">
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>
            <div className="text-sm">
              <Link 
                to="/forgot-password" 
                className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </div>
        </form>

        {/* Separador elegante */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">O continúa con</span>
          </div>
        </div>

        {/* Botón de Google mejorado */}
        <div className="space-y-4">
          <GoogleLoginButton
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signin_with"
            theme="outline"
            size="large"
          />
        </div>

        {/* Footer del formulario */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link 
              to="/registro" 
              className="font-semibold text-teal-600 hover:text-teal-500 transition-colors duration-200"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};