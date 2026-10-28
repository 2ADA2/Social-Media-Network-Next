'use client';

import { useAuth } from "@/features/auth/use-auth";
import { Button } from "@/shared/ui/button";
import { useTranslations } from "next-intl";

export const LogoutButton = () => {
  const t = useTranslations('profile');
  const { logout } = useAuth();

  return (
    <Button className="logout-button" onClick={logout}>
      {t("actions.logout")}
    </Button>
  );
};
