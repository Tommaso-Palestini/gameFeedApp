import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import { useTheme } from '../theme/ThemeContext';
import SlimeTabBar from '../components/SlimeTabBar';
import FeedScreen from '../screens/FeedScreen';
import CercaScreen from '../screens/CercaScreen';
import WishlistScreen from '../screens/WishlistScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const { colori } = useTheme();

  return (
    <Tab.Navigator
      tabBar={props => <SlimeTabBar {...props} />}
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'PressStart2P-Regular',
          fontSize: 16,
          color: colori.accento,
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Cerca" component={CercaScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}