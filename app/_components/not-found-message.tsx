"use client";
import { useTranslation } from "react-i18next";
import styles from "../not-found.module.css";

export default function NotFoundMessage() {
  const { t } = useTranslation("not-found");

  return <div className={styles.notFoundMessage}>{t("title")}</div>;
}
