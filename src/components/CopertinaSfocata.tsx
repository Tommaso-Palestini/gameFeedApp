import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
  uri: string | null;
};

export default function CopertinaSfocata({ uri }: Props) {
  if (!uri) {
    return <View style={[StyleSheet.absoluteFill, styles.vuoto]} />;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        blurRadius={25}
      />
      <View style={styles.velo} />
      <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  vuoto: {
    backgroundColor: '#111',
  },
  velo: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});