"use client";

import styles from "./not-found.module.css";
// import NotFoundIcon from '@/shared/assets/icons/not-found.svg?react';
import { useTranslation } from "react-i18next";

export default function NotFound() {
  // const { t } = useTranslation('not-found');
  const t = (text: string) => text; // TODO: localization

  return (
    <div className={styles.notFoundPage}>
      {/* <NotFoundIcon/> */}
      {/* TODO: NOT FOUND ICON */}
      <div> NOT FOUND ICON </div>
      <div className={styles.notFoundMessage}>{t("title")}</div>
    </div>
  );
}
