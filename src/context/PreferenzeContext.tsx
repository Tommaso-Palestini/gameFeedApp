import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Preferenze } from '../types';

type PreferenzeContextValue = Preferenze & {
  salvaPreferenze: (preferenze: Preferenze) => void;
};

const PreferenzeContext = createContext<PreferenzeContextValue | null>(null);

export function PreferenzeProvider({ children }: { children: React.ReactNode }) {
  const [preferenze, setPreferenze] = useState<Preferenze>({
    generi: [],
    piattaforme: [],
  });

  const value = useMemo(
    () => ({ ...preferenze, salvaPreferenze: setPreferenze }),
    [preferenze],
  );

  return (
    <PreferenzeContext.Provider value={value}>{children}</PreferenzeContext.Provider>
  );
}

export function usePreferenze(): PreferenzeContextValue {
  const context = useContext(PreferenzeContext);
  if (!context) {
    throw new Error('usePreferenze va usato dentro PreferenzeProvider');
  }
  return context;
}