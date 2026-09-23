import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { ChevronsLeft, ChevronsRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { RAGGI, SPAZI } from '../theme/tema';

type Props = {
  top: number;
};

export default function SwipeHints({ top }: Props) {
  const { colori } = useTheme();
  const oscillazione = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animazione = Animated.loop(
      Animated.sequence([
        Animated.timing(oscillazione, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(oscillazione, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    animazione.start();
    return () => animazione.stop();
  }, [oscillazione]);

  const versoSinistra = oscillazione.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });
  const versoDestra = oscillazione.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5],
  });

  return (
    <View pointerEvents="none" style={[styles.contenitore, { top }]}>
      <View style={styles.pillola}>
        <Animated.View style={{ transform: [{ translateX: versoSinistra }] }}>
          <ChevronsLeft size={18} color="#fff" />
        </Animated.View>
        <Text style={styles.testo}>Info</Text>
      </View>

      <View style={[styles.pillola, { borderColor: colori.accento }]}>
        <Text style={[styles.testo, { color: colori.accento }]}>Wishlist</Text>
        <Animated.View style={{ transform: [{ translateX: versoDestra }] }}>
          <ChevronsRight size={18} color={colori.accento} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: {
    position: 'absolute',
    left: SPAZI.l,
    right: SPAZI.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pillola: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPAZI.xs,
    paddingVertical: 6,
    paddingHorizontal: SPAZI.m,
    borderRadius: RAGGI.pillola,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  testo: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});