'use client';

import { LanguageProvider } from '../core/localization/LanguageContext';
import { LayoutProvider } from '@iie/layout-engine/react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </LayoutProvider>
  );
}
