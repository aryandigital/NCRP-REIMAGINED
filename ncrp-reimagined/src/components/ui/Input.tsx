import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block font-label-mono text-label-mono text-on-surface">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 rounded-lg
            border-2 border-outline
            bg-surface-container-lowest
            font-body-sm text-body-sm text-on-surface
            placeholder:text-on-surface-variant
            focus:outline-none focus:border-primary
            transition-colors duration-150
            disabled:bg-surface-container disabled:opacity-50
            ${error ? 'border-error' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="font-body-sm text-body-sm text-error">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
