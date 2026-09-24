import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAccount } from './AccountContext';
import { salvaPreferenzeRemote } from '../api/account';
import { CHIAVI, PREFERENZE_VUOTE, leggiJson, scriviJson } from '../storage/archivioLocale';
import type { Preferenze } from '../types';

type PreferenzeContextValue = Preferenze & {
  caricate: boolean;
  salvaPreferenze: (preferenze: Preferenze) => void;
};

const PreferenzeContext = createContext<PreferenzeContextValue | null>(null);

export function PreferenzeProvider({ children }: { children: React.ReactNode }) {
  const { token, ultimiDati } = useAccount();
  const [preferenze, setPreferenze] = useState<Preferenze>(PREFERENZE_VUOTE);
  const [caricate, setCaricate] = useState(false);
  const datiAccountApplicati = useRef(false);

  useEffect(() => {
    leggiJson<Preferenze>(CHIAVI.preferenze, PREFERENZE_VUOTE)
      .then(salvate => {
        if (!datiAccountApplicati.current) {
          setPreferenze({ ...PREFERENZE_VUOTE, ...salvate });
        }
      })
      .finally(() => setCaricate(true));
  }, []);

  useEffect(() => {
    if (!ultimiDati) {
      return;
    }
    datiAccountApplicati.current = true;
    setPreferenze(ultimiDati.preferenze);
    scriviJson(CHIAVI.preferenze, ultimiDati.preferenze);
  }, [ultimiDati]);

  const salvaPreferenze = useCallback(
    (nuove: Preferenze) => {
      setPreferenze(nuove);
      scriviJson(CHIAVI.preferenze, nuove);
      if (token) {
        salvaPreferenzeRemote(token, nuove).catch(() => {
          // restano salvate sul telefono
        });
      }
    },
    [token],
  );

  const value = useMemo(
    () => ({ ...preferenze, caricate, salvaPreferenze }),
    [preferenze, caricate, salvaPreferenze],
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