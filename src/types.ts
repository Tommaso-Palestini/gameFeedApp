export type Game = {
  id: number;
  nome: string;
  immagine: string;
  generi: string[];
  piattaforme: string[];
  modalita: string[];
  voto: number;
  uscita: number;
};

export type Preferenze = {
  generi: string[];
  piattaforme: string[];
};