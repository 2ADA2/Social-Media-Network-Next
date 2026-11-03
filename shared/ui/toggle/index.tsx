import './toggle.css';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
}

export const Toggle = ({ checked, onChange, disabled, label }: ToggleProps) => {
  return (
    <button
      className={`toggle ${checked ? 'active' : ''}`}
      onClick={onChange}
      type="button"
      aria-pressed={checked}
      disabled={disabled}
      aria-label={label}
    >
      <span className="thumb" />
    </button>
  );
};
