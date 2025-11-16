import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'font-semibold px-6 py-3 rounded-card transition-all duration-300 ease-elastic disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-accent to-accent-dark text-primary hover:shadow-button hover:scale-105 active:scale-95',
    secondary: 'bg-gradient-to-br from-primary to-primary-light text-white hover:shadow-card hover:scale-105 active:scale-95',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-primary active:scale-95',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
