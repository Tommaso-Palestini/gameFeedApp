import type { Game } from '../types';

function immagine(id: number): string {
  return `https://picsum.photos/seed/game${id}/600/900`;
}

const PS = ['PlayStation 5', 'PlayStation 4'];
const XBOX = ['Xbox Series X|S', 'Xbox One'];

export const MOCK_GIOCHI: Game[] = [
  { id: 1, nome: 'The Witcher 3', immagine: immagine(1), generi: ['RPG', 'Avventura', 'Open world'], piattaforme: ['PC', ...PS, ...XBOX, 'Nintendo Switch'], modalita: ['Single player'], voto: 4.7, uscita: 2015 },
  { id: 2, nome: 'Hades', immagine: immagine(2), generi: ['Azione', 'Roguelike', 'Indie'], piattaforme: ['PC', ...PS, ...XBOX, 'Nintendo Switch', 'iOS'], modalita: ['Single player'], voto: 4.4, uscita: 2020 },
  { id: 3, nome: 'Hollow Knight', immagine: immagine(3), generi: ['Metroidvania', 'Platform', 'Indie'], piattaforme: ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'], modalita: ['Single player'], voto: 4.5, uscita: 2017 },
  { id: 4, nome: 'Stardew Valley', immagine: immagine(4), generi: ['Simulazione', 'RPG', 'Indie'], piattaforme: ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch', 'iOS', 'Android'], modalita: ['Single player', 'Multiplayer', 'Co-op'], voto: 4.4, uscita: 2016 },
  { id: 5, nome: 'Doom Eternal', immagine: immagine(5), generi: ['Sparatutto', 'Azione'], piattaforme: ['PC', ...PS, ...XBOX, 'Nintendo Switch'], modalita: ['Single player', 'Multiplayer'], voto: 4.3, uscita: 2020 },
  { id: 6, nome: 'Civilization VI', immagine: immagine(6), generi: ['Strategia'], piattaforme: ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch', 'iOS', 'Android'], modalita: ['Single player', 'Multiplayer'], voto: 4.0, uscita: 2016 },
  { id: 7, nome: 'Forza Horizon 5', immagine: immagine(7), generi: ['Corse', 'Open world'], piattaforme: ['PC', 'Xbox Series X|S', 'Xbox One', 'PlayStation 5'], modalita: ['Single player', 'Multiplayer', 'Co-op'], voto: 4.4, uscita: 2021 },
  { id: 8, nome: 'EA Sports FC 25', immagine: immagine(8), generi: ['Sport'], piattaforme: ['PC', ...PS, ...XBOX, 'Nintendo Switch'], modalita: ['Single player', 'Multiplayer', 'Co-op'], voto: 3.2, uscita: 2024 },
  { id: 9, nome: 'Portal 2', immagine: immagine(9), generi: ['Puzzle', 'Sparatutto'], piattaforme: ['PC', 'Nintendo Switch'], modalita: ['Single player', 'Co-op'], voto: 4.6, uscita: 2011 },
  { id: 10, nome: 'Resident Evil 4', immagine: immagine(10), generi: ['Horror', 'Azione', 'Survival'], piattaforme: ['PC', ...PS, 'Xbox Series X|S', 'iOS'], modalita: ['Single player'], voto: 4.4, uscita: 2023 },
  { id: 11, nome: 'Celeste', immagine: immagine(11), generi: ['Platform', 'Indie'], piattaforme: ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'], modalita: ['Single player'], voto: 4.4, uscita: 2018 },
  { id: 12, nome: 'Monument Valley', immagine: immagine(12), generi: ['Puzzle', 'Casual', 'Indie'], piattaforme: ['iOS', 'Android', 'PC'], modalita: ['Single player'], voto: 4.3, uscita: 2014 },
  { id: 13, nome: 'Mario Kart 8 Deluxe', immagine: immagine(13), generi: ['Corse', 'Casual'], piattaforme: ['Nintendo Switch'], modalita: ['Single player', 'Multiplayer', 'Co-op'], voto: 4.5, uscita: 2017 },
  { id: 14, nome: 'XCOM 2', immagine: immagine(14), generi: ['Strategia'], piattaforme: ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'], modalita: ['Single player', 'Multiplayer'], voto: 4.1, uscita: 2016 },
  { id: 15, nome: 'Mario Kart World', immagine: immagine(15), generi: ['Corse', 'Open world'], piattaforme: ['Nintendo Switch 2'], modalita: ['Single player', 'Multiplayer', 'Co-op'], voto: 4.3, uscita: 2025 },
  { id: 16, nome: 'It Takes Two', immagine: immagine(16), generi: ['Avventura', 'Platform'], piattaforme: ['PC', ...PS, ...XBOX, 'Nintendo Switch'], modalita: ['Co-op'], voto: 4.6, uscita: 2021 },
  { id: 17, nome: 'Elden Ring', immagine: immagine(17), generi: ['RPG', 'Azione', 'Open world'], piattaforme: ['PC', ...PS, ...XBOX], modalita: ['Single player', 'Multiplayer', 'Co-op'], voto: 4.6, uscita: 2022 },
  { id: 18, nome: 'Minecraft', immagine: immagine(18), generi: ['Survival', 'Avventura', 'Casual'], piattaforme: ['PC', ...PS, ...XBOX, 'Nintendo Switch', 'iOS', 'Android'], modalita: ['Single player', 'Multiplayer', 'Co-op'], voto: 4.4, uscita: 2011 },
];