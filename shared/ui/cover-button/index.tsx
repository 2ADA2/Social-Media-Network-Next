import './cover-button.css';
import type { ButtonProps } from '../button';

export const CoverButton = ({ children, onClick, ...props }: ButtonProps) => {
  return (
    <button
      role="button"
      type="button"
      className="cover-button"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
