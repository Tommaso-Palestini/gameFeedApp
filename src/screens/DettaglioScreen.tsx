import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronLeft, ExternalLink, Heart } from 'lucide-react-native';
import type { RootStackParamList } from '../navigation/types';
import { getGioco } from '../api/games';
import { ErroreApi } from '../api/client';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../theme/ThemeContext';
import { RAGGI, SPAZI, type Palette } from '../theme/tema';
import { formattaVotoEAnno } from '../utils/formato';
import CopertinaSfocata from '../components/CopertinaSfocata';
import SfumaturaInBasso from '../components/SfumaturaInBasso';
import type { DettaglioGioco } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Dettaglio'>;

const ALTEZZA_HERO = 480;

export default function DettaglioScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { colori } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);
  const insets = useSafeAreaInsets();
  const { wishlist, aggiungi, rimuovi } = useWishlist();

  const [gioco, setGioco] = useState<DettaglioGioco | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    let attivo = true;
    setCaricamento(true);
    setErrore(null);
    getGioco(id)
      .then(risultato => {
        if (attivo) {
          setGioco(risultato);
        }
      })
      .catch(e => {
        if (attivo) {
          setErrore(
            e instanceof ErroreApi && e.stato === 404
              ? 'Gioco non trovato.'
              : 'Impossibile caricare il gioco. Controlla che il backend sia acceso.',
          );
        }
      })
      .finally(() => {
        if (attivo) {
          setCaricamento(false);
        }
      });
    return () => {
      attivo = false;
    };
  }, [id]);

  const inWishlist = wishlist.some(g => g.id === id);

  const bottoneIndietro = (
    <Pressable
      onPress={() => navigation.goBack()}
      style={[styles.indietro, { top: insets.top + SPAZI.s }]}
      hitSlop={10}
    >
      <ChevronLeft size={26} color="#fff" />
    </Pressable>
  );

  if (caricamento) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colori.accento} />
        {bottoneIndietro}
      </View>
    );
  }

  if (errore || !gioco) {
    return (
      <View style={styles.centro}>
        <Text style={styles.testoSecondario}>{errore ?? 'Gioco non trovato.'}</Text>
        {bottoneIndietro}
      </View>
    );
  }

  const votoEAnno = formattaVotoEAnno(gioco);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <CopertinaSfocata uri={gioco.immagineGrande ?? gioco.immagine} />
          <SfumaturaInBasso altezza="60%" />
          <View style={styles.heroInfo}>
            <Text style={[styles.nome, styles.ombra]}>{gioco.nome}</Text>
            <View style={styles.rigaHero}>
              {votoEAnno !== '' && (
                <Text style={[styles.heroDettaglio, styles.ombra]}>{votoEAnno}</Text>
              )}
              {gioco.votoCritica !== null && (
                <View style={styles.critica}>
                  <Text style={styles.criticaTesto}>Critica {gioco.votoCritica}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.corpo}>
          {gioco.descrizione !== '' && (
            <View>
              <Text style={styles.sezioneTitolo}>Descrizione</Text>
              <Text style={styles.descrizione}>{gioco.descrizione}</Text>
            </View>
          )}
          <Sezione titolo="Sviluppatori" valori={gioco.sviluppatori} styles={styles} />
          <Sezione titolo="Generi" valori={gioco.generi} styles={styles} />
          <Sezione titolo="Piattaforme" valori={gioco.piattaforme} styles={styles} />
          <Sezione titolo="Modalità" valori={gioco.modalita} styles={styles} />

          {gioco.paginaIgdb && (
            <Pressable
              style={styles.link}
              onPress={() => {
                if (gioco.paginaIgdb) {
                  Linking.openURL(gioco.paginaIgdb);
                }
              }}
            >
              <Text style={styles.linkTesto}>Vedi su IGDB</Text>
              <ExternalLink size={16} color={colori.accento} />
            </Pressable>
          )}
        </View>
      </ScrollView>

      {bottoneIndietro}

      <View style={[styles.footer, { paddingBottom: insets.bottom + SPAZI.l }]}>
        <Pressable
          onPress={() => (inWishlist ? rimuovi(gioco.id) : aggiungi(gioco))}
          style={[styles.bottone, inWishlist && styles.bottoneAttivo]}
        >
          {inWishlist ? (
            <Check size={20} color={colori.accento} />
          ) : (
            <Heart size={20} color={colori.testoSuAccento} />
          )}
          <Text style={[styles.bottoneTesto, inWishlist && styles.bottoneTestoAttivo]}>
            {inWishlist ? 'Nella wishlist' : 'Aggiungi alla wishlist'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type SezioneProps = {
  titolo: string;
  valori: string[];
  styles: ReturnType<typeof creaStili>;
};

function Sezione({ titolo, valori, styles }: SezioneProps) {
  if (valori.length === 0) {
    return null;
  }
  return (
    <View>
      <Text style={styles.sezioneTitolo}>{titolo}</Text>
      <View style={styles.etichette}>
        {valori.map(valore => (
          <View key={valore} style={styles.etichetta}>
            <Text style={styles.etichettaTesto}>{valore}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function creaStili(colori: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colori.sfondo,
    },
    centro: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: SPAZI.xl,
      backgroundColor: colori.sfondo,
    },
    testoSecondario: {
      color: colori.testoSecondario,
      fontSize: 16,
      textAlign: 'center',
    },
    hero: {
      height: ALTEZZA_HERO,
      justifyContent: 'flex-end',
      backgroundColor: '#111',
      overflow: 'hidden',
    },
    heroInfo: {
      padding: SPAZI.xl,
      gap: SPAZI.s,
    },
    nome: {
      color: '#fff',
      fontSize: 32,
      fontWeight: '800',
    },
    ombra: {
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 6,
    },
    rigaHero: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPAZI.m,
    },
    heroDettaglio: {
      color: '#f0f0f0',
      fontSize: 16,
    },
    critica: {
      borderWidth: 1.5,
      borderColor: colori.accento,
      borderRadius: RAGGI.pillola,
      paddingVertical: 3,
      paddingHorizontal: SPAZI.s,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    criticaTesto: {
      color: colori.accento,
      fontSize: 13,
      fontWeight: '800',
    },
    indietro: {
      position: 'absolute',
      left: SPAZI.l,
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    corpo: {
      padding: SPAZI.xl,
      gap: SPAZI.xl,
    },
    sezioneTitolo: {
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colori.testoSecondario,
      marginBottom: SPAZI.s,
    },
    descrizione: {
      color: colori.testo,
      fontSize: 15,
      lineHeight: 22,
    },
    etichette: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPAZI.s,
    },
    etichetta: {
      paddingVertical: 6,
      paddingHorizontal: SPAZI.m,
      borderRadius: RAGGI.pillola,
      backgroundColor: colori.superficie,
      borderWidth: 1,
      borderColor: colori.bordo,
    },
    etichettaTesto: {
      color: colori.testo,
      fontSize: 14,
    },
    link: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPAZI.s,
    },
    linkTesto: {
      color: colori.accento,
      fontSize: 15,
      fontWeight: '700',
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: SPAZI.xl,
      paddingTop: SPAZI.l,
      backgroundColor: colori.sfondo,
      borderTopWidth: 1,
      borderTopColor: colori.bordo,
    },
    bottone: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPAZI.s,
      paddingVertical: 14,
      borderRadius: RAGGI.m,
      backgroundColor: colori.accento,
      borderWidth: 1.5,
      borderColor: colori.accento,
    },
    bottoneAttivo: {
      backgroundColor: colori.accentoTenue,
    },
    bottoneTesto: {
      color: colori.testoSuAccento,
      fontSize: 16,
      fontWeight: '700',
    },
    bottoneTestoAttivo: {
      color: colori.accento,
    },
  });
}