import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, Plus, X } from 'lucide-react-native';
import Chip from '../components/Chip';
import { cercaGiochi } from '../api/games';
import { GENERI, PIATTAFORME } from '../data/opzioni';
import { useDebounce } from '../hooks/useDebounce';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../theme/ThemeContext';
import { RAGGI, SPAZI, type Palette } from '../theme/tema';
import { toggle } from '../utils/toggle';
import type { TabScreenProps } from '../navigation/types';
import type { Game } from '../types';

type Props = TabScreenProps<'Cerca'>;

export default function CercaScreen({ navigation }: Props) {
  const { colori } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);
  const { wishlist, aggiungi, rimuovi } = useWishlist();

  const [testo, setTesto] = useState('');
  const [generi, setGeneri] = useState<string[]>([]);
  const [piattaforme, setPiattaforme] = useState<string[]>([]);
  const [risultati, setRisultati] = useState<Game[]>([]);
  const [caricamento, setCaricamento] = useState(true);

  const testoDebounced = useDebounce(testo);

  useEffect(() => {
    let attivo = true;
    setCaricamento(true);
    cercaGiochi({ testo: testoDebounced, generi, piattaforme }).then(giochi => {
      if (attivo) {
        setRisultati(giochi);
        setCaricamento(false);
      }
    });
    return () => {
      attivo = false;
    };
  }, [testoDebounced, generi, piattaforme]);

  const idInWishlist = useMemo(() => new Set(wishlist.map(g => g.id)), [wishlist]);

  return (
    <View style={styles.container}>
      <View style={styles.intestazione}>
        <View style={styles.barraRicerca}>
          <TextInput
            placeholder="Cerca un gioco..."
            placeholderTextColor={colori.testoSecondario}
            value={testo}
            onChangeText={setTesto}
            autoCorrect={false}
            style={styles.input}
          />
          {testo !== '' && (
            <Pressable onPress={() => setTesto('')} hitSlop={10}>
              <X size={18} color={colori.testoSecondario} />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {GENERI.map(g => (
            <Chip
              key={g}
              label={g}
              selezionato={generi.includes(g)}
              onPress={() => setGeneri(prev => toggle(prev, g))}
            />
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {PIATTAFORME.map(p => (
            <Chip
              key={p}
              label={p}
              selezionato={piattaforme.includes(p)}
              onPress={() => setPiattaforme(prev => toggle(prev, p))}
            />
          ))}
        </ScrollView>
      </View>

      {caricamento ? (
        <ActivityIndicator style={styles.loader} size="large" color={colori.accento} />
      ) : (
        <FlatList
          data={risultati}
          keyExtractor={g => String(g.id)}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.vuoto}>Nessun gioco trovato.</Text>
          }
          renderItem={({ item }) => {
            const inWishlist = idInWishlist.has(item.id);
            return (
              <View style={styles.riga}>
                <Pressable
                  style={styles.rigaTappabile}
                  onPress={() => navigation.navigate('Dettaglio', { id: item.id })}
                >
                  <Image source={{ uri: item.immagine }} style={styles.miniatura} />
                  <View style={styles.info}>
                    <Text style={styles.nome}>{item.nome}</Text>
                    <Text style={styles.dettaglio}>{item.generi.join(' · ')}</Text>
                    <Text style={styles.dettaglio}>
                      ★ {item.voto.toFixed(1)} · {item.uscita}
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => (inWishlist ? rimuovi(item.id) : aggiungi(item))}
                  style={[styles.azione, inWishlist && styles.azioneAttiva]}
                >
                  {inWishlist ? (
                    <Check size={20} color={colori.testoSuAccento} />
                  ) : (
                    <Plus size={20} color={colori.testo} />
                  )}
                </Pressable>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

function creaStili(colori: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colori.sfondo,
    },
    intestazione: {
      paddingTop: SPAZI.m,
      paddingBottom: SPAZI.m,
      gap: SPAZI.m,
      borderBottomWidth: 1,
      borderBottomColor: colori.bordo,
    },
    barraRicerca: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: SPAZI.l,
      paddingHorizontal: 14,
      borderRadius: RAGGI.m,
      borderWidth: 1,
      borderColor: colori.bordo,
      backgroundColor: colori.superficie,
    },
    input: {
      flex: 1,
      paddingVertical: SPAZI.m,
      fontSize: 16,
      color: colori.testo,
    },
    chips: {
      paddingHorizontal: SPAZI.l,
      gap: SPAZI.s,
    },
    loader: {
      marginTop: 40,
    },
    lista: {
      padding: SPAZI.l,
      gap: SPAZI.m,
    },
    vuoto: {
      textAlign: 'center',
      color: colori.testoSecondario,
      marginTop: 30,
      fontSize: 16,
    },
    riga: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPAZI.m,
    },
    rigaTappabile: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPAZI.m,
    },
    miniatura: {
      width: 60,
      height: 80,
      borderRadius: RAGGI.s,
      backgroundColor: colori.superficieAlta,
    },
    info: {
      flex: 1,
    },
    nome: {
      fontSize: 16,
      fontWeight: '700',
      color: colori.testo,
    },
    dettaglio: {
      fontSize: 13,
      color: colori.testoSecondario,
      marginTop: 2,
    },
    azione: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colori.bordo,
      backgroundColor: colori.superficie,
      alignItems: 'center',
      justifyContent: 'center',
    },
    azioneAttiva: {
      backgroundColor: colori.accento,
      borderColor: colori.accento,
    },
  });
}