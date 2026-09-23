import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RAGGI, type Palette } from '../theme/tema';

type Props = {
  label: string;
  selezionato: boolean;
  onPress: () => void;
};

export default function Chip({ label, selezionato, onPress }: Props) {
  const { colori } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);

  const scala = useRef(new Animated.Value(1)).current;
  const luce = useRef(new Animated.Value(selezionato ? 1 : 0)).current;
  const primoRender = useRef(true);

  useEffect(() => {
    if (primoRender.current) {
      primoRender.current = false;
      return;
    }

    Animated.timing(luce, {
      toValue: selezionato ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();

    if (selezionato) {
      Animated.sequence([
        Animated.timing(scala, {
          toValue: 0.85,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(scala, {
          toValue: 1,
          friction: 3,
          tension: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(scala, {
          toValue: 0.92,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.spring(scala, {
          toValue: 1,
          friction: 6,
          tension: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selezionato, luce, scala]);

  return (
    <Animated.View style={{ transform: [{ scale: scala }] }}>
      <Pressable
        onPress={onPress}
        style={[styles.chip, selezionato && styles.chipSelezionato]}
      >
        <Animated.View pointerEvents="none" style={[styles.luce, { opacity: luce }]} />
        <Text style={[styles.testo, selezionato && styles.testoSelezionato]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function creaStili(colori: Palette) {
  return StyleSheet.create({
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: RAGGI.pillola,
      borderWidth: 1,
      borderColor: colori.bordo,
      backgroundColor: colori.superficie,
    },
    chipSelezionato: {
      backgroundColor: colori.accentoTenue,
      borderColor: colori.accento,
    },
    luce: {
      ...StyleSheet.absoluteFill,
      borderRadius: RAGGI.pillola,
      borderWidth: 1,
      borderColor: colori.accento,
      boxShadow: `0 0 8px 0px ${colori.accento}`,
    },
    testo: {
      color: colori.testo,
    },
    testoSelezionato: {
      color: colori.accento,
      fontWeight: '600',
    },
  });
}