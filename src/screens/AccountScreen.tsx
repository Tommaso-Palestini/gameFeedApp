import React, { useMemo } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, ExternalLink, LogOut, SlidersHorizontal, User } from 'lucide-react-native';
import type { TabScreenProps } from '../navigation/types';
import { useAccount } from '../context/AccountContext';
import { usePreferenze } from '../context/PreferenzeContext';
import { useTheme, type ModalitaTema } from '../theme/ThemeContext';
import { RAGGI, SPAZI, type Palette } from '../theme/tema';

type Props = TabScreenProps<'Account'>;

const OPZIONI_TEMA: { valore: ModalitaTema; label: string }[] = [
  { valore: 'sistema', label: 'Sistema' },
  { valore: 'chiaro', label: 'Chiaro' },
  { valore: 'scuro', label: 'Scuro' },
];

const VERSIONE_APP = '1.0.0';

export default function AccountScreen({ navigation }: Props) {
  const { colori, modalitaTema, setModalitaTema } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);
  const { utente, esci } = useAccount();
  const { generi, piattaforme, modalita } = usePreferenze();

  const riepilogoPreferenze = `${generi.length} generi · ${piattaforme.length} piattaforme · ${modalita.length} modalità`;

  const confermaUscita = () => {
    Alert.alert(
      'Esci',
      'Vuoi uscire? Wishlist e preferenze restano salvate nel tuo account.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Esci',
          style: 'destructive',
          onPress: async () => {
            await esci();
            navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenuto}>
      <View style={styles.profilo}>
        <View style={styles.avatar}>
          {utente ? (
            <Text style={styles.iniziale}>{utente.nome.charAt(0).toUpperCase()}</Text>
          ) : (
            <User size={30} color={colori.accento} />
          )}
        </View>
        <View style={styles.profiloInfo}>
          <Text style={styles.nome} numberOfLines={1}>
            {utente ? utente.nome : 'Ospite'}
          </Text>
          <Text style={styles.sottotesto} numberOfLines={1}>
            {utente ? utente.email : 'Accedi per salvare la tua wishlist'}
          </Text>
        </View>
      </View>

      {!utente && (
        <Pressable style={styles.bottone} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.bottoneTesto}>Accedi o registrati</Text>
        </Pressable>
      )}

      <Text style={styles.sezione}>Gioco</Text>
      <View style={styles.gruppo}>
        <Pressable
          style={[styles.riga, styles.rigaUltima]}
          onPress={() => navigation.navigate('Onboarding', { modifica: true })}
        >
          <View style={styles.iconaRiga}>
            <SlidersHorizontal size={18} color={colori.accento} />
          </View>
          <View style={styles.rigaInfo}>
            <Text style={styles.rigaTesto}>Cambia preferenze</Text>
            <Text style={styles.rigaSottotesto}>{riepilogoPreferenze}</Text>
          </View>
          <ChevronRight size={20} color={colori.testoSecondario} />
        </Pressable>
      </View>

      <Text style={styles.sezione}>Aspetto</Text>
      <View style={styles.selettore}>
        {OPZIONI_TEMA.map(opzione => {
          const attivo = modalitaTema === opzione.valore;
          return (
            <Pressable
              key={opzione.valore}
              onPress={() => setModalitaTema(opzione.valore)}
              style={[styles.opzione, attivo && styles.opzioneAttiva]}
            >
              <Text style={[styles.opzioneTesto, attivo && styles.opzioneTestoAttivo]}>
                {opzione.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sezione}>Info</Text>
      <View style={styles.gruppo}>
        <Pressable
          style={styles.riga}
          onPress={() => Linking.openURL('https://www.igdb.com')}
        >
          <Text style={styles.rigaTesto}>Dati dei giochi forniti da IGDB</Text>
          <ExternalLink size={18} color={colori.testoSecondario} />
        </Pressable>
        <View style={[styles.riga, styles.rigaUltima]}>
          <Text style={styles.rigaTesto}>Versione</Text>
          <Text style={styles.rigaValore}>{VERSIONE_APP}</Text>
        </View>
      </View>

      {utente && (
        <Pressable style={styles.esci} onPress={confermaUscita}>
          <LogOut size={18} color={colori.pericolo} />
          <Text style={styles.esciTesto}>Esci</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function creaStili(colori: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colori.sfondo,
    },
    contenuto: {
      padding: SPAZI.l,
      paddingBottom: SPAZI.xxl,
    },
    profilo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPAZI.l,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 1.5,
      borderColor: colori.accento,
      backgroundColor: colori.accentoTenue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iniziale: {
      color: colori.accento,
      fontSize: 26,
      fontWeight: '800',
    },
    profiloInfo: {
      flex: 1,
    },
    nome: {
      fontSize: 22,
      fontWeight: '700',
      color: colori.testo,
    },
    sottotesto: {
      fontSize: 14,
      color: colori.testoSecondario,
      marginTop: 2,
    },
    bottone: {
      marginTop: SPAZI.l,
      backgroundColor: colori.accento,
      paddingVertical: 14,
      borderRadius: RAGGI.m,
      alignItems: 'center',
    },
    bottoneTesto: {
      color: colori.testoSuAccento,
      fontSize: 16,
      fontWeight: '700',
    },
    sezione: {
      marginTop: SPAZI.xl,
      marginBottom: SPAZI.s,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colori.testoSecondario,
    },
    selettore: {
      flexDirection: 'row',
      backgroundColor: colori.superficie,
      borderRadius: RAGGI.m,
      borderWidth: 1,
      borderColor: colori.bordo,
      padding: SPAZI.xs,
      gap: SPAZI.xs,
    },
    opzione: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: RAGGI.s,
      alignItems: 'center',
    },
    opzioneAttiva: {
      backgroundColor: colori.accentoTenue,
      borderWidth: 1,
      borderColor: colori.accento,
    },
    opzioneTesto: {
      color: colori.testoSecondario,
      fontWeight: '600',
    },
    opzioneTestoAttivo: {
      color: colori.accento,
    },
    gruppo: {
      backgroundColor: colori.superficie,
      borderRadius: RAGGI.m,
      borderWidth: 1,
      borderColor: colori.bordo,
    },
    riga: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SPAZI.m,
      paddingHorizontal: SPAZI.l,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colori.bordo,
    },
    rigaUltima: {
      borderBottomWidth: 0,
    },
    iconaRiga: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colori.accentoTenue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rigaInfo: {
      flex: 1,
    },
    rigaTesto: {
      color: colori.testo,
      fontSize: 15,
    },
    rigaSottotesto: {
      color: colori.testoSecondario,
      fontSize: 13,
      marginTop: 2,
    },
    rigaValore: {
      color: colori.testoSecondario,
      fontSize: 15,
    },
    esci: {
      marginTop: SPAZI.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPAZI.s,
      paddingVertical: 14,
      borderRadius: RAGGI.m,
      borderWidth: 1,
      borderColor: colori.pericolo,
    },
    esciTesto: {
      color: colori.pericolo,
      fontSize: 16,
      fontWeight: '700',
    },
  });
}