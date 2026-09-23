import { API_BASE_URL } from './config';

const TIMEOUT_MS = 15000;

export class ErroreApi extends Error {
  stato: number | null;

  constructor(messaggio: string, stato: number | null) {
    super(messaggio);
    this.stato = stato;
  }
}

type Parametro = string | number | string[] | null | undefined;

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

export async function getJson<T>(
  percorso: string,
  parametri: Record<string, Parametro> = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const risposta = await fetch(`${API_BASE_URL}${percorso}${costruisciQuery(parametri)}`, {
      signal: controller.signal,
    });
    if (!risposta.ok) {
      throw new ErroreApi(`Il server ha risposto ${risposta.status}`, risposta.status);
    }
    return (await risposta.json()) as T;
  } catch (errore) {
    if (errore instanceof ErroreApi) {
      throw errore;
    }
    throw new ErroreApi('Impossibile contattare il server', null);
  } finally {
    clearTimeout(timer);
  }
}