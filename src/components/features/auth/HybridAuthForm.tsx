import React, { useState } from 'react';
import { FaGoogle, FaUser, FaUserPlus } from 'react-icons/fa';
import { GoogleLoginButton } from './GoogleLoginButton';
import { TraditionalLoginForm } from './TraditionalLoginForm';
import { TraditionalRegisterForm } from './TraditionalRegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { useAuthContext } from '../../../contexts/AuthContext';

type AuthView = 'main' | 'traditional-login' | 'traditional-register' | 'forgot-password';

interface HybridAuthFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  onSuccessMessage: (message: string) => void;
}

export const HybridAuthForm: React.FC<HybridAuthFormProps> = ({
  onSuccess,
  onError,
  onSuccessMessage
}) => {
  const [currentView, setCurrentView] = useState<AuthView>('main');
  const { login } = useAuthContext();

  const handleBackToMain = () => {
    setCurrentView('main');
  };

  // Wrapper para manejar el éxito del login/registro que actualice el contexto
  const handleAuthSuccess = (userData?: any) => {
    if (userData) {
      login(userData);
    }
    onSuccess();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'traditional-login':
        return (
          <TraditionalLoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setCurrentView('traditional-register')}
            onForgotPassword={() => setCurrentView('forgot-password')}
            onError={onError}
          />
        );

      case 'traditional-register':
        return (
          <TraditionalRegisterForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setCurrentView('traditional-login')}
            onError={onError}
          />
        );

      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBack={() => setCurrentView('traditional-login')}
            onSuccess={onSuccessMessage}
            onError={onError}
          />
        );

      default:
        return (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-teal-700 mb-2">
                Bienvenido
              </h2>
              <p className="text-gray-600">
                Elige cómo quieres acceder a tu cuenta
              </p>
            </div>

            {/* Google OAuth */}
            <div className="space-y-3">
              <div className="text-center text-sm font-medium text-teal-700">
                Opción recomendada
              </div>
              <GoogleLoginButton
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
                onSuccess={async (googleToken: string) => {
                  try {
                    const { authService } = await import('../../../services/authService');
                    const response = await authService.loginWithGoogle(googleToken);
                    // Actualizar contexto con los datos del usuario
                    login(response.client);
                    onSuccess();
                  } catch (error: any) {
                    const errorMessage = error.response?.data?.message ||
                      error.message ||
                      'Error al iniciar sesión con Google';
                    onError(errorMessage);
                  }
                }}
                onError={(error: any) => {
                  console.error('Error de Google Auth:', error);
                  onError('Error al conectar con Google. Inténtalo de nuevo.');
                }}
                text="continue_with"
                theme="outline"
                size="large"
              />
            </div>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">O usa tu email</span>
              </div>
            </div>

            {/* Opciones tradicionales */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrentView('traditional-login')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-teal-100 transition-colors"
              >
                <FaUser className="mr-2" />
                Iniciar Sesión
              </button>

              <button
                onClick={() => setCurrentView('traditional-register')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-teal-100 transition-colors"
              >
                <FaUserPlus className="mr-2" />
                Registrarse
              </button>
            </div>

            {/* Información adicional */}
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>
                Al registrarte o iniciar sesión, aceptas nuestros términos de servicio
              </p>
              <p>
                <strong>¿Por qué crear cuenta?</strong> Para hacer seguimiento a tus pedidos,
                historial de compras y obtener descuentos exclusivos
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Botón de volver (solo visible en vistas secundarias) */}
      {currentView !== 'main' && (
        <div className="mb-4">
          <button
            onClick={handleBackToMain}
            className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a opciones
          </button>
        </div>
      )}

      {renderCurrentView()}
    </div>
  );
};