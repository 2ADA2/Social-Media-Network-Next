"use client";

import styles from "./not-found.module.css";
import NotFoundIcon from '@/shared/assets/icons/not-found.svg';
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation('not-found');

  return (
    <div className={styles.notFoundPage}>
      <NotFoundIcon/>
      <div className={styles.notFoundMessage}>{t("title")}</div>
    </div>
  );
}
