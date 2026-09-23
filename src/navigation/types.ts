import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainTabParamList = {
  Feed: undefined;
  Cerca: undefined;
  Wishlist: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Onboarding: { modifica?: boolean } | undefined;
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Dettaglio: { id: number };
};

type TabProps<T extends keyof MainTabParamList> = BottomTabScreenProps<MainTabParamList, T>;
type StackProps = NativeStackScreenProps<RootStackParamList>;

export type TabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<TabProps<T>, StackProps>;