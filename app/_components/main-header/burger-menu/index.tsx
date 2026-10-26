'use client';

import BurgerMenuIcon from '@/shared/assets/icons/menu-burger.svg';
import styles from './burger-menu.module.css';
import { useTranslation } from 'react-i18next';

interface BurgerMenuProps {
  onClick?: () => void;
}

export const BurgerMenu = ({ onClick }: BurgerMenuProps) => {
  const { t } = useTranslation('main');
  return (
    <button
      aria-label={t('nav.menu')}
      className={styles.burgerMenuButton}
      type="button"
      onClick={onClick}
    >
      <BurgerMenuIcon
        className={styles.burgerMenuIcon}
        data-testid="burger-menu-icon"
      />
    </button>
  );
};