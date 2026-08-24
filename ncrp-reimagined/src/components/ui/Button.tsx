import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'alert' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string; // Material Symbol name
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-xl font-label-mono text-label-mono uppercase tracking-wider transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-12 px-4 text-sm',
      lg: 'h-14 px-6 text-base',
    };

    const variantStyles = {
      primary:
        'bg-primary text-on-primary hover:bg-surface-tint active:bg-surface-tint shadow-copper',
      secondary:
        'bg-transparent text-secondary border-2 border-secondary hover:bg-secondary hover:text-on-secondary active:bg-secondary',
      alert:
        'bg-error text-on-error hover:bg-on-error-container active:bg-on-error-container',
      ghost:
        'bg-transparent text-on-surface border border-outline hover:bg-surface-container active:bg-surface-container',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="material-symbols-outlined text-lg">
            {icon}
          </span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="material-symbols-outlined text-lg">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
