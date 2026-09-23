# GameFeedApp

App mobile React Native per scoprire videogiochi con un feed verticale stile TikTok.
Si scelgono generi, piattaforme e modalità di gioco, e il feed propone i giochi
dal più compatibile al meno compatibile. Con uno swipe si aggiungono alla wishlist
o si aprono le informazioni.

Progetto del corso ITS Prodigi. L'app mobile e il backend stanno in repository separati:
i dati arrivano dal backend [game-feed-backend](https://github.com/TUO-UTENTE/game-feed-backend),
che a sua volta li prende da [IGDB](https://www.igdb.com).

## Funzionalità

- **Onboarding**: scelta di generi, piattaforme e modalità (single player, multiplayer, co-op), con chip animati
- **Feed infinito**: giochi ordinati per compatibilità con le preferenze, caricati a pagine mentre si scorre
  - swipe a destra → aggiunge alla wishlist
  - swipe a sinistra → apre il dettaglio
  - quando i giochi compatibili finiscono compare un avviso, poi il feed continua con giochi casuali
- **Cerca**: ricerca per nome (anche parziale) con filtri per piattaforma, genere, modalità e anno
- **Wishlist**: elenco dei giochi salvati, con animazioni quando si aggiunge o si toglie
- **Dettaglio**: copertina, descrizione, sviluppatori, voto della critica, generi, piattaforme e modalità
- **Account**: tema chiaro / scuro / di sistema (salvato sul dispositivo) e modifica delle preferenze
- **Login e registrazione** con validazione dei campi e transizione animata
- **Tab bar** personalizzata con indicatore "slime" animato

## Stack

- React Native 0.87 (CLI, senza Expo) + TypeScript
- React Navigation (native stack + bottom tabs)
- Animazioni con `Animated` di React Native
- `react-native-svg` + `lucide-react-native` per icone e sfumature
- `@react-native-async-storage/async-storage` per salvare il tema
- Font [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (licenza OFL) per i titoli

## Requisiti

- Node 22.11 o superiore
- JDK 17
- Android Studio con Android SDK Platform 35 e Build-Tools 36.0.0
- Variabile d'ambiente `ANDROID_HOME` configurata
- Un telefono Android con il debug USB attivo (oppure un emulatore)
- Il backend [game-feed-backend](https://github.com/TUO-UTENTE/game-feed-backend) in esecuzione

## Installazione

```bash
git clone https://github.com/TUO-UTENTE/GameFeedApp.git
cd GameFeedApp
npm install
```

## Avvio

1. Avvia il backend (vedi il suo README): deve rispondere su `http://localhost:3000`.
2. Collega il telefono via USB e rendi raggiungibile il backend dal telefono:
```bash
   adb reverse tcp:3000 tcp:3000
```
3. Avvia Metro in un terminale:
```bash
   npm start
```
4. In un secondo terminale compila e installa l'app:
```bash
   npx react-native run-android
```

`adb reverse` va ripetuto ogni volta che il telefono viene scollegato.
L'indirizzo del backend si cambia in `src/api/config.ts`.

## Struttura

```
src/
├── api/            client HTTP (timeout, errori) e chiamate al backend
├── components/     card del feed, tab bar, chip, effetti LED, popup, ecc.
├── context/        preferenze e wishlist condivise tra le schermate
├── data/           elenchi di generi, piattaforme e modalità
├── hooks/          useDebounce, usePulsazione
├── navigation/     stack principale, tab e tipi di navigazione
├── screens/        Onboarding, Login, Feed, Cerca, Wishlist, Dettaglio, Account
├── theme/          palette chiara e scura, spazi, raggi, ThemeContext
├── utils/          funzioni di supporto
└── types.ts        tipi Game, DettaglioGioco, Preferenze
```

## Limiti attuali

- Wishlist e preferenze sono in memoria: si azzerano quando si chiude l'app
- Login e registrazione sono simulati: validano i campi ma non contattano un server
- Le descrizioni dei giochi sono in inglese, perché IGDB non ha testi in italiano

Questi punti verranno completati collegando l'app al backend del progetto full stack.

## Crediti

Dati dei giochi forniti da [IGDB](https://www.igdb.com).