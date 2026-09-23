import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
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

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selezionato && styles.chipSelezionato]}
    >
      <Text style={[styles.testo, selezionato && styles.testoSelezionato]}>
        {label}
      </Text>
    </Pressable>
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
    testo: {
      color: colori.testo,
    },
    testoSelezionato: {
      color: colori.accento,
      fontWeight: '600',
    },
  });
}