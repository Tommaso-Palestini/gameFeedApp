import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALETTE_CHIARA, PALETTE_SCURA, type Palette } from './tema';

export type ModalitaTema = 'sistema' | 'chiaro' | 'scuro';

const CHIAVE_TEMA = 'impostazioni.tema';

type ThemeContextValue = {
  colori: Palette;
  scuro: boolean;
  modalitaTema: ModalitaTema;
  setModalitaTema: (modalita: ModalitaTema) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isModalitaTema(valore: string | null): valore is ModalitaTema {
  return valore === 'sistema' || valore === 'chiaro' || valore === 'scuro';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const schemaSistema = useColorScheme();
  const [modalitaTema, setModalitaTemaState] = useState<ModalitaTema>('sistema');
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CHIAVE_TEMA)
      .then(valore => {
        if (isModalitaTema(valore)) {
          setModalitaTemaState(valore);
        }
      })
      .catch(() => {
        // se la lettura fallisce resta il tema di sistema
      })
      .finally(() => setPronto(true));
  }, []);

  const setModalitaTema = useCallback((modalita: ModalitaTema) => {
    setModalitaTemaState(modalita);
    AsyncStorage.setItem(CHIAVE_TEMA, modalita).catch(() => {
      // se il salvataggio fallisce il tema vale solo per questa sessione
    });
  }, []);

  const scuro =
    modalitaTema === 'scuro' ||
    (modalitaTema === 'sistema' && schemaSistema === 'dark');

  const value = useMemo(
    () => ({
      colori: scuro ? PALETTE_SCURA : PALETTE_CHIARA,
      scuro,
      modalitaTema,
      setModalitaTema,
    }),
    [scuro, modalitaTema, setModalitaTema],
  );

  if (!pronto) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme va usato dentro ThemeProvider');
  }
  return context;
}