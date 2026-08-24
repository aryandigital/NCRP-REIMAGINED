import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ title, description, className = '', children, ...props }, ref) => {
    return (
      <section ref={ref} className={`space-y-8 ${className}`} {...props}>
        {title && (
          <div>
            <h2 className="font-headline-md text-headline-md border-b-2 border-outline pb-4">
              {title}
            </h2>
            {description && (
              <p className="font-body-main text-body-main text-on-surface-variant max-w-2xl pt-4">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';
