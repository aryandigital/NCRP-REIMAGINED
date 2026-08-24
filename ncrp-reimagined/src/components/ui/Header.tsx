import React from 'react';
import Link from 'next/link';
import { Button } from './Button';

interface HeaderProps {
  title?: string;
  logo?: React.ReactNode;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Cybercrime Help',
  logo,
  children,
}) => {
  return (
    <header className="bg-surface-container-lowest border-b-2 border-outline sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-margin-desktop h-16 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {logo ? (
            logo
          ) : (
            <>
              <span className="material-symbols-outlined text-primary text-2xl">
                language
              </span>
              <span className="font-headline-md text-headline-md text-primary tracking-tight">
                {title}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {children}
          <Button variant="ghost" size="sm" className="min-w-24">
            Quick Exit
          </Button>
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
