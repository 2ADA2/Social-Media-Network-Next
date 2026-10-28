import './notification.css';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from "next-intl";
import { useTransition, animated } from '@react-spring/web';
import CrossIcon from '@/shared/assets/icons/cross.svg';

export interface NotificationProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  id?: number;
}

export const TIMEOUT = 5000;
export const REMOVE_TIMEOUT = 400;

export const Notification = ({
  message,
  type = 'success',
  onClose,
}: NotificationProps) => {
  const t = useTranslations('common');
  const onCloseRef = useRef(onClose);
  const [isVisible, setIsVisible] = useState(true);

  const transitions = useTransition(isVisible, {
    from: { opacity: 0, transform: 'translateY(50%)' },
    enter: { opacity: 1, transform: 'translateY(0%)' },
    leave: { opacity: 0, transform: 'translateY(50%)' },
    config: { tension: 280, friction: 30 },
  });

  useEffect(() => {
    const hideTimeout = setTimeout(() => setIsVisible(false), TIMEOUT);
    const removeTimeout = setTimeout(
      () => onCloseRef.current(),
      TIMEOUT + REMOVE_TIMEOUT,
    );

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(removeTimeout);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onCloseRef.current(), REMOVE_TIMEOUT);
  };

  const role = type === 'success' ? 'status' : 'alert';

  return transitions((style, item) =>
    item ? (
      <animated.div
        className={`notification notification-${type}`}
        style={style}
        role={role}
        data-testid="notification"
      >
        <p>{message}</p>
        <button
          type="button"
          onClick={handleClose}
          className="notification-close"
          aria-label={t('notification.close')}
        >
          <CrossIcon />
        </button>
      </animated.div>
    ) : null,
  );
};
