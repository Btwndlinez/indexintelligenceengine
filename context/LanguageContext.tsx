'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const esDictionary: Record<string, string> = {
  'daily intelligence': 'Inteligencia Diaria',
  'active bids': 'Licitaciones Activas',
  'compliance': 'Cumplimiento Normativo',
  'market intelligence': 'Inteligencia de Mercado',
  'industry index': 'Índice de la Industria',
  'win more contracts': 'Gane Más Contratos',
  'contractor intelligence': 'Inteligencia de Contratistas',
  'osha violation risk': 'Riesgo de Infracción de OSHA',
  'hard hats required': 'Hard Hats Required',
  'search radius': 'Radio de Búsqueda',
  'run discovery': 'Ejecutar Búsqueda',
  'enter zip code': 'Ingrese el Código Postal',
  'select index type': 'Seleccionar Tipo de Índice',
  'source': 'Fuente',
  'score': 'Puntaje',
  'grade': 'Grado',
  'phone': 'Teléfono',
  'email': 'Correo Electrónico',
  'website': 'Sitio Web',
  'distance': 'Distancia',
  'pipeline': 'Tubería de Ventas',
  'campaigns': 'Campañas',
  'reports': 'Informes',
  'settings': 'Configuración',
  'login': 'Iniciar Sesión',
  'get access': 'Obtener Acceso',
  'english': 'English',
  'español': 'Español',
  'bids': 'Licitaciones',
  'news': 'Noticias',
  'compliance alerts': 'Alertas de Cumplimiento',
  'elevator inspection': 'Inspección de Elevadores',
  'emergency generator load bank testing': 'Prueba de Banco de Carga de Generadores de Emergencia',
  'grease trap compliance': 'Cumplimiento de Trampas de Grasa',
  'backflow certification status': 'Estado de Certificación de Flujo Inverso',
  'fire sprinkler inspection tracker': 'Rastreador de Inspección de Rociadores de Incendios',
  'tier a leads found': 'Clientes Potenciales de Nivel A Encontrados',
  'expiring state licenses': 'Licencias Estatales por Expirar',
  'municipal vendor search engine': 'Motor de Búsqueda de Proveedores Municipales',
  'high intent demand alerts': 'Alertas de Demanda de Alta Intención',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [loading, setLoading] = useState(false);

  const setLanguage = async (targetLang: Language) => {
    if (targetLang === 'en') {
      setLanguageState('en');
      return;
    }
    setLoading(true);
    setLanguageState(targetLang);
    setLoading(false);
  };

  const t = (text: string): string => {
    if (language === 'en') return text;
    return esDictionary[text.trim().toLowerCase()] || text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
