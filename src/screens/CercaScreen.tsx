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
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { X } from 'lucide-react-native';
import Chip from '../components/Chip';
import LineaLed from '../components/LineaLed';
import BottoneWishlist from '../components/BottoneWishlist';
import { cercaGiochi } from '../api/games';
import { GENERI, MODALITA, PIATTAFORME } from '../data/opzioni';
import { useDebounce } from '../hooks/useDebounce';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../theme/ThemeContext';
import { RAGGI, SPAZI, type Palette } from '../theme/tema';
import { toggle } from '../utils/toggle';
import type { TabScreenProps } from '../navigation/types';
import type { Game } from '../types';

type Props = TabScreenProps<'Cerca'>;

function leggiAnno(valore: string): number | null {
  return /^\d{4}$/.test(valore) ? Number(valore) : null;
}

type RigaChipProps = {
  opzioni: string[];
  selezionati: string[];
  onToggle: (valore: string) => void;
  stile: StyleProp<ViewStyle>;
};

function RigaChip({ opzioni, selezionati, onToggle, stile }: RigaChipProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={stile}
    >
      {opzioni.map(opzione => (
        <Chip
          key={opzione}
          label={opzione}
          selezionato={selezionati.includes(opzione)}
          onPress={() => onToggle(opzione)}
        />
      ))}
    </ScrollView>
  );
}

export default function CercaScreen({ navigation }: Props) {
  const { colori } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);
  const { wishlist, aggiungi, rimuovi } = useWishlist();

  const [testo, setTesto] = useState('');
  const [piattaforme, setPiattaforme] = useState<string[]>([]);
  const [generi, setGeneri] = useState<string[]>([]);
  const [modalita, setModalita] = useState<string[]>([]);
  const [annoDa, setAnnoDa] = useState('');
  const [annoA, setAnnoA] = useState('');
  const [risultati, setRisultati] = useState<Game[]>([]);
  const [caricamento, setCaricamento] = useState(true);

  const testoDebounced = useDebounce(testo);
  const annoDaDebounced = useDebounce(annoDa);
  const annoADebounced = useDebounce(annoA);

  useEffect(() => {
    let attivo = true;
    setCaricamento(true);
    cercaGiochi({
      testo: testoDebounced,
      generi,
      piattaforme,
      modalita,
      annoDa: leggiAnno(annoDaDebounced),
      annoA: leggiAnno(annoADebounced),
    }).then(giochi => {
      if (attivo) {
        setRisultati(giochi);
        setCaricamento(false);
      }
    });
    return () => {
      attivo = false;
    };
  }, [testoDebounced, generi, piattaforme, modalita, annoDaDebounced, annoADebounced]);

  const idInWishlist = useMemo(() => new Set(wishlist.map(g => g.id)), [wishlist]);

  const filtriAttivi =
    piattaforme.length > 0 ||
    generi.length > 0 ||
    modalita.length > 0 ||
    annoDa !== '' ||
    annoA !== '';

  const azzeraFiltri = () => {
    setPiattaforme([]);
    setGeneri([]);
    setModalita([]);
    setAnnoDa('');
    setAnnoA('');
  };

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

        <RigaChip
          opzioni={PIATTAFORME}
          selezionati={piattaforme}
          onToggle={v => setPiattaforme(prev => toggle(prev, v))}
          stile={styles.chips}
        />

        <LineaLed />

        <RigaChip
          opzioni={GENERI}
          selezionati={generi}
          onToggle={v => setGeneri(prev => toggle(prev, v))}
          stile={styles.chips}
        />

        <RigaChip
          opzioni={MODALITA}
          selezionati={modalita}
          onToggle={v => setModalita(prev => toggle(prev, v))}
          stile={styles.chips}
        />

        <View style={styles.rigaAnno}>
          <Text style={styles.etichetta}>Anno</Text>
          <TextInput
            value={annoDa}
            onChangeText={t => setAnnoDa(t.replace(/\D/g, ''))}
            placeholder="dal"
            placeholderTextColor={colori.testoSecondario}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.inputAnno}
          />
          <Text style={styles.trattino}>–</Text>
          <TextInput
            value={annoA}
            onChangeText={t => setAnnoA(t.replace(/\D/g, ''))}
            placeholder="al"
            placeholderTextColor={colori.testoSecondario}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.inputAnno}
          />
          {filtriAttivi && (
            <Pressable onPress={azzeraFiltri} style={styles.azzera} hitSlop={8}>
              <Text style={styles.azzeraTesto}>Azzera filtri</Text>
            </Pressable>
          )}
        </View>
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
          renderItem={({ item }) => (
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
              <BottoneWishlist
                attivo={idInWishlist.has(item.id)}
                onAggiungi={() => aggiungi(item)}
                onRimuovi={() => rimuovi(item.id)}
              />
            </View>
          )}
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
    rigaAnno: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPAZI.s,
      paddingHorizontal: SPAZI.l,
    },
    etichetta: {
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colori.testoSecondario,
      marginRight: SPAZI.xs,
    },
    inputAnno: {
      width: 70,
      paddingVertical: 6,
      paddingHorizontal: SPAZI.s,
      borderRadius: RAGGI.s,
      borderWidth: 1,
      borderColor: colori.bordo,
      backgroundColor: colori.superficie,
      color: colori.testo,
      fontSize: 15,
      textAlign: 'center',
    },
    trattino: {
      color: colori.testoSecondario,
      fontSize: 16,
    },
    azzera: {
      marginLeft: 'auto',
    },
    azzeraTesto: {
      color: colori.accento,
      fontWeight: '700',
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
  });
}