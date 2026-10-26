'use client';

import styles from './navbar.module.css';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransition, animated } from '@react-spring/web';
import SidekickLogo from '@/shared/assets/icons/sidekick-logo.svg';
import { Avatar } from '@/shared/ui/avatar';
import { useBlockScroll } from '@/shared/lib/hooks/use-block-scroll';
import { useAuth } from '@/features/auth/use-auth';
import { useFocusTrap } from '@/shared/lib/hooks/use-focus-trap';
import Link from 'next/link';
import { ROUTES } from '@/app/lib/routes';
import { useUser } from '@/entities/user/model/use-user';

interface NavBarProps {
  setNavBar: () => void;
  isOpen: boolean;
}

export const NavBar = ({ setNavBar, isOpen }: NavBarProps) => {
  const navRef = useRef<HTMLElement>(null);
  const { t } = useTranslation('common');
  const { isAuth } = useAuth();
  const { user } = useUser();
  useBlockScroll(isOpen);
  useFocusTrap(navRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNavBar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setNavBar]);

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'translateX(100%)' },
    enter: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0, transform: 'translateX(100%)' },
    config: { tension: 300, friction: 30 },
  });

  return transitions((style, item) =>
    item ? (
      <div className={styles.navWrapper}>
        <div
          className={styles.navBackground}
          onClick={setNavBar}
          data-testid="nav-background"
        />
        <animated.nav
          className={styles.navbar}
          style={{ transform: style.transform }}
          tabIndex={-1}
          ref={navRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('navbar.label')}
        >
          <div className={styles.navHeader}>
            <button
              type="button"
              className={styles.navClose}
              onClick={setNavBar}
              aria-label={t('navbar.close')}
            >
              <SidekickLogo />
              <span>sidekick</span>
            </button>
            {isAuth && <Avatar src={user!.avatar} size={24} />}
          </div>

          <div className={styles.navContainer} onClick={setNavBar}>
            {!isAuth ? (
              <>
                <Link href={ROUTES.SIGNIN}>{t('nav.signIn')}</Link>
                <Link href={ROUTES.SIGNUP}>{t('nav.signUp')}</Link>
              </>
            ) : (
              <>
                <Link href={ROUTES.PROFILE}>{t('nav.profile')}</Link>
                <Link href={ROUTES.STATISTICS}>{t('nav.statistics')}</Link>
              </>
            )}
          </div>
        </animated.nav>
      </div>
    ) : null,
  );
};