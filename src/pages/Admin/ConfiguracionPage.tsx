import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { 
  Save, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  User,
  Lock,
  Bell,
  Palette,
  Globe
} from "lucide-react";
import apiClient from "../../services/admi/apiClient";

interface AdminConfig {
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordLastChanged: string;
  };
  notifications: {
    emailNotifications: boolean;
    orderAlerts: boolean;
    lowStockAlerts: boolean;
    newCustomerAlerts: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: 'es' | 'en';
    timezone: string;
  };
  business: {
    businessName: string;
    businessPhone: string;
    businessAddress: string;
    businessEmail: string;
    whatsappNumber: string;
  };
}

const ConfiguracionPage: React.FC = () => {
  const { adminUser } = useAdminAuth();
  const [config, setConfig] = useState<AdminConfig>({
    profile: {
      name: adminUser?.name || '',
      email: adminUser?.email || '',
      phone: '',
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordLastChanged: new Date().toISOString(),
    },
    notifications: {
      emailNotifications: true,
      orderAlerts: true,
      lowStockAlerts: true,
      newCustomerAlerts: false,
    },
    appearance: {
      theme: 'light',
      language: 'es',
      timezone: 'America/Lima',
    },
    business: {
      businessName: 'MAKIP',
      businessPhone: '',
      businessAddress: '',
      businessEmail: '',
      whatsappNumber: '',
    },
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    fetchConfiguration();
  }, []);

  const fetchConfiguration = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/admin/configuration');
      if (response.data) {
        setConfig(prevConfig => ({
          ...prevConfig,
          ...response.data
        }));
      }
    } catch (err) {
      console.error('Error fetching configuration:', err);
      // No mostrar error si no existe la configuración aún
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await apiClient.put('/admin/configuration', config);
      setSuccess('Configuración guardada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving configuration:', err);
      setError('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (passwords.new.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setIsSaving(true);
      await apiClient.put('/admin/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      setPasswords({ current: '', new: '', confirm: '' });
      setSuccess('Contraseña cambiada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Error al cambiar la contraseña');
    } finally {
      setIsSaving(false);
    }
  };

  const updateConfig = (section: keyof AdminConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Lock },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'business', label: 'Negocio', icon: Globe },
  ];

  if (isLoading) {
    return (
      <div className='p-10 flex justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <div className='p-6 md:p-8 lg:p-10'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Configuración</h1>
        <p className='text-gray-500 mt-1'>
          Gestiona tu cuenta y las preferencias del sistema.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className='mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-center'>
          <AlertCircle className='h-5 w-5 text-red-600 mr-2' />
          <span className='text-red-700'>{error}</span>
        </div>
      )}
      
      {success && (
        <div className='mb-6 rounded-lg bg-green-50 border border-green-200 p-4 flex items-center'>
          <CheckCircle className='h-5 w-5 text-green-600 mr-2' />
          <span className='text-green-700'>{success}</span>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Sidebar Navigation */}
        <div className='lg:col-span-1'>
          <nav className='space-y-1'>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className='h-5 w-5 mr-3' />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className='lg:col-span-3'>
          <div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
            <div className='p-6'>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-900'>Información del Perfil</h2>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Nombre Completo
                      </label>
                      <input
                        type='text'
                        value={config.profile.name}
                        onChange={(e) => updateConfig('profile', 'name', e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Correo Electrónico
                      </label>
                      <input
                        type='email'
                        value={config.profile.email}
                        onChange={(e) => updateConfig('profile', 'email', e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Teléfono
                      </label>
                      <input
                        type='tel'
                        value={config.profile.phone}
                        onChange={(e) => updateConfig('profile', 'phone', e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        placeholder='+51 999 999 999'
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-900'>Configuración de Seguridad</h2>
                  
                  {/* Change Password */}
                  <div className='border-b border-gray-200 pb-6'>
                    <h3 className='text-lg font-medium text-gray-900 mb-4'>Cambiar Contraseña</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Contraseña Actual
                        </label>
                        <input
                          type='password'
                          value={passwords.current}
                          onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                          className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Nueva Contraseña
                        </label>
                        <div className='relative'>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwords.new}
                            onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                          />
                          <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                          >
                            {showPassword ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Confirmar Contraseña
                        </label>
                        <input
                          type='password'
                          value={passwords.confirm}
                          onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                          className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        />
                      </div>
                    </div>
                    <button
                      onClick={handlePasswordChange}
                      disabled={isSaving || !passwords.current || !passwords.new || !passwords.confirm}
                      className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Cambiar Contraseña
                    </button>
                  </div>

                  {/* Two Factor Authentication */}
                  <div>
                    <h3 className='text-lg font-medium text-gray-900 mb-4'>Autenticación de Dos Factores</h3>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm text-gray-600'>
                          Aumenta la seguridad de tu cuenta habilitando la autenticación de dos factores
                        </p>
                      </div>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={config.security.twoFactorEnabled}
                          onChange={(e) => updateConfig('security', 'twoFactorEnabled', e.target.checked)}
                          className='sr-only peer'
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Session Timeout */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Tiempo de Sesión (minutos)
                    </label>
                    <select
                      value={config.security.sessionTimeout}
                      onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                      className='w-full md:w-auto rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    >
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={120}>2 horas</option>
                      <option value={480}>8 horas</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-900'>Preferencias de Notificaciones</h2>
                  
                  <div className='space-y-4'>
                    {[
                      { key: 'emailNotifications', label: 'Notificaciones por Email', description: 'Recibir notificaciones generales por correo electrónico' },
                      { key: 'orderAlerts', label: 'Alertas de Órdenes', description: 'Notificaciones cuando se reciben nuevas órdenes' },
                      { key: 'lowStockAlerts', label: 'Alertas de Stock Bajo', description: 'Avisos cuando los productos tengan stock bajo' },
                      { key: 'newCustomerAlerts', label: 'Nuevos Clientes', description: 'Notificaciones cuando se registren nuevos clientes' },
                    ].map((notification) => (
                      <div key={notification.key} className='flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0'>
                        <div className='flex-1'>
                          <h4 className='text-sm font-medium text-gray-900'>{notification.label}</h4>
                          <p className='text-sm text-gray-600'>{notification.description}</p>
                        </div>
                        <label className='relative inline-flex items-center cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={config.notifications[notification.key as keyof typeof config.notifications]}
                            onChange={(e) => updateConfig('notifications', notification.key, e.target.checked)}
                            className='sr-only peer'
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-900'>Configuración de Apariencia</h2>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Tema
                      </label>
                      <select
                        value={config.appearance.theme}
                        onChange={(e) => updateConfig('appearance', 'theme', e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      >
                        <option value='light'>Claro</option>
                        <option value='dark'>Oscuro</option>
                        <option value='auto'>Automático</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Zona Horaria
                      </label>
                      <select
                        value={config.appearance.timezone}
                        onChange={(e) => updateConfig('appearance', 'timezone', e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      >
                        <option value='America/Lima'>Lima, Perú (GMT-5)</option>
                        <option value='America/Bogota'>Bogotá, Colombia (GMT-5)</option>
                        <option value='America/Mexico_City'>Ciudad de México (GMT-6)</option>
                        <option value='America/New_York'>New York (GMT-5/-4)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Tab */}
              {activeTab === 'business' && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-900'>Información del Negocio</h2>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Nombre del Negocio
                      </label>
                      <input
                        type='text'
                        value={config.business.businessName}
                        onChange={(e) => updateConfig('business', 'businessName', e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Email del Negocio
                      </label>
                      <input
                        type='email'
                        value={config.business.businessEmail}
                        onChange={(e) => updateConfig('business', 'businessEmail', e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        placeholder='contacto@makip.com'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        WhatsApp Business
                      </label>
                      <input
                        type='tel'
                        value={config.business.whatsappNumber}
                        onChange={(e) => updateConfig('business', 'whatsappNumber', e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        placeholder='+51 999 999 999'
                      />
                    </div>
                    
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Dirección del Negocio
                      </label>
                      <textarea
                        value={config.business.businessAddress}
                        onChange={(e) => updateConfig('business', 'businessAddress', e.target.value)}
                        rows={3}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        placeholder='Ingresa la dirección completa del negocio'
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg'>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className='flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSaving ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Save className='h-4 w-4' />
                )}
                <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionPage;