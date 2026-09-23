import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameCard from '../components/GameCard';
import SwipeHints from '../components/SwipeHints';
import { getFeed } from '../api/games';
import { usePreferenze } from '../context/PreferenzeContext';
import { useWishlist } from '../context/WishlistContext';
import { SPAZI } from '../theme/tema';
import type { TabScreenProps } from '../navigation/types';
import type { Game } from '../types';

type Props = TabScreenProps<'Feed'>;

export default function FeedScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { generi, piattaforme, modalita } = usePreferenze();
  const { wishlist, aggiungi } = useWishlist();

  const [giochi, setGiochi] = useState<Game[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [altezza, setAltezza] = useState(0);
  const [indiceCorrente, setIndiceCorrente] = useState(0);

  const entrata = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let attivo = true;
    setCaricamento(true);
    getFeed({ generi, piattaforme, modalita }).then(risultato => {
      if (attivo) {
        setGiochi(risultato);
        setCaricamento(false);
      }
    });
    return () => {
      attivo = false;
    };
  }, [generi, piattaforme, modalita]);

  const idInWishlist = useMemo(() => new Set(wishlist.map(g => g.id)), [wishlist]);

  const giochiVisibili = useMemo(
    () => giochi.filter(g => !idInWishlist.has(g.id)),
    [giochi, idInWishlist],
  );

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

  const mostraFeed = !caricamento && giochiVisibili.length > 0 && altezza > 0;

  return (
    <View
      style={styles.container}
      onLayout={e => setAltezza(e.nativeEvent.layout.height)}
    >
      {caricamento ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : giochiVisibili.length === 0 ? (
        <Text style={styles.vuoto}>Nessun gioco da mostrare per ora.</Text>
      ) : (
        altezza > 0 && (
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
            onMomentumScrollEnd={e =>
              setIndiceCorrente(Math.round(e.nativeEvent.contentOffset.y / altezza))
            }
            getItemLayout={(_, index) => ({
              length: altezza,
              offset: altezza * index,
              index,
            })}
          />
        )
      )}

      {mostraFeed && <SwipeHints top={insets.top + SPAZI.m} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  vuoto: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});