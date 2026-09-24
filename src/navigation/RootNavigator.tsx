import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import DettaglioScreen from '../screens/DettaglioScreen';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  schermataIniziale: 'Onboarding' | 'Main';
};

export default function RootNavigator({ schermataIniziale }: Props) {
  const [iniziale] = useState(schermataIniziale);

  return (
    <Stack.Navigator initialRouteName={iniziale}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={({ route }) => ({
          headerShown: route.params?.modifica === true,
          title: 'Preferenze di gioco',
        })}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dettaglio"
        component={DettaglioScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}