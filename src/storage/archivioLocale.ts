import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Preferenze } from '../types';

export const CHIAVI = {
  sessione: 'account.sessione',
  preferenze: 'dati.preferenze',
  wishlist: 'dati.wishlist',
} as const;

export const PREFERENZE_VUOTE: Preferenze = {
  generi: [],
  piattaforme: [],
  modalita: [],
};

export async function leggiJson<T>(chiave: string, predefinito: T): Promise<T> {
  try {
    const testo = await AsyncStorage.getItem(chiave);
    return testo === null ? predefinito : (JSON.parse(testo) as T);
  } catch {
    return predefinito;
  }
}

export async function scriviJson(chiave: string, valore: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(chiave, JSON.stringify(valore));
  } catch {
    // se il salvataggio fallisce i dati restano solo in memoria
  }
}

export async function rimuoviChiave(chiave: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(chiave);
  } catch {
    // niente da fare
  }
}