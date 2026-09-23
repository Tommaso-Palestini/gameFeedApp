import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { GENERI, PIATTAFORME } from '../data/opzioni';
import { usePreferenze } from '../context/PreferenzeContext';
import { useTheme } from '../theme/ThemeContext';
import { RAGGI, SPAZI, type Palette } from '../theme/tema';
import Chip from '../components/Chip';
import { toggle } from '../utils/toggle';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  const { colori } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);
  const { salvaPreferenze } = usePreferenze();

  const [generi, setGeneri] = useState<string[]>([]);
  const [piattaforme, setPiattaforme] = useState<string[]>([]);

  const puoContinuare = generi.length > 0 && piattaforme.length > 0;

  const handleInizia = () => {
    salvaPreferenze({ generi, piattaforme });
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contenuto}>
        <Text style={styles.titolo}>Cosa ti piace giocare?</Text>
        <Text style={styles.sottotitolo}>
          Scegli generi e piattaforme per personalizzare il feed.
        </Text>

        <Text style={styles.sezione}>Generi</Text>
        <View style={styles.chips}>
          {GENERI.map(g => (
            <Chip
              key={g}
              label={g}
              selezionato={generi.includes(g)}
              onPress={() => setGeneri(prev => toggle(prev, g))}
            />
          ))}
        </View>

        <Text style={styles.sezione}>Piattaforme</Text>
        <View style={styles.chips}>
          {PIATTAFORME.map(p => (
            <Chip
              key={p}
              label={p}
              selezionato={piattaforme.includes(p)}
              onPress={() => setPiattaforme(prev => toggle(prev, p))}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={!puoContinuare}
          onPress={handleInizia}
          style={[styles.bottone, !puoContinuare && styles.bottoneDisabilitato]}
        >
          <Text style={styles.bottoneTesto}>Inizia</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>
            Hai già un account? <Text style={styles.linkForte}>Accedi</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function creaStili(colori: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colori.sfondo,
    },
    contenuto: {
      padding: SPAZI.xl,
    },
    titolo: {
      fontSize: 28,
      fontWeight: '800',
      color: colori.testo,
    },
    sottotitolo: {
      fontSize: 15,
      color: colori.testoSecondario,
      marginTop: 6,
    },
    sezione: {
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colori.testoSecondario,
      marginTop: SPAZI.xl,
      marginBottom: SPAZI.m,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPAZI.s,
    },
    footer: {
      padding: SPAZI.xl,
      gap: 14,
    },
    bottone: {
      backgroundColor: colori.accento,
      paddingVertical: 14,
      borderRadius: RAGGI.m,
      alignItems: 'center',
    },
    bottoneDisabilitato: {
      opacity: 0.3,
    },
    bottoneTesto: {
      color: colori.testoSuAccento,
      fontSize: 16,
      fontWeight: '700',
    },
    link: {
      textAlign: 'center',
      color: colori.testoSecondario,
    },
    linkForte: {
      color: colori.accento,
      fontWeight: '700',
    },
  });
}