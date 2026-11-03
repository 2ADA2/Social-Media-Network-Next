import React, { type ButtonHTMLAttributes } from 'react';
import './button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ children, className = '', ...props }: ButtonProps) => {
  return (
    <button type="button" className={`btn ${className}`} {...props}>
      {children}
    </button>
  );
};
