"use client";

import Link from "next/link";
// import { useTranslation } from 'react-i18next';
import styles from "./fallback.module.css";
import { ROUTES } from "@/app/lib/routes";

interface FallbackProps {
  error: Error | null;
  onReset: () => void;
}

export const Fallback = ({ error, onReset }: FallbackProps) => {
  // const { t } = useTranslation('common');
  const t = (text: string) => text;

  const retry = () => {
    window.location.reload();
  };

  const backToHome = () => {
    onReset();
  };

  return (
    <div className={styles.errorPage} data-testid="fallback">
      <div className={styles.errorContainer}>
        {/* <CrossIcon /> */}
        {/* TODO: CrossIcon */}
        <div> CrossIcon </div>
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
