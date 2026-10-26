import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import CheckIcon from '@/shared/assets/icons/check.svg?react';
import CrossIcon from '@/shared/assets/icons/cross.svg?react';
import './input.css';
import { ShowInputInfo } from '@/shared/ui/show-input-info';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  info?: string;
  custom?: boolean;
  error?: string;
}

export const Input = ({
  icon,
  label,
  info,
  custom,
  error,
  ...props
}: InputProps) => {
  const id = useId();

  const isOk = custom && !error && props.value;
  const errorId = `${id}-error`;

  return (
    <label htmlFor={id} className={`input-label ${error ? 'error' : ''}`} data-testid="input-label">
      <div>
        {icon && <div className="input-icon">{icon}</div>}
        <span>{label}</span>
        <div className="input-status">
          {isOk && <CheckIcon data-testid="input-ok-icon" />}
          {error && <CrossIcon data-testid="input-cross-icon" />}
        </div>
      </div>

      <input
        data-testid='input'
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />

      {(error || isOk) && (
        <ShowInputInfo id={errorId} error={error} info={info || ''} />
      )}
    </label>
  );
};
