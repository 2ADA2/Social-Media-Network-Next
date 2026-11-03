import { createContext } from 'react';
import { NotificationItem } from '.';

export interface AddNotificationProps {
  message: string;
  type?: 'success' | 'error';
}

interface NotificationsContextInterface {
  notifications: NotificationItem[];
  addNotification: (notification: AddNotificationProps) => void;
}

export const NotificationsContext =
  createContext<NotificationsContextInterface | null>(null);
