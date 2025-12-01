import React, { useState, useEffect } from 'react';

interface TrackingNotificationProps {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  onClose: () => void;
}

const TrackingNotification: React.FC<TrackingNotificationProps> = ({ 
  message, 
  type, 
  duration = 5000, 
  onClose 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'info':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📢';
    }
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-50 border px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
      } ${getTypeStyles()}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl mr-3">{getIcon()}</span>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 text-current hover:opacity-75 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TrackingNotification;