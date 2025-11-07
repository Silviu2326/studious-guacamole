import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';
import { NotificationCenter } from '../features/leads/components/NotificationCenter';
import { NotificationService } from '../features/leads/services/notificationService';
import { useLocation } from 'react-router-dom';

interface NotificationBellProps {
  businessType: 'entrenador' | 'gimnasio';
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ businessType }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!user?.id) return;

    // Cargar contador inicial
    loadUnreadCount();

    // Verificar nuevas notificaciones periódicamente
    const interval = setInterval(() => {
      NotificationService.runAllChecks(user.id, businessType).then(() => {
        loadUnreadCount();
      });
    }, 5 * 60 * 1000); // Cada 5 minutos

    // Verificación inicial
    NotificationService.runAllChecks(user.id, businessType).then(() => {
      loadUnreadCount();
    });

    return () => clearInterval(interval);
  }, [user?.id, businessType]);

  const loadUnreadCount = async () => {
    if (!user?.id) return;
    try {
      const count = await NotificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error cargando contador de notificaciones:', error);
    }
  };

  // Solicitar permiso de notificaciones al montar
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(console.error);
    }
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-600 dark:text-[#94A3B8] hover:text-gray-900 dark:hover:text-[#F1F5F9] transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationCenter
        businessType={businessType}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          loadUnreadCount();
        }}
      />
    </>
  );
};

