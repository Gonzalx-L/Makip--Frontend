// src/pages/Admin/LoginAdm.tsx

import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";

// ⚠️ REVISA ESTAS RUTAS
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import apiClient from "../../services/admi/apiClient";
import axios from "axios"; // Importamos axios para la verificación de errores
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

// ⚠️ REVISA ESTA RUTA (debe ser src/assets/img-login.png)
import imgLoginIllustration from "../../assets/img-login.png";

// --- Interfaces de API ---
// 💡 MODIFICADA: Esto es lo que el backend SÍ envía
interface LoginResponse {
  token: string;
  message: string;
  // El backend NO envía el objeto 'admin'
}
interface ErrorResponse {
  message: string;
}

const LoginAdm: React.FC = () => {
  // --- Estado del Formulario ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Estado de Validación ---
  const [errors, setErrors] = useState({ email: "", password: "", api: "" });
  const [touched, setTouched] = useState({ email: false, password: false });

  // --- Estado de Carga y Éxito ---
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [adminName, setAdminName] = useState(""); // Ahora guardaremos el email aquí

  // --- Hooks de Lógica ---
  const navigate = useNavigate();
  const { login, isAdminAuthenticated } = useAdminAuth();

  // --- Funciones de Validación ---
  const validateEmail = (value: string): string => {
    if (!value) return "El correo es requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Correo inválido";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "La contraseña es requerida";
    if (value.length < 6) return "Mínimo 6 caracteres";
    return "";
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  };

  // --- Manejador del Envío del Formulario (💡 CORREGIDO) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "", api: "" });

    // 1. Validación local
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError, api: "" });
    setTouched({ email: true, password: true });

    if (emailError || passwordError) {
      return; // Detiene si hay errores locales
    }

    // 2. Inicia la carga (en el botón)
    setIsLoading(true);

    try {
      const response = await apiClient.post<LoginResponse>("/admin/login", {
        email,
        password,
      });

      // 💡 1. Solo extraemos el 'token' (es lo único que envía el backend)
      const { token } = response.data;

      // 💡 2. Creamos un objeto 'admin' temporal aquí en el frontend
      const tempAdmin = {
        id: "temp_id", // El ID no es crítico para el contexto, solo el 'name'
        email: email,
        name: email, // Usamos el email como nombre para el saludo
      };

      // 💡 3. Usamos el token real y el admin temporal
      login(token, tempAdmin);
      setAdminName(tempAdmin.name); // ¡Esto ya no da error!

      // 4. Éxito: Detiene el spinner y activa el modal de bienvenida
      setIsLoading(false);
      setIsSuccess(true); // <-- ABRE EL MODAL DE ÉXITO

      // Redirigir después de 1.8s
      setTimeout(() => {
        setIsSuccess(false);
        navigate("/admin/dashboard", { replace: true });
      }, 1800);
    } catch (err: unknown) {
      // 5. Error de API: Detiene el spinner y muestra el error en el formulario
      setIsLoading(false);
      console.error("[LoginAdm] error:", err);

      let apiErrorMessage = "No se pudo conectar al servidor.";
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorData = err.response.data as ErrorResponse | undefined;
          apiErrorMessage =
            errorData?.message ||
            (err.response.status === 401
              ? "Email o contraseña incorrectos."
              : "Error en la petición al servidor.");
        } else if (err.request) {
          apiErrorMessage = "No hubo respuesta del servidor.";
        } else {
          apiErrorMessage = err.message || apiErrorMessage;
        }
      } else if (err instanceof Error) {
        apiErrorMessage = err.message;
      }

      setErrors((prev) => ({ ...prev, api: apiErrorMessage }));
    }
  };

  // --- Redirección si ya está logueado ---
  if (isAdminAuthenticated) {
    return <Navigate to='/admin/dashboard' replace />;
  }

  // --- JSX (El Diseño) ---
  return (
    <div className='flex min-h-screen items-center justify-center bg-sky-50 p-4 font-sans'>
      <div className='w-full max-w-[1000px] rounded-2xl bg-white shadow-xl transition-all duration-200 md:grid md:grid-cols-2'>
        {/* Columna Izquierda - Ilustración y Texto */}
        <div className='hidden flex-col items-center justify-center p-8 text-center md:flex md:p-10 lg:p-12'>
          <img
            src={imgLoginIllustration}
            alt='Makip - Equipo colaborativo'
            className='mb-6 w-full max-w-[320px] h-auto'
          />
          <h2 className='mb-2 text-[20px] font-semibold text-[#1A1A1A]'>
            Bienvenido a Makip Te Crea
          </h2>
          <p className='text-[14px] text-[#4A5568]'>
            Tu equipo colaborativo para crear proyectos increíbles
          </p>
        </div>

        {/* Columna Derecha - Formulario de Login */}
        <div className='flex flex-col justify-center p-12 md:p-16'>
          <div className='mb-8 text-center'>
            <h1 className='mb-3 text-[32px] font-semibold text-[#068e85]'>
              Iniciar sesión
            </h1>
            <p className='text-[15px] text-[#4A5568]'>
              Accede al panel de administración
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className='mx-auto w-full max-w-[380px] space-y-5'>
            {/* Campo de Correo Electrónico */}
            <div>
              <label
                htmlFor='email'
                className='mb-2 block text-[14px] font-medium text-[#1A1A1A]'>
                Correo electrónico
              </label>
              <input
                id='email'
                type='email'
                placeholder='tu@correo.com'
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  if (touched.email)
                    setErrors((prev) => ({
                      ...prev,
                      email: validateEmail(e.target.value),
                    }));
                }}
                onBlur={handleEmailBlur}
                className={`w-full rounded-xl border px-4 py-3 text-[16px] placeholder-[#9CA3AF] outline-none transition-all duration-150 focus:border-[#0ef5ee] focus:ring-1 focus:ring-[#1E63FF]/20 
                  ${
                    touched.email && errors.email
                      ? "border-red-500"
                      : "border-[#EDEFF3]"
                  }`}
                disabled={isLoading || isSuccess}
              />
              {touched.email && errors.email && (
                <p className='mt-1 text-[13px] text-red-500'>{errors.email}</p>
              )}
            </div>

            {/* Campo de Contraseña */}
            <div>
              <label
                htmlFor='password'
                className='mb-2 block text-[14px] font-medium text-[#1A1A1A]'>
                Contraseña
              </label>
              <div className='relative'>
                <input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  placeholder='••••••••'
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    if (touched.password)
                      setErrors((prev) => ({
                        ...prev,
                        password: validatePassword(e.target.value),
                      }));
                  }}
                  onBlur={handlePasswordBlur}
                  className={`w-full rounded-xl border px-4 py-3 text-[16px] placeholder-[#9CA3AF] outline-none transition-all duration-150 focus:border-[#0ef5ee] focus:ring-1 focus:ring-[#1E63FF]/20 
                    ${
                      touched.password && errors.password
                        ? "border-red-500"
                        : "border-[#EDEFF3]"
                    }`}
                  disabled={isLoading || isSuccess}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-4 flex items-center text-[#9CA3AF] hover:text-[#4A5568] transition-colors duration-150'
                  disabled={isLoading || isSuccess}>
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className='mt-1 text-[13px] text-red-500'>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Opciones Adicionales: Recordarme y Olvidé Contraseña */}
            <div className='flex items-center justify-between pt-1'>
              <div className='flex items-center space-x-2'>
                <input
                  id='remember'
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setRememberMe(e.target.checked)
                  }
                  className='h-4 w-4 cursor-pointer rounded border-[#EDEFF3] text-[#1E63FF] focus:ring-[#1E63FF]'
                  disabled={isLoading || isSuccess}
                />
                <label
                  htmlFor='remember'
                  className='select-none text-[14px] text-[#4A5568] cursor-pointer'>
                  Recordarme
                </label>
              </div>
              <a
                href='#'
                className='text-[14px] text-[#4A5568] transition-all duration-150 hover:text-[#1E63FF] hover:underline'>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Error de API (aquí se mostrará "Contraseña incorrecta", etc.) */}
            {errors.api && (
              <div className='text-center text-sm text-red-600'>
                {errors.api}
              </div>
            )}

            {/* Botón de Ingresar (con spinner integrado) */}
            <button
              type='submit'
              disabled={isLoading || isSuccess}
              className='mt-6 flex w-full items-center justify-center rounded-xl bg-[#0ed2c8] px-4 py-3 text-[16px] font-medium text-white shadow-lg shadow-[#0ac1b8]/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#0ac1b8] hover:shadow-xl hover:shadow-[#0ac1b8]/30 disabled:opacity-50 disabled:cursor-not-allowed'>
              {isLoading ? (
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>
      </div>

      <p className='absolute bottom-4 text-[13px] text-[#9CA3AF]'>
        Acceso seguro al panel de administración
      </p>

      {/* --- MODAL DE ÉXITO (SÓLO APARECE AL LOGUEARSE) --- */}
      {isSuccess && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-20 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-lg'>
            <div className='flex flex-col items-center justify-center'>
              <CheckCircle className='mb-4 h-12 w-12 text-green-500' />
              <h3 className='mb-2 text-xl font-semibold text-[#1A1A1A]'>
                {/* 💡 AHORA SALUDA CON EL EMAIL */}
                ¡Bienvenido, {adminName || "Administrador"}!
              </h3>
              <p className='text-sm text-[#4A5568]'>
                Redirigiendo al dashboard...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginAdm;
