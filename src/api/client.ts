import { API_BASE_URL } from './config';

const TIMEOUT_MS = 15000;

export class ErroreApi extends Error {
  stato: number | null;
  annullata: boolean;

  constructor(messaggio: string, stato: number | null, annullata = false) {
    super(messaggio);
    this.stato = stato;
    this.annullata = annullata;
  }
}

type Parametro = string | number | string[] | null | undefined;

type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type OpzioniRichiesta = {
  metodo?: Metodo;
  parametri?: Record<string, Parametro>;
  corpo?: unknown;
  token?: string | null;
  segnale?: AbortSignal;
};

function costruisciQuery(parametri: Record<string, Parametro>): string {
  const coppie = Object.entries(parametri).flatMap(([chiave, valore]) => {
    if (valore === null || valore === undefined) {
      return [];
    }
    const testo = Array.isArray(valore) ? valore.join(',') : String(valore);
    if (testo === '') {
      return [];
    }
    return [`${encodeURIComponent(chiave)}=${encodeURIComponent(testo)}`];
  });
  return coppie.length > 0 ? `?${coppie.join('&')}` : '';
}

async function leggiMessaggioErrore(risposta: Response): Promise<string> {
  try {
    const dati = (await risposta.json()) as { errore?: unknown };
    if (typeof dati.errore === 'string') {
      return dati.errore;
    }
  } catch {
    // il corpo non è JSON
  }
  return `Il server ha risposto ${risposta.status}`;
}

export async function richiesta<T>(percorso: string, opzioni: OpzioniRichiesta = {}): Promise<T> {
  const { metodo = 'GET', parametri = {}, corpo, token, segnale } = opzioni;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const annullaDaFuori = () => controller.abort();

  if (segnale) {
    if (segnale.aborted) {
      controller.abort();
    } else {
      segnale.addEventListener('abort', annullaDaFuori);
    }
  }

  const intestazioni: Record<string, string> = { Accept: 'application/json' };
  if (corpo !== undefined) {
    intestazioni['Content-Type'] = 'application/json';
  }
  if (token) {
    intestazioni.Authorization = `Bearer ${token}`;
  }

  try {
    const risposta = await fetch(`${API_BASE_URL}${percorso}${costruisciQuery(parametri)}`, {
      method: metodo,
      headers: intestazioni,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      signal: controller.signal,
    });
    if (!risposta.ok) {
      throw new ErroreApi(await leggiMessaggioErrore(risposta), risposta.status);
    }
    if (risposta.status === 204) {
      return undefined as T;
    }
    return (await risposta.json()) as T;
  } catch (errore) {
    if (errore instanceof ErroreApi) {
      throw errore;
    }
    if (segnale?.aborted) {
      throw new ErroreApi('Richiesta annullata', null, true);
    }
    throw new ErroreApi('Impossibile contattare il server', null);
  } finally {
    clearTimeout(timer);
    segnale?.removeEventListener('abort', annullaDaFuori);
  }
}

export function getJson<T>(
  percorso: string,
  parametri: Record<string, Parametro> = {},
  segnale?: AbortSignal,
): Promise<T> {
  return richiesta<T>(percorso, { parametri, segnale });
}