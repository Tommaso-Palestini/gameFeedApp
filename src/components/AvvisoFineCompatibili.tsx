import React, { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Shuffle } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { RAGGI, SPAZI, type Palette } from '../theme/tema';

type Props = {
  visibile: boolean;
  onContinua: () => void;
  onCambiaPreferenze: () => void;
};

export default function AvvisoFineCompatibili({ visibile, onContinua, onCambiaPreferenze }: Props) {
  const { colori } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);

  return (
    <Modal visible={visibile} transparent animationType="fade" onRequestClose={onContinua}>
      <View style={styles.sfondo}>
        <View style={styles.finestra}>
          <View style={styles.icona}>
            <Shuffle size={26} color={colori.accento} />
          </View>
          <Text style={styles.titolo}>Hai visto tutti i giochi compatibili</Text>
          <Text style={styles.testo}>
            Da qui in poi ti mostro giochi a caso sulle tue piattaforme. Se vuoi scoprirne altri
            simili ai tuoi gusti, prova ad aggiungere generi o modalità alle tue preferenze.
          </Text>

          <Pressable style={styles.bottone} onPress={onContinua}>
            <Text style={styles.bottoneTesto}>Continua con giochi a caso</Text>
          </Pressable>
          <Pressable style={styles.secondario} onPress={onCambiaPreferenze}>
            <Text style={styles.secondarioTesto}>Cambia preferenze</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function creaStili(colori: Palette) {
  return StyleSheet.create({
    sfondo: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPAZI.xl,
    },
    finestra: {
      width: '100%',
      maxWidth: 380,
      backgroundColor: colori.superficie,
      borderRadius: RAGGI.l,
      borderWidth: 1.5,
      borderColor: colori.accento,
      boxShadow: `0 0 24px 0px ${colori.accento}`,
      padding: SPAZI.xl,
      alignItems: 'center',
      gap: SPAZI.m,
    },
    icona: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colori.accentoTenue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titolo: {
      fontSize: 20,
      fontWeight: '800',
      color: colori.testo,
      textAlign: 'center',
    },
    testo: {
      fontSize: 15,
      lineHeight: 21,
      color: colori.testoSecondario,
      textAlign: 'center',
    },
    bottone: {
      alignSelf: 'stretch',
      marginTop: SPAZI.s,
      backgroundColor: colori.accento,
      paddingVertical: 14,
      borderRadius: RAGGI.m,
      alignItems: 'center',
    },
    bottoneTesto: {
      color: colori.testoSuAccento,
      fontSize: 16,
      fontWeight: '800',
    },
    secondario: {
      alignSelf: 'stretch',
      paddingVertical: 12,
      borderRadius: RAGGI.m,
      borderWidth: 1,
      borderColor: colori.bordo,
      alignItems: 'center',
    },
    secondarioTesto: {
      color: colori.testo,
      fontSize: 15,
      fontWeight: '600',
    },
  });
}