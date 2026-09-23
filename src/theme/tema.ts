export type Palette = {
  sfondo: string;
  superficie: string;
  superficieAlta: string;
  bordo: string;
  testo: string;
  testoSecondario: string;
  accento: string;
  accentoTenue: string;
  accentoSecondario: string;
  testoSuAccento: string;
  pericolo: string;
};

export const PALETTE_SCURA: Palette = {
  sfondo: '#0a0a0a',
  superficie: '#141414',
  superficieAlta: '#1e1e1e',
  bordo: '#2a2a2a',
  testo: '#f2f2f2',
  testoSecondario: '#9a9a9a',
  accento: '#4ade80',
  accentoTenue: 'rgba(74, 222, 128, 0.15)',
  accentoSecondario: '#22d3ee',
  testoSuAccento: '#0a0a0a',
  pericolo: '#ef4444',
};

export const PALETTE_CHIARA: Palette = {
  sfondo: '#ffffff',
  superficie: '#f7f7f7',
  superficieAlta: '#efefef',
  bordo: '#e4e4e4',
  testo: '#111111',
  testoSecondario: '#666666',
  accento: '#e5484d',
  accentoTenue: 'rgba(229, 72, 77, 0.12)',
  accentoSecondario: '#f59e0b',
  testoSuAccento: '#ffffff',
  pericolo: '#b91c1c',
};

export const SPAZI = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
} as const;

export const RAGGI = {
  s: 8,
  m: 12,
  l: 20,
  pillola: 999,
} as const;