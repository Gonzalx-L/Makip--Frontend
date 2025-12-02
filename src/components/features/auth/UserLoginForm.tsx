import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { authService } from "../../../services/authService";
import { useAuthContext } from "../../../contexts/AuthContext";

// Asumo que tus componentes de UI se exportan así.
// ¡Verifica la ruta y los nombres!
// import { Input } from '../../ui/forms/Input'; 
//import { Button } from '../../ui/forms/Button';

// --- Placeholder (si aún no tienes los componentes de UI) ---
// Borra esto cuando importes los componentes reales de "ui/forms"
/* const Input = (props: any) => (
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
); */
// --- Fin del Placeholder ---

export const UserLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  /* const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login({ email, password });

      console.log('Login exitoso:', response);

      // Actualizar el contexto de autenticación
      login(response.client);

      alert(`¡Bienvenido de nuevo ${response.client.name}!`);

      // Redirigir al usuario después del login
      navigate('/');
    } catch (error: any) {
      console.error('Error en login:', error);

      // Mostrar mensaje de error más específico
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Error al iniciar sesión. Verifica tus credenciales.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }; */

  const handleGoogleSuccess = async (googleToken: string) => {
    try {
      setLoading(true);
      const response = await authService.loginWithGoogle(googleToken);

      console.log('Login exitoso:', response);

      // Actualizar el contexto de autenticación
      login(response.client);


      if (response.isNewUser) {
        alert(
          `¡Bienvenido ${response.client.name}! Tu cuenta ha sido creada exitosamente.`
        );
      } else {
        alert(`¡Hola de nuevo ${response.client.name}!`);
      }


      // Redirigir al usuario después del login
      navigate("/");
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al iniciar sesión con Google. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error: any) => {
    console.error("Error de Google Auth:", error);
    alert("Error al conectar con Google. Inténtalo de nuevo.");
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Iniciar Sesión con Google
        </h2>
        <p className="text-gray-600 mt-2">
          Accede de forma rápida y segura
        </p>
      </div>

      {/* Botón de Google */}
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

      {loading && (
        <div className="mt-4 flex items-center justify-center text-gray-600">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Iniciando sesión...
        </div>
      )}

      {/* Info adicional */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Al iniciar sesión con Google, aceptas nuestros{' '}
          <Link to="/terms" className="text-blue-600 hover:text-blue-700">
            términos de servicio
          </Link>{' '}
          y{' '}
          <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
            política de privacidad
          </Link>
        </p>
      </div>
    </div>
  );
};
