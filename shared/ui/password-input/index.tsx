import {
  type InputHTMLAttributes,
  type ReactNode,
  useId,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@/shared/assets/icons/check.svg?react';
import CrossIcon from '@/shared/assets/icons/cross.svg?react';
import EyeIcon from '@/shared/assets/icons/eye.svg?react';
import LikeIcon from '@/shared/assets/icons/thumbs-up.svg?react';
import EyeCrossedIcon from '@/shared/assets/icons/eye-crossed.svg?react';
import './password-input.css';
import { ShowInputInfo } from '@/shared/ui/show-input-info';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  info?: string;
  custom?: boolean;
  error?: string;
}

export const PasswordInput = ({
  icon,
  label,
  info,
  custom,
  error,
  ...props
}: InputProps) => {
  const { t } = useTranslation('common');
  const [isShow, setIsShow] = useState(false);

  const id = useId();
  const errorId = `${id}-error`;

  const changeShow = () => setIsShow(!isShow);
  const isOk = custom && !error && props.value;

  return (
    <label htmlFor={id} className={`input-label ${error ? 'error' : ''}`}>
      <div>
        {icon && <div className="input-icon">{icon}</div>}
        <span>{label}</span>
        <div className="input-status">
          {isOk && <CheckIcon data-testid="password-input-ok-icon" />}
          {error && <CrossIcon data-testid="password-input-cross-icon" />}
        </div>
      </div>

      <div className="password-container">
        <input
          {...props}
          id={id}
          type={isShow ? 'text' : 'password'}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />

        <div className="password-eye">
          <button
            type="button"
            onClick={changeShow}
            data-testid="hide-password-button"
          >
            {isShow ? <EyeIcon /> : <EyeCrossedIcon />}
          </button>
        </div>
      </div>

      {(error || isOk) && (
        <ShowInputInfo
          id={errorId}
          error={error}
          info={info || t('passwordInput.defaultInfo')}
          icon={<LikeIcon />}
        />
      )}
    </label>
  );
};
