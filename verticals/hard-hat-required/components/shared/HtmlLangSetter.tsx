'use client';

import { useLanguage } from '@/core/localization/LanguageContext';
import { useEffect } from 'react';

export default function HtmlLangSetter() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
