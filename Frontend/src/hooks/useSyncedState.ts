import { useRef, useState, useEffect } from 'react';

/**
 * Custom hook that returns React state along with a synced ref to its latest value.
 * Useful for avoiding stale closures in async or delayed logic.
 */
export function useSyncedState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const ref = useRef<T>(state);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return [state, setState, ref] as const;
}