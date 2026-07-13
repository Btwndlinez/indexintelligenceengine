'use client';

import { LanguageProvider } from '../../verticals/hard-hat-required/context/LanguageContext';

export default function HhrLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
