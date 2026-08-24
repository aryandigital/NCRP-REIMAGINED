import React from 'react';

export type BadgeStatus = 'verified' | 'processing' | 'action-required' | 'high-risk' | 'medium-risk' | 'unclear';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: BadgeStatus;
  icon?: string; // Material Symbol name
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ status, icon, className = '', children, ...props }, ref) => {
    const statusStyles = {
      verified: 'bg-[#F5B041] text-[#0E1C3A] border border-[#0E1C3A]',
      processing: 'bg-secondary text-on-secondary',
      'action-required': 'bg-error text-on-error',
      'high-risk': 'bg-error text-on-error',
      'medium-risk': 'bg-[#F5B041] text-[#0E1C3A]',
      unclear: 'bg-secondary text-on-secondary',
    };

    const iconMap = {
      verified: 'check_circle',
      processing: 'sync',
      'action-required': 'priority_high',
      'high-risk': 'warning',
      'medium-risk': 'schedule',
      unclear: 'help',
    };

    const displayIcon = icon || iconMap[status];

    return (
      <div
        ref={ref}
        className={`px-3 py-1 rounded font-label-mono text-label-mono uppercase tracking-wide flex items-center gap-1 ${statusStyles[status]} ${className}`}
        {...props}
      >
        <span className="material-symbols-outlined text-sm">
          {displayIcon}
        </span>
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
