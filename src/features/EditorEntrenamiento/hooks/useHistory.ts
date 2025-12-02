import { useState, useCallback } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export interface UseHistoryResult<T> {
  state: T;
  set: (newPresent: T | ((current: T) => T)) => void;
  reset: (newPresent: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useHistory<T>(initialPresent: T): UseHistoryResult<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialPresent,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => {
    setHistory((currentState) => {
      const { past, present, future } = currentState;
      if (past.length === 0) return currentState;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((currentState) => {
      const { past, present, future } = currentState;
      if (future.length === 0) return currentState;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const set = useCallback((newPresent: T | ((current: T) => T)) => {
    setHistory((currentState) => {
      const { present, past } = currentState;
      
      const nextPresent = typeof newPresent === 'function' 
        ? (newPresent as (current: T) => T)(present) 
        : newPresent;

      if (nextPresent === present) return currentState;

      return {
        past: [...past, present],
        present: nextPresent,
        future: [],
      };
    });
  }, []);
  
  const reset = useCallback((newPresent: T) => {
      setHistory({
          past: [],
          present: newPresent,
          future: []
      });
  }, []);

  return {
    state: history.present,
    set,
    reset,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
