import React from 'react';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ maxWidth = 'lg', className = '', children, ...props }, ref) => {
    const maxWidthStyles = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-[1280px]',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'w-full',
    };

    return (
      <div
        ref={ref}
        className={`${maxWidthStyles[maxWidth]} mx-auto px-margin-desktop py-[120px] space-y-[120px] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PageContainer.displayName = 'PageContainer';
