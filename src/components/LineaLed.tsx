import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { usePulsazione } from '../hooks/usePulsazione';
import { SPAZI } from '../theme/tema';

export default function LineaLed() {
  const { colori } = useTheme();
  const pulsazione = usePulsazione();

  const opacity = pulsazione.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 1],
  });

  return (
    <Animated.View
      style={[
        styles.linea,
        {
          backgroundColor: colori.accento,
          boxShadow: `0 0 10px 1px ${colori.accento}`,
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  linea: {
    height: 2,
    borderRadius: 1,
    marginHorizontal: SPAZI.l,
  },
});