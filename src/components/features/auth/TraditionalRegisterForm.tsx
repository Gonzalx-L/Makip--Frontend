import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { authService } from '../../../services/authService';
import { useAuthContext } from '../../../contexts/AuthContext';

interface TraditionalRegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  onError: (error: string) => void;
}

export const TraditionalRegisterForm: React.FC<TraditionalRegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  onError
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dni: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const { login } = useAuthContext();

  // Función para validar la fortaleza de la contraseña
  const validatePasswordStrength = (password: string) => {
    if (password.length < 8) return 'weak';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (strengthCount >= 3 && password.length >= 10) return 'strong';
    if (strengthCount >= 2 && password.length >= 8) return 'medium';
    return 'weak';
  };

  // Función para validar email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar teléfono peruano
  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+51|51)?\s?[9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Función para validar DNI
  const validateDNI = (dni: string) => {
    return dni.length === 8 && /^[0-9]+$/.test(dni);
  };

  // Función para validar si las contraseñas coinciden
  const validatePasswordMatch = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones mejoradas
    if (!formData.name.trim()) {
      onError('El nombre es obligatorio');
      return;
    }

    if (formData.name.trim().length < 2) {
      onError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    if (formData.name.trim().length > 50) {
      onError('El nombre no puede exceder 50 caracteres');
      return;
    }

    if (!formData.email.trim()) {
      onError('El email es obligatorio');
      return;
    }

    if (!validateEmail(formData.email)) {
      onError('Por favor ingresa un email válido');
      return;
    }

    if (!formData.phone.trim()) {
      onError('El teléfono es obligatorio');
      return;
    }

    if (!validatePhone(formData.phone)) {
      onError('Por favor ingresa un teléfono peruano válido (ej: +51 999 999 999)');
      return;
    }

    if (formData.dni && !validateDNI(formData.dni)) {
      onError('El DNI debe tener exactamente 8 dígitos numéricos');
      return;
    }

    if (!formData.password) {
      onError('La contraseña es obligatoria');
      return;
    }

    if (formData.password.length < 8) {
      onError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      onError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dni: formData.dni || undefined,
        password: formData.password
      });

      // Actualizar contexto con los datos del usuario
      login(response.client);
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Error al registrarse';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validaciones en tiempo real
    let processedValue = value;
    
    if (name === 'name') {
      // Solo permitir letras, espacios y caracteres especiales básicos
      processedValue = value.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
    } else if (name === 'phone') {
      // Solo permitir números, espacios, + y guiones
      processedValue = value.replace(/[^0-9\s\+\-]/g, '');
    } else if (name === 'dni') {
      // Solo permitir números y máximo 8 caracteres
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 8);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Validar fortaleza de contraseña en tiempo real
    if (name === 'password') {
      setPasswordStrength(validatePasswordStrength(processedValue));
      // También validar coincidencia si ya hay confirmPassword
      if (formData.confirmPassword) {
        setPasswordMatch(validatePasswordMatch(processedValue, formData.confirmPassword));
      }
    }
    
    // Validar coincidencia de contraseñas
    if (name === 'confirmPassword') {
      setPasswordMatch(validatePasswordMatch(formData.password, processedValue));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-teal-700">
        Crear Cuenta
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              formData.name && (formData.name.length < 2 || formData.name.length > 50)
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-teal-500'
            }`}
            placeholder="Tu nombre completo"
            minLength={2}
            maxLength={50}
            required
          />
          {formData.name && formData.name.length > 0 && formData.name.length < 2 && (
            <p className="text-xs text-red-600 mt-1">El nombre debe tener al menos 2 caracteres</p>
          )}
          {formData.name && formData.name.length > 50 && (
            <p className="text-xs text-red-600 mt-1">El nombre no puede exceder 50 caracteres</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              formData.email && !validateEmail(formData.email)
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-teal-500'
            }`}
            placeholder="tu@email.com"
            required
          />
          {formData.email && !validateEmail(formData.email) && (
            <p className="text-xs text-red-600 mt-1">Por favor ingresa un email válido</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              formData.phone && !validatePhone(formData.phone)
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-teal-500'
            }`}
            placeholder="+51 999 999 999"
            maxLength={15}
            required
          />
          {formData.phone && !validatePhone(formData.phone) && formData.phone.length > 0 && (
            <p className="text-xs text-red-600 mt-1">Formato válido: +51 999 999 999 </p>
          )}
        </div>

        {/* DNI */}
        <div>
          <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
            DNI (opcional - 8 dígitos)
          </label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              formData.dni && !validateDNI(formData.dni) && formData.dni.length > 0
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-teal-500'
            }`}
            placeholder="12345678"
            maxLength={8}
          />
          {formData.dni && !validateDNI(formData.dni) && formData.dni.length > 0 && (
            <p className="text-xs text-red-600 mt-1">El DNI debe tener exactamente 8 dígitos numéricos</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña * (mínimo 8 caracteres)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                formData.password && passwordStrength === 'weak'
                  ? 'border-red-500 focus:ring-red-500'
                  : formData.password && passwordStrength === 'medium'
                  ? 'border-yellow-500 focus:ring-yellow-500'
                  : formData.password && passwordStrength === 'strong'
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-teal-500'
              }`}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          {/* Indicador de fortaleza de contraseña */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex space-x-1 mb-2">
                <div className={`h-1 w-1/3 rounded ${
                  passwordStrength === 'weak' ? 'bg-red-500' :
                  passwordStrength === 'medium' ? 'bg-yellow-500' :
                  passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <div className={`h-1 w-1/3 rounded ${
                  passwordStrength === 'medium' ? 'bg-yellow-500' :
                  passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <div className={`h-1 w-1/3 rounded ${
                  passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              </div>
              <p className={`text-xs ${
                passwordStrength === 'weak' ? 'text-red-600' :
                passwordStrength === 'medium' ? 'text-yellow-600' :
                passwordStrength === 'strong' ? 'text-green-600' : 'text-gray-600'
              }`}>
                Fortaleza: {passwordStrength === 'weak' ? 'Débil' :
                          passwordStrength === 'medium' ? 'Media' :
                          passwordStrength === 'strong' ? 'Fuerte' : ''}
              </p>
              <ul className="text-xs text-gray-600 mt-1 space-y-1">
                <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                  ✓ Mínimo 8 caracteres
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                  ✓ Una letra mayúscula
                </li>
                <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                  ✓ Una letra minúscula
                </li>
                <li className={/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                  ✓ Un número
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                  ✓ Un carácter especial (!@#$%^&*)
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Contraseña *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                passwordMatch === false
                  ? 'border-red-500 focus:ring-red-500'
                  : passwordMatch === true
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-teal-500'
              }`}
              placeholder="Repite tu contraseña"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {/* Mensaje de validación */}
          {formData.confirmPassword && passwordMatch === false && (
            <p className="text-xs text-red-600 mt-1">Las contraseñas no coinciden</p>
          )}
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
              Creando cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={() => {
              // Resetear el formulario al cambiar a login
              setFormData({
                name: '',
                email: '',
                phone: '',
                dni: '',
                password: '',
                confirmPassword: ''
              });
              setPasswordStrength('');
              setPasswordMatch(null);
              onSwitchToLogin();
            }}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};