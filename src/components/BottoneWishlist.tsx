import React, { useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import type { Palette } from '../theme/tema';

const DIMENSIONE = 40;
const NUMERO_PARTICELLE = 10;
const RAGGIO_ESPLOSIONE = 36;
const DIMENSIONE_PARTICELLA = 6;
const PASSI_SCOSSA = [-1, 1, -1, 1, -0.5, 0.5, 0];

type Props = {
  attivo: boolean;
  onAggiungi: () => void;
  onRimuovi: () => void;
};

export default function BottoneWishlist({ attivo, onAggiungi, onRimuovi }: Props) {
  const { colori } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);

  const scala = useRef(new Animated.Value(1)).current;
  const esplosione = useRef(new Animated.Value(0)).current;
  const scossa = useRef(new Animated.Value(0)).current;
  const lampoRosso = useRef(new Animated.Value(0)).current;
  const [esplosioneVisibile, setEsplosioneVisibile] = useState(false);

  const particelle = useMemo(
    () =>
      Array.from({ length: NUMERO_PARTICELLE }, (_, i) => {
        const angolo = (2 * Math.PI * i) / NUMERO_PARTICELLE;
        return {
          dx: Math.cos(angolo) * RAGGIO_ESPLOSIONE,
          dy: Math.sin(angolo) * RAGGIO_ESPLOSIONE,
        };
      }),
    [],
  );

  const esplodi = () => {
    setEsplosioneVisibile(true);
    esplosione.setValue(0);
    scala.setValue(0.75);
    Animated.parallel([
      Animated.spring(scala, {
        toValue: 1,
        friction: 3,
        tension: 160,
        useNativeDriver: true,
      }),
      Animated.timing(esplosione, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => setEsplosioneVisibile(false));
  };

  const scuoti = () => {
    scossa.setValue(0);
    lampoRosso.setValue(1);
    Animated.parallel([
      Animated.sequence(
        PASSI_SCOSSA.map(valore =>
          Animated.timing(scossa, {
            toValue: valore,
            duration: 45,
            useNativeDriver: true,
          }),
        ),
      ),
      Animated.timing(lampoRosso, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (attivo) {
      scuoti();
      onRimuovi();
    } else {
      esplodi();
      onAggiungi();
    }
  };

  const translateX = scossa.interpolate({
    inputRange: [-1, 1],
    outputRange: [-8, 8],
  });

  const opacitaParticelle = esplosione.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0, 1, 0],
  });

  const scalaParticelle = esplosione.interpolate({
    inputRange: [0, 1],
    outputRange: [1.3, 0.2],
  });

  const scalaAnello = esplosione.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });

  const opacitaAnello = esplosione.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 0],
  });

  return (
    <View style={styles.contenitore}>
      {esplosioneVisibile && (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.anello,
              { opacity: opacitaAnello, transform: [{ scale: scalaAnello }] },
            ]}
          />
          {particelle.map((p, i) => (
            <Animated.View
              key={i}
              pointerEvents="none"
              style={[
                styles.particella,
                {
                  opacity: opacitaParticelle,
                  transform: [
                    {
                      translateX: esplosione.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, p.dx],
                      }),
                    },
                    {
                      translateY: esplosione.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, p.dy],
                      }),
                    },
                    { scale: scalaParticelle },
                  ],
                },
              ]}
            />
          ))}
        </>
      )}

      <Animated.View style={{ transform: [{ translateX }, { scale: scala }] }}>
        <Pressable
          onPress={handlePress}
          style={[styles.bottone, attivo && styles.bottoneAttivo]}
          hitSlop={6}
        >
          <Animated.View
            pointerEvents="none"
            style={[styles.lampo, { opacity: lampoRosso }]}
          />
          {attivo ? (
            <Check size={20} color={colori.testoSuAccento} />
          ) : (
            <Plus size={20} color={colori.testo} />
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

function creaStili(colori: Palette) {
  const centro = DIMENSIONE / 2 - DIMENSIONE_PARTICELLA / 2;

  return StyleSheet.create({
    contenitore: {
      width: DIMENSIONE,
      height: DIMENSIONE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottone: {
      width: DIMENSIONE,
      height: DIMENSIONE,
      borderRadius: DIMENSIONE / 2,
      borderWidth: 1,
      borderColor: colori.bordo,
      backgroundColor: colori.superficie,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    bottoneAttivo: {
      backgroundColor: colori.accento,
      borderColor: colori.accento,
      boxShadow: `0 0 12px 1px ${colori.accento}`,
    },
    lampo: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colori.pericolo,
    },
    anello: {
      position: 'absolute',
      width: DIMENSIONE,
      height: DIMENSIONE,
      borderRadius: DIMENSIONE / 2,
      borderWidth: 2,
      borderColor: colori.accento,
    },
    particella: {
      position: 'absolute',
      top: centro,
      left: centro,
      width: DIMENSIONE_PARTICELLA,
      height: DIMENSIONE_PARTICELLA,
      borderRadius: DIMENSIONE_PARTICELLA / 2,
      backgroundColor: colori.accento,
      boxShadow: `0 0 6px 1px ${colori.accento}`,
    },
  });
}