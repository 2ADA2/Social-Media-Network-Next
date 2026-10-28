"use client";
import { useTranslations } from "next-intl";
import styles from "../not-found.module.css";

export default function NotFoundMessage() {
  const t = useTranslations("not-found");

  return <div className={styles.notFoundMessage}>{t("title")}</div>;
}
