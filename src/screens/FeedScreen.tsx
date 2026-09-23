import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameCard from '../components/GameCard';
import SwipeHints from '../components/SwipeHints';
import AvvisoFineCompatibili from '../components/AvvisoFineCompatibili';
import { getFeed, getGiochiCasuali } from '../api/games';
import { usePreferenze } from '../context/PreferenzeContext';
import { useWishlist } from '../context/WishlistContext';
import { SPAZI } from '../theme/tema';
import type { TabScreenProps } from '../navigation/types';
import type { Game } from '../types';

type Props = TabScreenProps<'Feed'>;

const MASSIMO_RICHIESTE_VUOTE = 3;

export default function FeedScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { generi, piattaforme, modalita } = usePreferenze();
  const { wishlist, aggiungi } = useWishlist();

  const [giochi, setGiochi] = useState<Game[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [caricamentoAltri, setCaricamentoAltri] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [tentativo, setTentativo] = useState(0);
  const [altezza, setAltezza] = useState(0);
  const [indiceCorrente, setIndiceCorrente] = useState(0);
  const [compatibiliFiniti, setCompatibiliFiniti] = useState(false);
  const [modalitaCasuale, setModalitaCasuale] = useState(false);
  const [avvisoVisibile, setAvvisoVisibile] = useState(false);
  const [contatoreFocus, setContatoreFocus] = useState(0);

  const entrata = useRef(new Animated.Value(1)).current;
  const cursore = useRef<string | null>(null);
  const idVisti = useRef(new Set<number>());
  const inCaricamento = useRef(false);
  const generazione = useRef(0);
  const avvisoMostrato = useRef(false);

  const preferenze = useMemo(
    () => ({ generi, piattaforme, modalita }),
    [generi, piattaforme, modalita],
  );

  const aggiungiNuovi = useCallback((nuovi: Game[]) => {
    const davveroNuovi = nuovi.filter(g => !idVisti.current.has(g.id));
    davveroNuovi.forEach(g => idVisti.current.add(g.id));
    if (davveroNuovi.length > 0) {
      setGiochi(prev => [...prev, ...davveroNuovi]);
    }
  }, []);

  const scaricaCompatibili = useCallback(async () => {
    let nuovi: Game[] = [];
    let prossimo = cursore.current;
    for (let i = 0; i < MASSIMO_RICHIESTE_VUOTE; i += 1) {
      const pagina = await getFeed(preferenze, prossimo);
      nuovi = pagina.giochi;
      prossimo = pagina.cursore;
      if (nuovi.length > 0 || prossimo === null) {
        break;
      }
    }
    return { nuovi, prossimo };
  }, [preferenze]);

  const scaricaCasuali = useCallback(async () => {
    for (let i = 0; i < MASSIMO_RICHIESTE_VUOTE; i += 1) {
      const casuali = await getGiochiCasuali(piattaforme);
      const nuovi = casuali.filter(g => !idVisti.current.has(g.id));
      if (nuovi.length > 0) {
        return nuovi;
      }
    }
    return [];
  }, [piattaforme]);

  useEffect(() => {
    generazione.current += 1;
    const mia = generazione.current;

    cursore.current = null;
    idVisti.current = new Set();
    inCaricamento.current = true;
    avvisoMostrato.current = false;

    setGiochi([]);
    setIndiceCorrente(0);
    setCompatibiliFiniti(false);
    setModalitaCasuale(false);
    setAvvisoVisibile(false);
    setErrore(null);
    setCaricamento(true);

    scaricaCompatibili()
      .then(({ nuovi, prossimo }) => {
        if (mia !== generazione.current) {
          return;
        }
        cursore.current = prossimo;
        aggiungiNuovi(nuovi);
        if (prossimo === null) {
          setCompatibiliFiniti(true);
        }
      })
      .catch(() => {
        if (mia === generazione.current) {
          setErrore('Impossibile caricare il feed. Controlla che il backend sia acceso.');
        }
      })
      .finally(() => {
        if (mia === generazione.current) {
          inCaricamento.current = false;
          setCaricamento(false);
        }
      });
  }, [scaricaCompatibili, aggiungiNuovi, tentativo]);

  useEffect(
    () => navigation.addListener('focus', () => setContatoreFocus(c => c + 1)),
    [navigation],
  );

  const conCaricamento = useCallback(async (azione: (mia: number) => Promise<void>) => {
    if (inCaricamento.current) {
      return;
    }
    const mia = generazione.current;
    inCaricamento.current = true;
    setCaricamentoAltri(true);
    try {
      await azione(mia);
    } catch {
      // errore temporaneo: si riprova al prossimo scorrimento
    } finally {
      if (mia === generazione.current) {
        inCaricamento.current = false;
        setCaricamentoAltri(false);
      }
    }
  }, []);

  const caricaCompatibili = useCallback(
    () =>
      conCaricamento(async mia => {
        const { nuovi, prossimo } = await scaricaCompatibili();
        if (mia !== generazione.current) {
          return;
        }
        cursore.current = prossimo;
        aggiungiNuovi(nuovi);
        if (prossimo === null) {
          setCompatibiliFiniti(true);
        }
      }),
    [conCaricamento, scaricaCompatibili, aggiungiNuovi],
  );

  const caricaCasuali = useCallback(
    () =>
      conCaricamento(async mia => {
        const nuovi = await scaricaCasuali();
        if (mia === generazione.current) {
          aggiungiNuovi(nuovi);
        }
      }),
    [conCaricamento, scaricaCasuali, aggiungiNuovi],
  );

  const caricaAltri = useCallback(() => {
    if (modalitaCasuale) {
      caricaCasuali();
    } else if (!compatibiliFiniti) {
      caricaCompatibili();
    }
  }, [modalitaCasuale, compatibiliFiniti, caricaCasuali, caricaCompatibili]);

  const idInWishlist = useMemo(() => new Set(wishlist.map(g => g.id)), [wishlist]);

  const giochiVisibili = useMemo(
    () => giochi.filter(g => !idInWishlist.has(g.id)),
    [giochi, idInWishlist],
  );

  useEffect(() => {
    if (caricamento || errore || modalitaCasuale || !compatibiliFiniti || avvisoMostrato.current) {
      return;
    }
    if (giochiVisibili.length === 0 || indiceCorrente >= giochiVisibili.length - 1) {
      avvisoMostrato.current = true;
      setAvvisoVisibile(true);
    }
  }, [
    caricamento,
    errore,
    modalitaCasuale,
    compatibiliFiniti,
    giochiVisibili.length,
    indiceCorrente,
    contatoreFocus,
  ]);

  const continuaConCasuali = () => {
    setAvvisoVisibile(false);
    setModalitaCasuale(true);
    caricaCasuali();
  };

  const cambiaPreferenze = () => {
    setAvvisoVisibile(false);
    avvisoMostrato.current = false;
    navigation.navigate('Onboarding', { modifica: true });
  };

  const handleSwipeRight = useCallback(
    (gioco: Game) => {
      entrata.setValue(0);
      aggiungi(gioco);
      Animated.timing(entrata, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [aggiungi, entrata],
  );

  const handleSwipeLeft = useCallback(
    (gioco: Game) => {
      navigation.navigate('Dettaglio', { id: gioco.id });
    },
    [navigation],
  );

  const mostraFeed = !caricamento && !errore && giochiVisibili.length > 0 && altezza > 0;

  const renderContenuto = () => {
    if (caricamento) {
      return <ActivityIndicator size="large" color="#fff" />;
    }
    if (errore) {
      return (
        <View style={styles.messaggio}>
          <Text style={styles.messaggioTesto}>{errore}</Text>
          <Pressable style={styles.riprova} onPress={() => setTentativo(t => t + 1)}>
            <Text style={styles.riprovaTesto}>Riprova</Text>
          </Pressable>
        </View>
      );
    }
    if (giochiVisibili.length === 0) {
      return caricamentoAltri ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.messaggio}>
          <Text style={styles.messaggioTesto}>Nessun gioco da mostrare per ora.</Text>
        </View>
      );
    }
    if (altezza === 0) {
      return null;
    }
    return (
      <FlatList
        data={giochiVisibili}
        keyExtractor={g => String(g.id)}
        extraData={indiceCorrente}
        renderItem={({ item, index }) => (
          <GameCard
            gioco={item}
            altezza={altezza}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            entrata={index === indiceCorrente ? entrata : undefined}
          />
        )}
        pagingEnabled
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onEndReached={caricaAltri}
        onEndReachedThreshold={3}
        windowSize={5}
        maxToRenderPerBatch={3}
        onMomentumScrollEnd={e =>
          setIndiceCorrente(Math.round(e.nativeEvent.contentOffset.y / altezza))
        }
        getItemLayout={(_, index) => ({
          length: altezza,
          offset: altezza * index,
          index,
        })}
      />
    );
  };

  return (
    <View
      style={styles.container}
      onLayout={e => setAltezza(e.nativeEvent.layout.height)}
    >
      {renderContenuto()}
      {mostraFeed && <SwipeHints top={insets.top + SPAZI.m} />}
      <AvvisoFineCompatibili
        visibile={avvisoVisibile}
        onContinua={continuaConCasuali}
        onCambiaPreferenze={cambiaPreferenze}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  messaggio: {
    alignItems: 'center',
    paddingHorizontal: SPAZI.xl,
    gap: SPAZI.l,
  },
  messaggioTesto: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  riprova: {
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 999,
    paddingVertical: SPAZI.s,
    paddingHorizontal: SPAZI.xl,
  },
  riprovaTesto: {
    color: '#fff',
    fontWeight: '700',
  },
});