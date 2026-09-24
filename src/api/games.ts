import { getJson } from './client';
import type { DettaglioGioco, Game, Preferenze } from '../types';

export type FiltriRicerca = {
  testo: string;
  generi: string[];
  piattaforme: string[];
  modalita: string[];
  annoDa: number | null;
  annoA: number | null;
};

export type RisultatiRicerca = {
  giochi: Game[];
  altrePagine: boolean;
};

export type PaginaFeed = {
  giochi: Game[];
  cursore: string | null;
};

type RispostaGiochi = {
  giochi: Game[];
};

export async function getFeed(preferenze: Preferenze, cursore: string | null): Promise<PaginaFeed> {
  return getJson<PaginaFeed>('/games/feed', { ...preferenze, cursore });
}

export async function getGiochiCasuali(piattaforme: string[]): Promise<Game[]> {
  const risposta = await getJson<RispostaGiochi>('/games/random', { piattaforme });
  return risposta.giochi;
}

export async function cercaGiochi(
  filtri: FiltriRicerca,
  pagina = 1,
  segnale?: AbortSignal,
): Promise<RisultatiRicerca> {
  return getJson<RisultatiRicerca>(
    '/games/search',
    {
      q: filtri.testo,
      generi: filtri.generi,
      piattaforme: filtri.piattaforme,
      modalita: filtri.modalita,
      annoDa: filtri.annoDa,
      annoA: filtri.annoA,
      pagina,
    },
    segnale,
  );
}

export async function getGioco(id: number): Promise<DettaglioGioco> {
  return getJson<DettaglioGioco>(`/games/${id}`);
}