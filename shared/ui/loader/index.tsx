"use client";

import { useTranslation } from "react-i18next";
import styles from "./loader.module.css";

export interface LoaderProps {
  isBlock?: boolean;
}

export const Loader = ({ isBlock = true }: LoaderProps) => {
  const { t } = useTranslation('common');

  if (isBlock) {
    return (
      <div
        role="status"
        aria-label={t("loader.loading")}
        className={styles.loader}
        data-testid="loader">
        <div className={styles.loaderSpinner} />
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={styles.loaderSmallContainer}
      data-testid="loader">
      <div className={styles.loaderSpinner} />
    </div>
  );
};
