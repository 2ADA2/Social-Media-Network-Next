import { use } from "react";
import { NotificationsContext } from "./context";

export const useNotifications = () => {
  const context = use(NotificationsContext);

  if (!context) {
    throw new Error("No notifications context.");
  }

  return { notifications: context.notifications, add: context.addNotification };
};
