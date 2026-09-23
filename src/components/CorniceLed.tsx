import React from 'react';
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { usePulsazione } from '../hooks/usePulsazione';
import { RAGGI } from '../theme/tema';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  acceso?: boolean;
  raggio?: number;
};

export default function CorniceLed({ children, style, acceso = false, raggio = RAGGI.m }: Props) {
  const { colori } = useTheme();
  const pulsazione = usePulsazione();

  const opacitaPulsante = pulsazione.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 1],
  });

  return (
    <View style={[{ borderRadius: raggio }, style]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bagliore,
          {
            borderRadius: raggio,
            borderColor: colori.accento,
            boxShadow: `0 0 10px 1px ${colori.accento}`,
            opacity: acceso ? 1 : opacitaPulsante,
          },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bagliore: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1.5,
  },
});