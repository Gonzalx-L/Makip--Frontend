import React, { useState } from "react";
import { Settings, Save, X, Check } from "lucide-react";

interface QuickSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: QuickSettingsData) => void;
}

export interface QuickSettingsData {
  autoSave: boolean;
  darkMode: boolean;
  notifications: boolean;
  soundEffects: boolean;
  language: 'es' | 'en';
}

const QuickSettings: React.FC<QuickSettingsProps> = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState<QuickSettingsData>({
    autoSave: true,
    darkMode: false,
    notifications: true,
    soundEffects: false,
    language: 'es',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onSave(settings);
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 1000);
    } catch (error) {
      setIsSaving(false);
    }
  };

  const updateSetting = <K extends keyof QuickSettingsData>(
    key: K,
    value: QuickSettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Configuración Rápida</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Auto Guardar</h3>
              <p className="text-xs text-gray-500">Guarda cambios automáticamente</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Modo Oscuro</h3>
              <p className="text-xs text-gray-500">Activa el tema oscuro</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => updateSetting('darkMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Notificaciones</h3>
              <p className="text-xs text-gray-500">Recibe alertas del sistema</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSetting('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Efectos de Sonido</h3>
              <p className="text-xs text-gray-500">Reproduce sonidos de notificación</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={(e) => updateSetting('soundEffects', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Idioma</h3>
              <p className="text-xs text-gray-500">Selecciona el idioma de la interfaz</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value as 'es' | 'en')}
              className="text-sm rounded-md border border-gray-300 px-3 py-1 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <Check className="h-4 w-4" />
                <span>Guardado</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Guardar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickSettings;