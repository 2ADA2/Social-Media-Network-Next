import Link from "next/link";
import styles from "./auth-buttons.module.css";
import { ROUTES } from "@/app/lib/routes";
import { useTranslations } from "next-intl";

export const AuthButtons = () => {
  const t = useTranslations('common');

  return (
    <nav className={styles.headerAuthNav}>
      <Link href={ ROUTES.SIGNIN }>{ t('nav.signIn') }</Link>
      <Link href={ ROUTES.SIGNUP }>{ t('nav.signUp') }</Link>
    </nav>
  );
};