import React from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type Props = {
  altezza: DimensionValue;
};

export default function SfumaturaInBasso({ altezza }: Props) {
  return (
    <View pointerEvents="none" style={[styles.contenitore, { height: altezza }]}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id="sfumatura" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000" stopOpacity="0" />
            <Stop offset="0.45" stopColor="#000" stopOpacity="0.55" />
            <Stop offset="1" stopColor="#000" stopOpacity="0.92" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#sfumatura)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});