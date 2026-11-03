"use client";
import styles from "./loader.module.css";

export interface LoaderProps {
  isBlock?: boolean;
}

export const Loader = ({ isBlock = true }: LoaderProps) => {
  if (isBlock) {
    return (
      <div
        role="status"
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
