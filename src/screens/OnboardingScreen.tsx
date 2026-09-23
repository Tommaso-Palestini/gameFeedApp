import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { GENERI, MODALITA, PIATTAFORME } from '../data/opzioni';
import { usePreferenze } from '../context/PreferenzeContext';
import { useTheme } from '../theme/ThemeContext';
import { RAGGI, SPAZI, type Palette } from '../theme/tema';
import Chip from '../components/Chip';
import { toggle } from '../utils/toggle';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

type GruppoChipProps = {
  titolo: string;
  nota?: string;
  opzioni: string[];
  selezionati: string[];
  onToggle: (valore: string) => void;
  styles: ReturnType<typeof creaStili>;
};

function GruppoChip({ titolo, nota, opzioni, selezionati, onToggle, styles }: GruppoChipProps) {
  return (
    <View>
      <View style={styles.intestazioneSezione}>
        <Text style={styles.sezione}>{titolo}</Text>
        {nota && <Text style={styles.nota}>{nota}</Text>}
        {selezionati.length > 0 && (
          <Text style={styles.contatore}>{selezionati.length}</Text>
        )}
      </View>
      <View style={styles.chips}>
        {opzioni.map(opzione => (
          <Chip
            key={opzione}
            label={opzione}
            selezionato={selezionati.includes(opzione)}
            onPress={() => onToggle(opzione)}
          />
        ))}
      </View>
    </View>
  );
}

export default function OnboardingScreen({ navigation, route }: Props) {
  const modifica = route.params?.modifica === true;

  const { colori } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);
  const preferenze = usePreferenze();

  const [generi, setGeneri] = useState<string[]>(modifica ? preferenze.generi : []);
  const [piattaforme, setPiattaforme] = useState<string[]>(
    modifica ? preferenze.piattaforme : [],
  );
  const [modalita, setModalita] = useState<string[]>(modifica ? preferenze.modalita : []);

  const puoContinuare = generi.length > 0 && piattaforme.length > 0;

  const handleConferma = () => {
    preferenze.salvaPreferenze({ generi, piattaforme, modalita });
    if (modifica) {
      navigation.goBack();
    } else {
      navigation.replace('Main');
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={modifica ? ['bottom'] : ['top', 'bottom']}
    >
      <ScrollView contentContainerStyle={styles.contenuto}>
        {!modifica && <Text style={styles.titolo}>Cosa ti piace giocare?</Text>}
        <Text style={styles.sottotitolo}>
          {modifica
            ? 'Aggiorna le tue scelte: il feed si adatta subito.'
            : 'Scegli generi e piattaforme per personalizzare il feed.'}
        </Text>

        <GruppoChip
          titolo="Generi"
          opzioni={GENERI}
          selezionati={generi}
          onToggle={v => setGeneri(prev => toggle(prev, v))}
          styles={styles}
        />

        <GruppoChip
          titolo="Piattaforme"
          opzioni={PIATTAFORME}
          selezionati={piattaforme}
          onToggle={v => setPiattaforme(prev => toggle(prev, v))}
          styles={styles}
        />

        <GruppoChip
          titolo="Modalità"
          nota="facoltativo"
          opzioni={MODALITA}
          selezionati={modalita}
          onToggle={v => setModalita(prev => toggle(prev, v))}
          styles={styles}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={!puoContinuare}
          onPress={handleConferma}
          style={[styles.bottone, !puoContinuare && styles.bottoneDisabilitato]}
        >
          <Text style={styles.bottoneTesto}>{modifica ? 'Salva' : 'Inizia'}</Text>
        </Pressable>

        {!modifica && (
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>
              Hai già un account? <Text style={styles.linkForte}>Accedi</Text>
            </Text>
          </Pressable>
        )}
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
      gap: SPAZI.xl,
    },
    titolo: {
      fontSize: 28,
      fontWeight: '800',
      color: colori.testo,
    },
    sottotitolo: {
      fontSize: 15,
      color: colori.testoSecondario,
      marginTop: -SPAZI.m,
    },
    intestazioneSezione: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPAZI.s,
      marginBottom: SPAZI.m,
    },
    sezione: {
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colori.testoSecondario,
    },
    nota: {
      fontSize: 12,
      color: colori.testoSecondario,
      fontStyle: 'italic',
    },
    contatore: {
      marginLeft: 'auto',
      minWidth: 24,
      paddingHorizontal: SPAZI.s,
      paddingVertical: 2,
      borderRadius: RAGGI.pillola,
      backgroundColor: colori.accentoTenue,
      color: colori.accento,
      fontSize: 12,
      fontWeight: '700',
      textAlign: 'center',
      overflow: 'hidden',
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