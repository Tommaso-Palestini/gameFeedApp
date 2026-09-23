import type { Game } from '../types';

export function formattaVotoEAnno(gioco: Game): string {
  const parti: string[] = [];
  if (gioco.voto > 0) {
    parti.push(`★ ${gioco.voto.toFixed(1)}`);
  }
  if (gioco.uscita !== null) {
    parti.push(String(gioco.uscita));
  }
  return parti.join(' · ');
}