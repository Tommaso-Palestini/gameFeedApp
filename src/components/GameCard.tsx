import React, { memo, useMemo, useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { formattaVotoEAnno } from '../utils/formato';
import CopertinaSfocata from './CopertinaSfocata';
import SfumaturaInBasso from './SfumaturaInBasso';
import type { Game } from '../types';

const SOGLIA_SWIPE = 120;

type Props = {
  gioco: Game;
  altezza: number;
  onSwipeRight: (gioco: Game) => void;
  onSwipeLeft: (gioco: Game) => void;
  entrata?: Animated.Value;
};

function GameCard({ gioco, altezza, onSwipeRight, onSwipeLeft, entrata }: Props) {
  const { colori } = useTheme();
  const { width } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useMemo(() => {
    const tornaAlCentro = () =>
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => {
        translateX.setValue(g.dx > 0 ? g.dx : g.dx * 0.5);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SOGLIA_SWIPE) {
          Animated.timing(translateX, {
            toValue: width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onSwipeRight(gioco));
        } else if (g.dx < -SOGLIA_SWIPE) {
          tornaAlCentro();
          onSwipeLeft(gioco);
        } else {
          tornaAlCentro();
        }
      },
      onPanResponderTerminate: tornaAlCentro,
    });
  }, [gioco, onSwipeRight, onSwipeLeft, translateX, width]);

  const stileEntrata = useMemo(() => {
    if (!entrata) {
      return null;
    }
    return {
      opacity: entrata,
      transform: [
        {
          translateY: entrata.interpolate({
            inputRange: [0, 1],
            outputRange: [80, 0],
          }),
        },
        {
          scale: entrata.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
          }),
        },
      ],
    };
  }, [entrata]);

  const opacitaWishlist = useMemo(
    () =>
      translateX.interpolate({
        inputRange: [0, SOGLIA_SWIPE],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    [translateX],
  );

  const opacitaInfo = useMemo(
    () =>
      translateX.interpolate({
        inputRange: [-SOGLIA_SWIPE / 2, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
    [translateX],
  );

  const votoEAnno = formattaVotoEAnno(gioco);

  return (
    <View style={[styles.contenitore, { height: altezza }]}>
      <Animated.View style={[styles.riempi, stileEntrata]}>
        <Animated.View
          style={[styles.card, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          <CopertinaSfocata uri={gioco.immagineGrande ?? gioco.immagine} />
          <SfumaturaInBasso altezza="55%" />

          <Animated.View
            style={[
              styles.badge,
              styles.badgeSinistra,
              { borderColor: colori.accento, opacity: opacitaWishlist },
            ]}
          >
            <Text style={[styles.badgeTesto, { color: colori.accento }]}>
              + Wishlist
            </Text>
          </Animated.View>

          <Animated.View
            style={[styles.badge, styles.badgeDestra, { opacity: opacitaInfo }]}
          >
            <Text style={styles.badgeTesto}>Info</Text>
          </Animated.View>

          <View style={styles.info}>
            {gioco.compatibilita !== undefined && (
              <View style={[styles.compatibilita, { borderColor: colori.accento }]}>
                <Text style={[styles.compatibilitaTesto, { color: colori.accento }]}>
                  {gioco.compatibilita}% compatibile
                </Text>
              </View>
            )}
            <Text style={[styles.nome, styles.ombra]}>{gioco.nome}</Text>
            {gioco.generi.length > 0 && (
              <Text style={[styles.dettaglio, styles.ombra]}>
                {gioco.generi.join(' · ')}
              </Text>
            )}
            {gioco.piattaforme.length > 0 && (
              <Text style={[styles.dettaglio, styles.ombra]} numberOfLines={2}>
                {gioco.piattaforme.join(' · ')}
              </Text>
            )}
            {votoEAnno !== '' && (
              <Text style={[styles.dettaglio, styles.ombra]}>{votoEAnno}</Text>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default memo(GameCard);

const styles = StyleSheet.create({
  contenitore: {
    width: '100%',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  riempi: {
    flex: 1,
  },
  card: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#111',
  },
  badge: {
    position: 'absolute',
    top: 140,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  badgeSinistra: {
    left: 20,
  },
  badgeDestra: {
    right: 20,
  },
  badgeTesto: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  info: {
    padding: 20,
    paddingBottom: 30,
    gap: 4,
  },
  compatibilita: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  compatibilitaTesto: {
    fontSize: 13,
    fontWeight: '800',
  },
  nome: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
  },
  dettaglio: {
    color: '#f0f0f0',
    fontSize: 15,
  },
  ombra: {
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});