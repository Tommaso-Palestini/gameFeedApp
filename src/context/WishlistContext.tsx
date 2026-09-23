import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Game } from '../types';

type WishlistContextValue = {
  wishlist: Game[];
  aggiungi: (gioco: Game) => void;
  rimuovi: (id: number) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Game[]>([]);

  const aggiungi = useCallback((gioco: Game) => {
    setWishlist(prev =>
      prev.some(g => g.id === gioco.id) ? prev : [gioco, ...prev],
    );
  }, []);

  const rimuovi = useCallback((id: number) => {
    setWishlist(prev => prev.filter(g => g.id !== id));
  }, []);

  const value = useMemo(
    () => ({ wishlist, aggiungi, rimuovi }),
    [wishlist, aggiungi, rimuovi],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist va usato dentro WishlistProvider');
  }
  return context;
}