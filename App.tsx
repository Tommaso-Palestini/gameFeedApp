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
import { AccountProvider, useAccount } from './src/context/AccountContext';
import { PreferenzeProvider, usePreferenze } from './src/context/PreferenzeContext';
import { WishlistProvider, useWishlist } from './src/context/WishlistContext';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function Navigazione() {
  const { colori, scuro } = useTheme();
  const { pronto } = useAccount();
  const { caricate, generi } = usePreferenze();
  const { caricata } = useWishlist();

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

  if (!pronto || !caricate || !caricata) {
    return null;
  }

  return (
    <NavigationContainer theme={temaNavigazione}>
      <StatusBar barStyle={scuro ? 'light-content' : 'dark-content'} />
      <RootNavigator schermataIniziale={generi.length > 0 ? 'Main' : 'Onboarding'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AccountProvider>
          <PreferenzeProvider>
            <WishlistProvider>
              <Navigazione />
            </WishlistProvider>
          </PreferenzeProvider>
        </AccountProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}