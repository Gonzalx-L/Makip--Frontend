import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Placeholder (si aún no tienes los componentes de UI) ---
// Borra esto cuando importes los componentes reales de "ui/forms"
const Input = (props: any) => <input {...props} className="border p-2 w-full rounded" />;
const Button = (props: any) => <button {...props} className="bg-yellow-500 text-gray-900 font-bold p-2 w-full rounded" />;
// --- Fin del Placeholder ---

export const UserRegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    // Aquí irá tu lógica para registrar al usuario
    console.log('Register data:', { name, email, password });
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Crear Cuenta
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-700"
          >
            Nombre Completo
          </label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            required
            placeholder="Tu nombre"
          />
        </div>
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
        <div>
          <label 
            htmlFor="confirmPassword" 
            className="block text-sm font-medium text-gray-700"
          >
            Confirmar Contraseña
          </label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <div>
          <Button type="submit">
            Crear Cuenta
          </Button>
        </div>
      </form>
      <div className="text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Inicia sesión
        </Link>
      </div>
    </div>
  );
};