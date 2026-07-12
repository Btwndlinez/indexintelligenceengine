'use client';

import { useRuntimeCtx } from './RuntimeContext';
import type { RuntimeContext } from './createRuntime';

export function useRuntime(): RuntimeContext {
  return useRuntimeCtx();
}
