'use client';

import { LanguageProvider } from '../core/localization/LanguageContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
