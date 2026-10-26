import Link from "next/link";
import styles from "./auth-buttons.module.css";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/app/lib/routes";

export const AuthButtons = () => {
  const { t } = useTranslation('common');

  return (
    <nav className={styles.headerAuthNav}>
      <Link href={ ROUTES.SIGNIN }>{ t('nav.signIn') }</Link>
      <Link href={ ROUTES.SIGNUP }>{ t('nav.signUp') }</Link>
    </nav>
  );
};