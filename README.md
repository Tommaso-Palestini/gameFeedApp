# GameFeedApp

App mobile React Native per scoprire videogiochi con un feed verticale stile TikTok.
Si scelgono generi, piattaforme e modalità di gioco, e il feed propone i giochi
dal più compatibile al meno compatibile. Con uno swipe si aggiungono alla wishlist
o si aprono le informazioni.

Progetto del corso ITS Prodigi. L'app mobile e il backend stanno in repository separati:
i dati arrivano dal backend [backend-app-game-feed](https://github.com/Tommaso-Palestini/backend-app-game-feed),
che a sua volta li prende da [IGDB](https://www.igdb.com).

## Funzionalità

- **Onboarding**: scelta di generi, piattaforme e modalità (single player, multiplayer, co-op), con chip animati
- **Feed infinito**: giochi ordinati per compatibilità con le preferenze, caricati a pagine mentre si scorre
  - swipe a destra → aggiunge alla wishlist
  - swipe a sinistra → apre il dettaglio
  - quando i giochi compatibili finiscono compare un avviso, poi il feed continua con giochi casuali
- **Cerca**: ricerca per nome (anche parziale) con filtri per piattaforma, genere, modalità e anno, e scroll infinito
- **Wishlist**: elenco dei giochi salvati, con animazioni quando si aggiunge o si toglie
- **Dettaglio**: copertina, descrizione, sviluppatori, voto della critica, generi, piattaforme e modalità
- **Account**: registrazione e accesso con email e password; preferenze e wishlist vengono salvate sull'account
- **Uso come ospite**: preferenze e wishlist salvate sul telefono; registrandosi passano al nuovo account
- **Impostazioni**: tema chiaro / scuro / di sistema, modifica delle preferenze, uscita dall'account
- **Tab bar** personalizzata con indicatore "slime" animato e transizione animata per il login

## Stack

- React Native 0.87 (CLI, senza Expo) + TypeScript
- React Navigation (native stack + bottom tabs)
- Animazioni con `Animated` di React Native
- `react-native-svg` + `lucide-react-native` per icone e sfumature
- `@react-native-async-storage/async-storage` per tema, sessione, preferenze e wishlist
- Font [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (licenza OFL) per i titoli

## Requisiti

- Node 22.11 o superiore
- JDK 17
- Android Studio con Android SDK Platform 35 e Build-Tools 36.0.0
- Variabile d'ambiente `ANDROID_HOME` configurata
- Un telefono Android con il debug USB attivo (oppure un emulatore)
- Il backend [backend-app-game-feed](https://github.com/Tommaso-Palestini/backend-app-game-feed) in esecuzione

## Installazione

```bash
git clone https://github.com/Tommaso-Palestini/GameFeedApp.git
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
├── api/            client HTTP (timeout, annullamento, errori) e chiamate al backend
├── components/     card del feed, tab bar, chip, effetti LED, popup, ecc.
├── context/        account, preferenze e wishlist condivisi tra le schermate
├── data/           elenchi di generi, piattaforme e modalità
├── hooks/          useDebounce, usePulsazione
├── navigation/     stack principale, tab e tipi di navigazione
├── screens/        Onboarding, Login, Feed, Cerca, Wishlist, Dettaglio, Account
├── storage/        lettura e scrittura dei dati salvati sul telefono
├── theme/          palette chiara e scura, spazi, raggi, ThemeContext
├── utils/          funzioni di supporto
└── types.ts        tipi Game, DettaglioGioco, Preferenze
```

## Ottimizzazioni

- **Feed e ricerca a pagine**: i giochi vengono caricati un blocco alla volta mentre si scorre
- **Precaricamento** delle copertine delle card successive a quella visibile
- **`React.memo`** sulle card del feed: si ridisegnano solo quando cambiano i loro dati
- **FlatList configurata** per tenere montate poche card alla volta (`windowSize`, `removeClippedSubviews`)
- **Debounce** della ricerca: la richiesta parte solo quando si smette di scrivere
- **Annullamento** delle ricerche superate con `AbortController`
- **Immagini in due formati**: piccole per le liste, grandi solo per feed e dettaglio

## Limiti attuali

- Il recupero della password non è ancora disponibile
- Gli account sono gestiti dal mini backend in un file JSON, senza database
- Le descrizioni dei giochi sono in inglese, perché IGDB non ha testi in italiano

Questi punti verranno completati collegando l'app al backend del progetto full stack.

## Crediti

Dati dei giochi forniti da [IGDB](https://www.igdb.com).