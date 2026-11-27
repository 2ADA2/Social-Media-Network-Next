"use client";

import { use, useEffect, useState } from "react";
import { browser, createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import "./notifications.css";
import { useNotifications } from "@/app/providers/notifications-provider/useNotifications";
import dynamic from "next/dynamic";

export const NOTIFICATIONS_LIMIT = 5;

interface NotificationsProps {
  onDelete: (id: number) => void;
}

const Notification = dynamic(
  () => import("@/shared/ui/notification").then((m) => m.Notification),
  {
    ssr: false,
  },
);

export const Notifications = ({ onDelete }: NotificationsProps) => {
  use(browser());
  const t = useTranslations("common");
  const { notifications } = useNotifications();

  return createPortal(
    <div
      className="notifications-container"
      role="log"
      aria-label={t("notifications.region")}
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
