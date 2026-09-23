import type { Game, Preferenze } from '../types';
import { MOCK_GIOCHI } from './mockGiochi';

export type FiltriRicerca = Preferenze & {
  testo: string;
};

function rispettaPreferenze(gioco: Game, { generi, piattaforme }: Preferenze): boolean {
  const generiOk =
    generi.length === 0 || gioco.generi.some(g => generi.includes(g));
  const piattaformeOk =
    piattaforme.length === 0 || gioco.piattaforme.some(p => piattaforme.includes(p));
  return generiOk && piattaformeOk;
}

export async function getFeed(preferenze: Preferenze): Promise<Game[]> {
  return MOCK_GIOCHI.filter(gioco => rispettaPreferenze(gioco, preferenze));
}

export async function cercaGiochi({ testo, generi, piattaforme }: FiltriRicerca): Promise<Game[]> {
  const query = testo.trim().toLowerCase();
  return MOCK_GIOCHI.filter(gioco => {
    const testoOk = query === '' || gioco.nome.toLowerCase().includes(query);
    return testoOk && rispettaPreferenze(gioco, { generi, piattaforme });
  });
}

export async function getGioco(id: number): Promise<Game | null> {
  return MOCK_GIOCHI.find(gioco => gioco.id === id) ?? null;
}