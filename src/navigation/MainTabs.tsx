import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import SlimeTabBar from '../components/SlimeTabBar';
import FeedScreen from '../screens/FeedScreen';
import CercaScreen from '../screens/CercaScreen';
import WishlistScreen from '../screens/WishlistScreen';
import AccountScreen from '../screens/AccountScreen.tsx';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator tabBar={props => <SlimeTabBar {...props} />}>
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