import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronLeft, Heart } from 'lucide-react-native';
import type { RootStackParamList } from '../navigation/types';
import { getGioco } from '../api/games';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../theme/ThemeContext';
import { RAGGI, SPAZI, type Palette } from '../theme/tema';
import type { Game } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Dettaglio'>;

const ALTEZZA_HERO = 440;

export default function DettaglioScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { colori } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);
  const insets = useSafeAreaInsets();
  const { wishlist, aggiungi, rimuovi } = useWishlist();

  const [gioco, setGioco] = useState<Game | null>(null);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    let attivo = true;
    setCaricamento(true);
    getGioco(id).then(risultato => {
      if (attivo) {
        setGioco(risultato);
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
      </View>
    );
  }

  if (!gioco) {
    return (
      <View style={styles.centro}>
        <Text style={styles.testoSecondario}>Gioco non trovato.</Text>
        {bottoneIndietro}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image
            source={{ uri: gioco.immagine }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <View style={styles.oscuramento} />
          <View style={styles.heroInfo}>
            <Text style={styles.nome}>{gioco.nome}</Text>
            <Text style={styles.heroDettaglio}>
              ★ {gioco.voto.toFixed(1)} · {gioco.uscita}
            </Text>
          </View>
        </View>

        <View style={styles.corpo}>
          <Sezione titolo="Generi" valori={gioco.generi} styles={styles} />
          <Sezione titolo="Piattaforme" valori={gioco.piattaforme} styles={styles} />
          <Sezione titolo="Modalità" valori={gioco.modalita} styles={styles} />
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
      backgroundColor: colori.sfondo,
    },
    testoSecondario: {
      color: colori.testoSecondario,
      fontSize: 16,
    },
    hero: {
      height: ALTEZZA_HERO,
      justifyContent: 'flex-end',
      backgroundColor: colori.superficieAlta,
    },
    oscuramento: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    heroInfo: {
      padding: SPAZI.xl,
      gap: SPAZI.xs,
    },
    nome: {
      color: '#fff',
      fontSize: 32,
      fontWeight: '800',
    },
    heroDettaglio: {
      color: '#eee',
      fontSize: 16,
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