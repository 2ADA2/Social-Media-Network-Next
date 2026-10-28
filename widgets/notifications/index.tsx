'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import './notifications.css';
import { Notification } from '@/shared/ui/notification';
import { useNotifications } from '@/app/providers/notifications-provider/useNotifications';

export const NOTIFICATIONS_LIMIT = 5;

interface NotificationsProps {
  onDelete: (id: number) => void;
}

export const Notifications = ({ onDelete }: NotificationsProps) => {
  const { t } = useTranslation('common');
  const { notifications } = useNotifications();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div
      className="notifications-container"
      role="log"
      aria-label={t('notifications.region')}
    >
      {notifications.slice(0, NOTIFICATIONS_LIMIT).map((e) => (
        <Notification
          key={e.id}
          message={e.message}
          type={e.type}
          onClose={() => onDelete(e.id)}
          id={e.id}
        />
      ))}
    </div>,
    document.body,
  );
};