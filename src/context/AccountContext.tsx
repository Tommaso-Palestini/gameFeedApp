import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  accedi as apiAccedi,
  esci as apiEsci,
  getAccount,
  registrati as apiRegistrati,
  type DatiAccount,
  type UtenteAccount,
} from '../api/account';
import { ErroreApi } from '../api/client';
import {
  CHIAVI,
  PREFERENZE_VUOTE,
  leggiJson,
  rimuoviChiave,
  scriviJson,
} from '../storage/archivioLocale.ts';

type Sessione = {
  token: string;
  utente: UtenteAccount;
};

type AccountContextValue = {
  utente: UtenteAccount | null;
  token: string | null;
  pronto: boolean;
  ultimiDati: DatiAccount | null;
  accedi: (email: string, password: string) => Promise<DatiAccount>;
  registrati: (
    nome: string,
    email: string,
    password: string,
    datiOspite: DatiAccount,
  ) => Promise<DatiAccount>;
  esci: () => Promise<void>;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [sessione, setSessione] = useState<Sessione | null>(null);
  const [pronto, setPronto] = useState(false);
  const [ultimiDati, setUltimiDati] = useState<DatiAccount | null>(null);

  useEffect(() => {
    let attivo = true;

    leggiJson<Sessione | null>(CHIAVI.sessione, null).then(salvata => {
      if (!attivo) {
        return;
      }
      setPronto(true);
      if (!salvata) {
        return;
      }
      setSessione(salvata);

      getAccount(salvata.token)
        .then(risposta => {
          if (!attivo) {
            return;
          }
          const aggiornata = { token: salvata.token, utente: risposta.utente };
          setSessione(aggiornata);
          scriviJson(CHIAVI.sessione, aggiornata);
          setUltimiDati(risposta.dati);
        })
        .catch(errore => {
          if (attivo && errore instanceof ErroreApi && errore.stato === 401) {
            setSessione(null);
            rimuoviChiave(CHIAVI.sessione);
          }
        });
    });

    return () => {
      attivo = false;
    };
  }, []);

  const apriSessione = useCallback(
    async (token: string, utente: UtenteAccount, dati: DatiAccount) => {
      const nuova = { token, utente };
      await scriviJson(CHIAVI.sessione, nuova);
      setSessione(nuova);
      setUltimiDati(dati);
      return dati;
    },
    [],
  );

  const accedi = useCallback(
    async (email: string, password: string) => {
      const risposta = await apiAccedi(email, password);
      return apriSessione(risposta.token, risposta.utente, risposta.dati);
    },
    [apriSessione],
  );

  const registrati = useCallback(
    async (nome: string, email: string, password: string, datiOspite: DatiAccount) => {
      const risposta = await apiRegistrati(nome, email, password, datiOspite);
      return apriSessione(risposta.token, risposta.utente, risposta.dati);
    },
    [apriSessione],
  );

  const esci = useCallback(async () => {
    const token = sessione?.token;
    setSessione(null);
    setUltimiDati({ preferenze: PREFERENZE_VUOTE, wishlist: [] });
    await rimuoviChiave(CHIAVI.sessione);
    if (token) {
      apiEsci(token).catch(() => {
        // la sessione scadrà comunque da sola
      });
    }
  }, [sessione]);

  const value = useMemo(
    () => ({
      utente: sessione?.utente ?? null,
      token: sessione?.token ?? null,
      pronto,
      ultimiDati,
      accedi,
      registrati,
      esci,
    }),
    [sessione, pronto, ultimiDati, accedi, registrati, esci],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount va usato dentro AccountProvider');
  }
  return context;
}