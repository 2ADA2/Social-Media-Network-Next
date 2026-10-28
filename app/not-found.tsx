import styles from "./not-found.module.css";
import NotFoundIcon from '@/shared/assets/icons/not-found.svg';
import { Metadata } from "next";
import NotFoundMessage from "./_components/not-found-message";

export const metadata: Metadata = {
  title: 'Page not found | Sidekick Social',
  description: 'This page not exists.',
};

export default function NotFound() {
  return (
    <div className={styles.notFoundPage}>
      <NotFoundIcon/>
      <NotFoundMessage/>
    </div>
  );
}
