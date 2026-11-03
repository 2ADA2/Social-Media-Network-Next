import { type InputHTMLAttributes, type ReactNode } from 'react';
import './textarea.css';
import { ShowInputInfo } from '@/shared/ui/show-input-info';

interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  icon?: ReactNode;
  value: string;
  info?: string;
  errorMessage?: string;
}

export const FILLED_LIMIT = 50;

export const TextArea = ({
  icon,
  label,
  info,
  value,
  errorMessage,
  ...props
}: InputProps) => {
  const isFilled = value.length > FILLED_LIMIT;

  return (
    <label
      className={`textarea-label ${errorMessage ? 'error' : ''} ${isFilled ? 'filled' : ''}`}
      data-testid="textarea-label"
    >
      <div>
        {icon && <div className="textarea-icon">{icon}</div>}
        <span>{label}</span>
      </div>

      <textarea {...props} value={value} />

      <ShowInputInfo error={errorMessage} info={info} />
    </label>
  );
};
