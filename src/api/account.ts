import { richiesta } from './client';
import type { Game, Preferenze } from '../types';

export type UtenteAccount = {
  id: string;
  nome: string;
  email: string;
};

export type DatiAccount = {
  preferenze: Preferenze;
  wishlist: Game[];
};

export type RispostaAccount = {
  utente: UtenteAccount;
  dati: DatiAccount;
};

export type RispostaAccesso = RispostaAccount & {
  token: string;
};

export function accedi(email: string, password: string): Promise<RispostaAccesso> {
  return richiesta<RispostaAccesso>('/account/accedi', {
    metodo: 'POST',
    corpo: { email, password },
  });
}

export function registrati(
  nome: string,
  email: string,
  password: string,
  dati: DatiAccount,
): Promise<RispostaAccesso> {
  return richiesta<RispostaAccesso>('/account/registrati', {
    metodo: 'POST',
    corpo: { nome, email, password, ...dati },
  });
}

export function esci(token: string): Promise<void> {
  return richiesta<void>('/account/esci', { metodo: 'POST', token });
}

export function getAccount(token: string): Promise<RispostaAccount> {
  return richiesta<RispostaAccount>('/account', { token });
}

export function salvaPreferenzeRemote(token: string, preferenze: Preferenze): Promise<void> {
  return richiesta<void>('/account/preferenze', { metodo: 'PUT', token, corpo: preferenze });
}

export function salvaWishlistRemota(token: string, wishlist: Game[]): Promise<void> {
  return richiesta<void>('/account/wishlist', { metodo: 'PUT', token, corpo: { wishlist } });
}