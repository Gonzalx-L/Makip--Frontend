import React, { useState } from "react";
import { 
  Server, 
  Database, 
  Mail, 
  Shield, 
  Clock, 
  Smartphone,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface SystemConfigProps {
  config: {
    database: {
      host: string;
      port: number;
      name: string;
      connectionPoolSize: number;
    };
    email: {
      smtpHost: string;
      smtpPort: number;
      secure: boolean;
      from: string;
    };
    security: {
      sessionTimeout: number;
      maxLoginAttempts: number;
      passwordMinLength: number;
      requireTwoFactor: boolean;
    };
    features: {
      maintenanceMode: boolean;
      debugMode: boolean;
      allowRegistration: boolean;
      cacheEnabled: boolean;
    };
  };
  onConfigChange: (config: any) => void;
  onTest: (service: string) => Promise<boolean>;
}

const SystemConfig: React.FC<SystemConfigProps> = ({ config, onConfigChange, onTest }) => {
  const [testResults, setTestResults] = useState<{ [key: string]: boolean | null }>({});
  const [testing, setTesting] = useState<{ [key: string]: boolean }>({});

  const handleTest = async (service: string) => {
    setTesting(prev => ({ ...prev, [service]: true }));
    try {
      const result = await onTest(service);
      setTestResults(prev => ({ ...prev, [service]: result }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [service]: false }));
    } finally {
      setTesting(prev => ({ ...prev, [service]: false }));
    }
  };

  const updateConfig = (section: string, field: string, value: any) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section as keyof typeof config],
        [field]: value
      }
    });
  };

  const renderTestButton = (service: string) => {
    const isLoading = testing[service];
    const result = testResults[service];
    
    return (
      <button
        onClick={() => handleTest(service)}
        disabled={isLoading}
        className={`ml-2 px-3 py-1 text-xs rounded-md transition-colors ${
          result === null 
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
            : result 
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {isLoading ? (
          "Probando..."
        ) : result === null ? (
          "Probar"
        ) : result ? (
          <><CheckCircle className="h-3 w-3 inline mr-1" /> OK</>
        ) : (
          <><AlertTriangle className="h-3 w-3 inline mr-1" /> Error</>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-8">
      {/* Database Configuration */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <Database className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Configuración de Base de Datos</h3>
          {renderTestButton('database')}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Host
            </label>
            <input
              type="text"
              value={config.database.host}
              onChange={(e) => updateConfig('database', 'host', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="localhost"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puerto
            </label>
            <input
              type="number"
              value={config.database.port}
              onChange={(e) => updateConfig('database', 'port', parseInt(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="5432"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Base de Datos
            </label>
            <input
              type="text"
              value={config.database.name}
              onChange={(e) => updateConfig('database', 'name', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="makip_db"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño del Pool de Conexiones
            </label>
            <input
              type="number"
              value={config.database.connectionPoolSize}
              onChange={(e) => updateConfig('database', 'connectionPoolSize', parseInt(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <Mail className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Configuración de Email</h3>
          {renderTestButton('email')}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servidor SMTP
            </label>
            <input
              type="text"
              value={config.email.smtpHost}
              onChange={(e) => updateConfig('email', 'smtpHost', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="smtp.gmail.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puerto SMTP
            </label>
            <input
              type="number"
              value={config.email.smtpPort}
              onChange={(e) => updateConfig('email', 'smtpPort', parseInt(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="587"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Remitente
            </label>
            <input
              type="email"
              value={config.email.from}
              onChange={(e) => updateConfig('email', 'from', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="noreply@makip.com"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.email.secure}
                onChange={(e) => updateConfig('email', 'secure', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Conexión Segura (SSL/TLS)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Security Configuration */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Configuración de Seguridad</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              Tiempo de Sesión (minutos)
            </label>
            <select
              value={config.security.sessionTimeout}
              onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={60}>1 hora</option>
              <option value={120}>2 horas</option>
              <option value={480}>8 horas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intentos Máximos de Login
            </label>
            <input
              type="number"
              value={config.security.maxLoginAttempts}
              onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              max="10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitud Mínima de Contraseña
            </label>
            <input
              type="number"
              value={config.security.passwordMinLength}
              onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              min="6"
              max="20"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.security.requireTwoFactor}
                onChange={(e) => updateConfig('security', 'requireTwoFactor', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                <Smartphone className="h-4 w-4 inline mr-1" />
                Requerir Autenticación 2FA
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* System Features */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <Server className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Características del Sistema</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'maintenanceMode', label: 'Modo Mantenimiento', description: 'Pone el sistema en modo mantenimiento' },
            { key: 'debugMode', label: 'Modo Debug', description: 'Activa logs detallados para desarrollo' },
            { key: 'allowRegistration', label: 'Permitir Registro', description: 'Los usuarios pueden crear nuevas cuentas' },
            { key: 'cacheEnabled', label: 'Cache Habilitado', description: 'Mejora el rendimiento del sistema' },
          ].map((feature) => (
            <div key={feature.key} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{feature.label}</h4>
                <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
              </div>
              <label className="ml-4 relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.features[feature.key as keyof typeof config.features]}
                  onChange={(e) => updateConfig('features', feature.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;