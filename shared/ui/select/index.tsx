import { useState, useRef, useEffect } from "react";
import "./select.css";
import ArrowDownIcon from "@/shared/assets/icons/arrow-down.svg";
import ArrowUpIcon from "@/shared/assets/icons/arrow-up.svg";
import { useFocusTrap } from "@/shared/lib/hooks/use-focus-trap";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export const Select = ({ options, value, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, isOpen);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div
      className="custom-select-container"
      ref={containerRef}
      data-testid="select"
    >
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
      >
        {selectedLabel}
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </button>

      {isOpen && (
        <div className="custom-select-options" role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`custom-select-option ${option.value === value ? "selected" : ""}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
