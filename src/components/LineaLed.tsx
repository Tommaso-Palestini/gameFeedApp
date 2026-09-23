import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SPAZI } from '../theme/tema';

export default function LineaLed() {
  const { colori } = useTheme();
  const pulsazione = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animazione = Animated.loop(
      Animated.sequence([
        Animated.timing(pulsazione, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulsazione, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animazione.start();
    return () => animazione.stop();
  }, [pulsazione]);

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