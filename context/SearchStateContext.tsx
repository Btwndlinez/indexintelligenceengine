'use client';
import React, { createContext, useContext, useState } from 'react';

interface ContextType {
  [key: string]: any;
}

const Ctx = createContext<ContextType | undefined>(undefined);

export const useSearchState = () => {
  const c = useContext(Ctx);
  return c || {};
};

export function SearchStateProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(Ctx.Provider, { value: {} }, children);
}

export default SearchStateProvider;
