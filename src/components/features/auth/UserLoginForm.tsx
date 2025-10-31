import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá tu lógica de autenticación (ej. llamar a una API)
    console.log('Login data:', { email, password });
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
          <Button type="submit">
            Iniciar Sesión
          </Button>
        </div>
      </form>
      <div className="text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
          Regístrate
        </Link>
      </div>
    </div>
  );
};