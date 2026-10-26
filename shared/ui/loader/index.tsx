"use client";

import styles from "./loader.module.css";

export interface LoaderProps {
  isBlock?: boolean;
}

export const Loader = ({ isBlock = true }: LoaderProps) => {
  // const { t } = useTranslation('common');
  const t = (text: string) => text; // TODO: localization

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
