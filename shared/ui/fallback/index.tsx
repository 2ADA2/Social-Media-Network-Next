"use client";

import Link from "next/link";
import styles from "./fallback.module.css";
import { ROUTES } from "@/app/lib/routes";
import CrossIcon from '@/shared/assets/icons/cross-bold.svg';
import { useTranslations } from "next-intl";

interface FallbackProps {
  error: Error | null;
  onReset: () => void;
}

export const Fallback = ({ error, onReset }: FallbackProps) => {
  const t = useTranslations('common');

  const retry = () => {
    window.location.reload();
  };

  const backToHome = () => {
    onReset();
  };

  return (
    <div className={styles.errorPage} data-testid="fallback">
      <div className={styles.errorContainer}>
        <CrossIcon />
        <div className={styles.errorMessage}>
          {t("error.title")}
          <br />
          {t("error.subtitle")}
        </div>
        <small>
          {t("error.youCan")}
          <Link href={ROUTES.HOME} onClick={backToHome}>
            {" "}
            {t("error.backToHome")}{" "}
          </Link>
          {t("error.orTryTo")}{" "}
          <button onClick={retry}>{t("error.reload")}</button>{" "}
          {t("error.thePage")}
        </small>
        <div className={styles.detailsContainer}>
          <details className={styles.errorFallbackDetails}>
            <summary>{t("error.details")}</summary>
            <div>{error?.name || t("error.unknownError")}</div>
            <div>{error?.message || ""}</div>
          </details>
        </div>
      </div>
    </div>
  );
};
