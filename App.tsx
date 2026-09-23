import React, { useMemo } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { PreferenzeProvider } from './src/context/PreferenzeContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function Navigazione() {
  const { colori, scuro } = useTheme();

  const temaNavigazione: Theme = useMemo(() => {
    const base = scuro ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colori.accento,
        background: colori.sfondo,
        card: colori.superficie,
        text: colori.testo,
        border: colori.bordo,
        notification: colori.accento,
      },
    };
  }, [colori, scuro]);

  return (
    <NavigationContainer theme={temaNavigazione}>
      <StatusBar barStyle={scuro ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PreferenzeProvider>
          <WishlistProvider>
            <Navigazione />
          </WishlistProvider>
        </PreferenzeProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}