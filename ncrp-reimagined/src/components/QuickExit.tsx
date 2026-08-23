'use client';

import { useEffect, useCallback } from 'react';

export default function QuickExit() {
  const exit = useCallback(() => {
    // Clear all journey state
    try {
      sessionStorage.clear();
      localStorage.removeItem('ncrp_journey');
    } catch { /* ignore */ }

    // Replace history so Back button doesn't return
    window.location.replace('https://www.google.com/search?q=weather+today');
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Double-ESC to exit
      if (e.key === 'Escape') {
        const lastEsc = (window as Window & { _lastEsc?: number })._lastEsc ?? 0;
        const now = Date.now();
        if (now - lastEsc < 800) {
          exit();
        }
        (window as Window & { _lastEsc?: number })._lastEsc = now;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [exit]);

  return (
    <button
      onClick={exit}
      className="quick-exit-btn"
      aria-label="Quick exit — leaves this page immediately"
      title="Double-press ESC or click to leave quickly"
    >
      <span aria-hidden>✕</span>
      QUICK EXIT
    </button>
  );
}
