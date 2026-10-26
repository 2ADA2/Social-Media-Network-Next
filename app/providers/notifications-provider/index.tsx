'use client';

import { type PropsWithChildren, useCallback, useRef, useState } from 'react';
import { type AddNotificationProps, NotificationsContext } from './context';
import { Notifications } from '@/widgets/notifications';

export interface NotificationItem extends AddNotificationProps {
  id: number;
}

export const NotificationsProvider = ({ children }: PropsWithChildren) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const notificationId = useRef<number>(0);

  const deleteNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((data: AddNotificationProps) => {
    const id = notificationId.current;
    setNotifications((prev) => [...prev, { ...data, id }]);
    notificationId.current++;
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification }}>
      <Notifications onDelete={deleteNotification} />
      {children}
    </NotificationsContext.Provider>
  );
};