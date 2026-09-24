import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAccount } from './AccountContext';
import { salvaWishlistRemota } from '../api/account';
import { CHIAVI, leggiJson, scriviJson } from '../storage/archivioLocale';
import type { Game } from '../types';

type WishlistContextValue = {
  wishlist: Game[];
  caricata: boolean;
  aggiungi: (gioco: Game) => void;
  rimuovi: (id: number) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function soloDatiGioco(gioco: Game): Game {
  return {
    id: gioco.id,
    nome: gioco.nome,
    immagine: gioco.immagine,
    immagineGrande: gioco.immagineGrande,
    generi: gioco.generi,
    piattaforme: gioco.piattaforme,
    modalita: gioco.modalita,
    voto: gioco.voto,
    uscita: gioco.uscita,
  };
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { token, ultimiDati } = useAccount();
  const [wishlist, setWishlist] = useState<Game[]>([]);
  const [caricata, setCaricata] = useState(false);

  const attuale = useRef<Game[]>([]);
  const datiAccountApplicati = useRef(false);
  const codaServer = useRef<Promise<void>>(Promise.resolve());

  const imposta = useCallback((lista: Game[]) => {
    attuale.current = lista;
    setWishlist(lista);
  }, []);

  useEffect(() => {
    leggiJson<Game[]>(CHIAVI.wishlist, [])
      .then(salvata => {
        if (!datiAccountApplicati.current) {
          imposta(salvata);
        }
      })
      .finally(() => setCaricata(true));
  }, [imposta]);

  useEffect(() => {
    if (!ultimiDati) {
      return;
    }
    datiAccountApplicati.current = true;
    imposta(ultimiDati.wishlist);
    scriviJson(CHIAVI.wishlist, ultimiDati.wishlist);
  }, [ultimiDati, imposta]);

  const aggiorna = useCallback(
    (lista: Game[]) => {
      imposta(lista);
      scriviJson(CHIAVI.wishlist, lista);
      if (token) {
        codaServer.current = codaServer.current
          .then(() => salvaWishlistRemota(token, lista))
          .catch(() => {
            // resta salvata sul telefono
          });
      }
    },
    [imposta, token],
  );

  const aggiungi = useCallback(
    (gioco: Game) => {
      if (attuale.current.some(g => g.id === gioco.id)) {
        return;
      }
      aggiorna([soloDatiGioco(gioco), ...attuale.current]);
    },
    [aggiorna],
  );

  const rimuovi = useCallback(
    (id: number) => {
      aggiorna(attuale.current.filter(g => g.id !== id));
    },
    [aggiorna],
  );

  const value = useMemo(
    () => ({ wishlist, caricata, aggiungi, rimuovi }),
    [wishlist, caricata, aggiungi, rimuovi],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist va usato dentro WishlistProvider');
  }
  return context;
}