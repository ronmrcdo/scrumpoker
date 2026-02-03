'use client';

import { useEffect } from 'react';
import { useHydratedThemeMode } from '@/lib/store/theme-store';

function applyTheme(mode: 'light' | 'dark' | 'system') {
  const root = document.documentElement;

  if (mode === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', mode);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useHydratedThemeMode();

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  return <>{children}</>;
}
