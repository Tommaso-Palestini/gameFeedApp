import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, Heart, Search, User } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

const ICONE = {
  Feed: Flame,
  Cerca: Search,
  Wishlist: Heart,
  Account: User,
} as const;

const ALTEZZA_BARRA = 64;
const DIMENSIONE_BLOB = 50;

export default function SlimeTabBar({ state, navigation }: BottomTabBarProps) {
  const { colori } = useTheme();
  const insets = useSafeAreaInsets();
  const [larghezza, setLarghezza] = useState(0);

  const posizione = useRef(new Animated.Value(state.index)).current;
  const allungamento = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(posizione, {
        toValue: state.index,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(allungamento, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(allungamento, {
          toValue: 0,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [state.index, posizione, allungamento]);

  const larghezzaTab = larghezza / state.routes.length;

  const translateX = Animated.add(
    Animated.multiply(posizione, larghezzaTab),
    (larghezzaTab - DIMENSIONE_BLOB) / 2,
  );
  const scaleX = allungamento.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.7],
  });
  const scaleY = allungamento.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.7],
  });

  return (
    <View
      style={[
        styles.barra,
        {
          backgroundColor: colori.superficie,
          borderTopColor: colori.bordo,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View
        style={styles.riga}
        onLayout={e => setLarghezza(e.nativeEvent.layout.width)}
      >
        {larghezza > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.blob,
              {
                backgroundColor: colori.accentoTenue,
                borderColor: colori.accento,
                boxShadow: `0 0 14px 2px ${colori.accento}`,
                transform: [{ translateX }, { scaleX }, { scaleY }],
              },
            ]}
          />
        )}

        {state.routes.map((route, index) => {
          const attivo = state.index === index;
          const Icona = ICONE[route.name as keyof typeof ICONE];

          const onPress = () => {
            const evento = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!attivo && !evento.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityLabel={route.name}
              accessibilityState={{ selected: attivo }}
            >
              <Icona
                size={24}
                color={attivo ? colori.accento : colori.testoSecondario}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  riga: {
    height: ALTEZZA_BARRA,
    flexDirection: 'row',
  },
  blob: {
    position: 'absolute',
    top: (ALTEZZA_BARRA - DIMENSIONE_BLOB) / 2,
    left: 0,
    width: DIMENSIONE_BLOB,
    height: DIMENSIONE_BLOB,
    borderRadius: DIMENSIONE_BLOB / 2,
    borderWidth: 1.5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});