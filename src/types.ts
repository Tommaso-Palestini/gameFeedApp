export type Game = {
  id: number;
  nome: string;
  immagine: string | null;
  immagineGrande: string | null;
  generi: string[];
  piattaforme: string[];
  modalita: string[];
  voto: number;
  uscita: number | null;
  compatibilita?: number;
};

export type DettaglioGioco = Game & {
  descrizione: string;
  sviluppatori: string[];
  votoCritica: number | null;
  paginaIgdb: string | null;
};

export type Preferenze = {
  generi: string[];
  piattaforme: string[];
  modalita: string[];
};