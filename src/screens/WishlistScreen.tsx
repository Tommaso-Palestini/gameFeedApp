import React, { useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../theme/ThemeContext';
import { RAGGI, SPAZI, type Palette } from '../theme/tema';
import type { TabScreenProps } from '../navigation/types';

type Props = TabScreenProps<'Wishlist'>;

export default function WishlistScreen({ navigation }: Props) {
  const { colori } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);
  const { wishlist, rimuovi } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <View style={styles.vuotoContainer}>
        <Text style={styles.vuotoTesto}>
          La wishlist è vuota. Swipa a destra un gioco nel feed per aggiungerlo.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={wishlist}
      keyExtractor={g => String(g.id)}
      contentContainerStyle={styles.lista}
      renderItem={({ item }) => (
        <View style={styles.riga}>
          <Pressable
            style={styles.rigaTappabile}
            onPress={() => navigation.navigate('Dettaglio', { id: item.id })}
          >
            {item.immagine ? (
              <Image source={{ uri: item.immagine }} style={styles.miniatura} />
            ) : (
              <View style={styles.miniatura} />
            )}
            <View style={styles.info}>
              <Text style={styles.nome} numberOfLines={2}>
                {item.nome}
              </Text>
              {item.generi.length > 0 && (
                <Text style={styles.dettaglio} numberOfLines={1}>
                  {item.generi.join(' · ')}
                </Text>
              )}
            </View>
          </Pressable>
          <Pressable onPress={() => rimuovi(item.id)} style={styles.rimuovi}>
            <Text style={styles.rimuoviTesto}>Rimuovi</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

function creaStili(colori: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colori.sfondo,
    },
    vuotoContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 30,
      backgroundColor: colori.sfondo,
    },
    vuotoTesto: {
      textAlign: 'center',
      color: colori.testoSecondario,
      fontSize: 16,
    },
    lista: {
      padding: SPAZI.l,
      gap: SPAZI.m,
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
    rimuovi: {
      paddingVertical: SPAZI.s,
      paddingHorizontal: SPAZI.m,
      borderRadius: RAGGI.s,
      borderWidth: 1,
      borderColor: colori.pericolo,
    },
    rimuoviTesto: {
      color: colori.pericolo,
      fontWeight: '600',
    },
  });
}