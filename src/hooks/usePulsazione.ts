import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function usePulsazione(durata = 1200): Animated.Value {
  const valore = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animazione = Animated.loop(
      Animated.sequence([
        Animated.timing(valore, {
          toValue: 1,
          duration: durata,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(valore, {
          toValue: 0,
          duration: durata,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animazione.start();
    return () => animazione.stop();
  }, [valore, durata]);

  return valore;
}