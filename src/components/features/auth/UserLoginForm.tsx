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
const Input = (props: any) => <input {...props} className="border p-2 w-full rounded" />;
const Button = (props: any) => <button {...props} className="bg-blue-600 text-white p-2 w-full rounded" />;
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
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Iniciar Sesión
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700"
          >
            Correo Electrónico
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            required
            placeholder="tu@correo.com"
          />
        </div>
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </div>
      </form>

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">O continúa con</span>
        </div>
      </div>

      {/* Botón de Google */}
      <GoogleLoginButton
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        text="signin_with"
        theme="outline"
        size="large"
      />

      <div className="text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{' '}
        <Link to="/registro" className="font-medium text-blue-600 hover:text-blue-500">
          Regístrate
        </Link>
      </div>
    </div>
  );
};