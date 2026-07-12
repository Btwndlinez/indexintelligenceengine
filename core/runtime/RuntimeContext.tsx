'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createRuntime } from './createRuntime';
import type { RuntimeContext } from './createRuntime';

const RuntimeCtx = createContext<RuntimeContext | null>(null);

export function RuntimeProvider({ children }: { children: React.ReactNode }) {
  const [runtime, setRuntime] = useState<RuntimeContext | null>(null);

  useEffect(() => {
    const rt = createRuntime();
    setRuntime(rt);
  }, []);

  if (!runtime) return null;

  return (
    <RuntimeCtx.Provider value={runtime}>
      {children}
    </RuntimeCtx.Provider>
  );
}

export function useRuntimeCtx(): RuntimeContext {
  const ctx = useContext(RuntimeCtx);
  if (!ctx) {
    throw new Error('useRuntimeCtx must be used within a RuntimeProvider');
  }
  return ctx;
}
