import type { Game, Preferenze } from '../types';
import { MOCK_GIOCHI } from './mockGiochi';

export type FiltriRicerca = {
  testo: string;
  generi: string[];
  piattaforme: string[];
  modalita: string[];
  annoDa: number | null;
  annoA: number | null;
};

function contieneAlmenoUno(valori: string[], scelti: string[]): boolean {
  return scelti.length === 0 || valori.some(v => scelti.includes(v));
}

function rispettaPreferenze(gioco: Game, preferenze: Preferenze): boolean {
  return (
    contieneAlmenoUno(gioco.generi, preferenze.generi) &&
    contieneAlmenoUno(gioco.piattaforme, preferenze.piattaforme) &&
    contieneAlmenoUno(gioco.modalita, preferenze.modalita)
  );
}

export async function getFeed(preferenze: Preferenze): Promise<Game[]> {
  return MOCK_GIOCHI.filter(gioco => rispettaPreferenze(gioco, preferenze));
}

export async function cercaGiochi(filtri: FiltriRicerca): Promise<Game[]> {
  const query = filtri.testo.trim().toLowerCase();
  return MOCK_GIOCHI.filter(gioco => {
    const testoOk = query === '' || gioco.nome.toLowerCase().includes(query);
    const annoDaOk = filtri.annoDa === null || gioco.uscita >= filtri.annoDa;
    const annoAOk = filtri.annoA === null || gioco.uscita <= filtri.annoA;
    return (
      testoOk &&
      contieneAlmenoUno(gioco.generi, filtri.generi) &&
      contieneAlmenoUno(gioco.piattaforme, filtri.piattaforme) &&
      contieneAlmenoUno(gioco.modalita, filtri.modalita) &&
      annoDaOk &&
      annoAOk
    );
  });
}

export async function getGioco(id: number): Promise<Game | null> {
  return MOCK_GIOCHI.find(gioco => gioco.id === id) ?? null;
}