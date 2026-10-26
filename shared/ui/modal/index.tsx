import './modal.css';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { useTransition, animated } from '@react-spring/web';
import CrossIcon from '@/shared/assets/icons/cross.svg?react';
import { useFocusTrap } from '@/shared/lib/hooks/use-focus-trap.ts';
import { useBlockScroll } from '@/shared/lib/hooks/use-block-scroll.ts';

export interface ModalProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  title?: string;
}

export const Modal = ({
  children,
  isOpen,
  onClose,
  className = '',
  title,
}: ModalProps) => {
  const { t } = useTranslation('common');
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, isOpen);
  useBlockScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'scale(0.95) translateY(100px)' },
    enter: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    leave: { opacity: 0, transform: 'scale(0.95) translateY(100px)' },
    config: { tension: 300, friction: 25 },
  });

  return createPortal(
    <>
      {transitions((style, item) =>
        item ? (
          <animated.div
            className="modal-overlay"
            style={{ opacity: style.opacity }}
          >
            <animated.div
              data-testid="modal"
              className={'modal-window ' + className}
              style={style}
              tabIndex={-1}
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label={title ?? t('modal.defaultTitle')}
            >
              <button
                type="button"
                className="modal-close"
                onClick={onClose}
                aria-label={t('modal.close')}
                data-testid="modal-close"
              >
                <CrossIcon />
              </button>

              {children}
            </animated.div>
          </animated.div>
        ) : null,
      )}
    </>,
    document.body,
  );
};
