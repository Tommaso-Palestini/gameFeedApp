import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type TextInputProps,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { RAGGI, SPAZI, type Palette } from '../theme/tema';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type Modo = 'accedi' | 'registrati' | 'recupero';

type TestiModo = {
  titolo: string;
  sottotitolo: string;
  bottone: string;
  domanda: string;
  cambio: string;
  verso: Modo;
};

const TESTI: Record<Modo, TestiModo> = {
  accedi: {
    titolo: 'Bentornato',
    sottotitolo: 'Accedi per ritrovare la tua wishlist.',
    bottone: 'Accedi',
    domanda: 'Prima volta? ',
    cambio: 'Registrati',
    verso: 'registrati',
  },
  registrati: {
    titolo: 'Crea un account',
    sottotitolo: 'Salva wishlist e preferenze su tutti i tuoi dispositivi.',
    bottone: 'Registrati',
    domanda: 'Hai già un account? ',
    cambio: 'Accedi',
    verso: 'accedi',
  },
  recupero: {
    titolo: 'Recupera password',
    sottotitolo: 'Inserisci la tua email: ti invieremo un link per reimpostarla.',
    bottone: 'Invia link',
    domanda: '',
    cambio: "Torna all'accesso",
    verso: 'accedi',
  },
};

const BLOB = [
  { cx: 0.5, cy: 0.92, d: 1.0 },
  { cx: 0.12, cy: 0.74, d: 0.95 },
  { cx: 0.88, cy: 0.7, d: 0.95 },
  { cx: 0.5, cy: 0.5, d: 1.15 },
  { cx: 0.15, cy: 0.3, d: 1.0 },
  { cx: 0.85, cy: 0.28, d: 1.0 },
  { cx: 0.5, cy: 0.08, d: 1.15 },
];

const STRISCE = [
  { x: 0.1, y: 0.82, lunghezza: 0.14, spessore: 5, rotazione: -8 },
  { x: 0.3, y: 0.6, lunghezza: 0.2, spessore: 4, rotazione: 6 },
  { x: 0.72, y: 0.86, lunghezza: 0.12, spessore: 6, rotazione: 10 },
  { x: 0.9, y: 0.55, lunghezza: 0.18, spessore: 4, rotazione: -6 },
  { x: 0.55, y: 0.35, lunghezza: 0.16, spessore: 5, rotazione: -10 },
  { x: 0.2, y: 0.18, lunghezza: 0.13, spessore: 4, rotazione: 8 },
  { x: 0.8, y: 0.15, lunghezza: 0.17, spessore: 6, rotazione: -4 },
  { x: 0.45, y: 0.72, lunghezza: 0.1, spessore: 3, rotazione: 14 },
  { x: 0.62, y: 0.08, lunghezza: 0.12, spessore: 4, rotazione: 5 },
];

const LUNGHEZZA_MINIMA_PASSWORD = 8;

function emailValida(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email.trim());
}

type Stili = ReturnType<typeof creaStili>;

type CampoProps = TextInputProps & {
  styles: Stili;
  colori: Palette;
};

function Campo({ styles, colori, onFocus, onBlur, ...props }: CampoProps) {
  const [attivo, setAttivo] = useState(false);

  return (
    <TextInput
      {...props}
      placeholderTextColor={colori.testoSecondario}
      onFocus={e => {
        setAttivo(true);
        onFocus?.(e);
      }}
      onBlur={e => {
        setAttivo(false);
        onBlur?.(e);
      }}
      style={[styles.campo, attivo && styles.campoAttivo]}
    />
  );
}

export default function LoginScreen({ navigation }: Props) {
  const { colori } = useTheme();
  const styles = useMemo(() => creaStili(colori), [colori]);
  const insets = useSafeAreaInsets();
  const { width: larghezza, height: altezza } = useWindowDimensions();

  const progressiBlob = useRef(BLOB.map(() => new Animated.Value(0))).current;
  const progressiStrisce = useRef(STRISCE.map(() => new Animated.Value(0))).current;
  const sfondo = useRef(new Animated.Value(0)).current;
  const contenuto = useRef(new Animated.Value(0)).current;
  const form = useRef(new Animated.Value(1)).current;
  const uscitaConsentita = useRef(false);

  const [modo, setModo] = useState<Modo>('accedi');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conferma, setConferma] = useState('');
  const [errore, setErrore] = useState<string | null>(null);
  const [linkInviato, setLinkInviato] = useState(false);

  const testi = TESTI[modo];

  useEffect(() => {
    Animated.parallel([
      Animated.stagger(
        60,
        progressiBlob.map(p =>
          Animated.spring(p, {
            toValue: 1,
            friction: 6,
            tension: 35,
            useNativeDriver: true,
          }),
        ),
      ),
      Animated.sequence([
        Animated.delay(120),
        Animated.stagger(
          50,
          progressiStrisce.map(p =>
            Animated.spring(p, {
              toValue: 1,
              friction: 7,
              tension: 40,
              useNativeDriver: true,
            }),
          ),
        ),
      ]),
      Animated.sequence([
        Animated.delay(650),
        Animated.timing(sfondo, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(contenuto, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [progressiBlob, progressiStrisce, sfondo, contenuto]);

  const animaChiusura = useCallback(
    (alTermine: () => void) => {
      const caduta = (valori: Animated.Value[]) =>
        Animated.stagger(
          40,
          [...valori].reverse().map(p =>
            Animated.timing(p, {
              toValue: 0,
              duration: 380,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ),
        );

      Animated.sequence([
        Animated.parallel([
          Animated.timing(contenuto, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(sfondo, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([caduta(progressiStrisce), caduta(progressiBlob)]),
      ]).start(() => alTermine());
    },
    [contenuto, sfondo, progressiBlob, progressiStrisce],
  );

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (uscitaConsentita.current) {
          return;
        }
        e.preventDefault();
        uscitaConsentita.current = true;
        animaChiusura(() => navigation.dispatch(e.data.action));
      }),
    [navigation, animaChiusura],
  );

  const cambiaModo = (nuovo: Modo) => {
    Animated.timing(form, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setModo(nuovo);
      setErrore(null);
      setLinkInviato(false);
      Animated.timing(form, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const entra = () => {
    uscitaConsentita.current = true;
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  const handleInvio = () => {
    if (modo === 'registrati' && nome.trim() === '') {
      setErrore('Inserisci il tuo nome.');
      return;
    }
    if (!emailValida(email)) {
      setErrore("Inserisci un'email valida.");
      return;
    }
    if (modo === 'recupero') {
      setErrore(null);
      setLinkInviato(true);
      return;
    }
    if (modo === 'accedi' && password === '') {
      setErrore('Inserisci la password.');
      return;
    }
    if (modo === 'registrati' && password.length < LUNGHEZZA_MINIMA_PASSWORD) {
      setErrore(`La password deve avere almeno ${LUNGHEZZA_MINIMA_PASSWORD} caratteri.`);
      return;
    }
    if (modo === 'registrati' && password !== conferma) {
      setErrore('Le password non coincidono.');
      return;
    }
    setErrore(null);
    entra();
  };

  const origineX = larghezza / 2;
  const origineY = altezza - 60;

  return (
    <View style={styles.radice}>
      {BLOB.map((blob, i) => {
        const diametro = blob.d * larghezza;
        const cx = blob.cx * larghezza;
        const cy = blob.cy * altezza;
        const p = progressiBlob[i];

        return (
          <Animated.View
            key={`blob-${i}`}
            pointerEvents="none"
            style={[
              styles.blob,
              {
                width: diametro,
                height: diametro,
                borderRadius: diametro / 2,
                left: cx - diametro / 2,
                top: cy - diametro / 2,
                transform: [
                  {
                    translateX: p.interpolate({
                      inputRange: [0, 1],
                      outputRange: [origineX - cx, 0],
                    }),
                  },
                  {
                    translateY: p.interpolate({
                      inputRange: [0, 1],
                      outputRange: [origineY - cy, 0],
                    }),
                  },
                  {
                    scale: p.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.08, 1],
                    }),
                  },
                  {
                    scaleY: p.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [2.2, 1.35, 1],
                    }),
                  },
                  {
                    scaleX: p.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.6, 0.85, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}

      {STRISCE.map((striscia, i) => {
        const lunghezza = striscia.lunghezza * altezza;
        const x = striscia.x * larghezza;
        const y = striscia.y * altezza;
        const p = progressiStrisce[i];

        return (
          <Animated.View
            key={`striscia-${i}`}
            pointerEvents="none"
            style={[
              styles.striscia,
              {
                width: striscia.spessore,
                height: lunghezza,
                borderRadius: striscia.spessore / 2,
                left: x - striscia.spessore / 2,
                top: y - lunghezza / 2,
                opacity: p.interpolate({
                  inputRange: [0, 0.1, 1],
                  outputRange: [0, 1, 1],
                }),
                transform: [
                  {
                    translateX: p.interpolate({
                      inputRange: [0, 1],
                      outputRange: [origineX - x, 0],
                    }),
                  },
                  {
                    translateY: p.interpolate({
                      inputRange: [0, 1],
                      outputRange: [origineY - y, 0],
                    }),
                  },
                  { rotate: `${striscia.rotazione}deg` },
                  {
                    scaleY: p.interpolate({
                      inputRange: [0, 0.4, 1],
                      outputRange: [0.1, 1.4, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}

      <Animated.View pointerEvents="none" style={[styles.sfondo, { opacity: sfondo }]} />

      <Animated.View
        style={[
          styles.contenuto,
          {
            opacity: contenuto,
            transform: [
              {
                translateY: contenuto.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <KeyboardAvoidingView style={styles.riempi} behavior="padding">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.scroll,
              { paddingTop: insets.top + 70, paddingBottom: insets.bottom + SPAZI.xl },
            ]}
          >
            <Animated.View style={{ opacity: form }}>
              <Text style={styles.titolo}>{testi.titolo}</Text>
              <Text style={styles.sottotitolo}>{testi.sottotitolo}</Text>

              <View style={styles.campi}>
                {modo === 'registrati' && (
                  <Campo
                    styles={styles}
                    colori={colori}
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                    autoCapitalize="words"
                  />
                )}
                <Campo
                  styles={styles}
                  colori={colori}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  autoComplete="email"
                />
                {modo !== 'recupero' && (
                  <Campo
                    styles={styles}
                    colori={colori}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                )}
                {modo === 'registrati' && (
                  <Campo
                    styles={styles}
                    colori={colori}
                    placeholder="Conferma password"
                    value={conferma}
                    onChangeText={setConferma}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                )}
              </View>

              {modo === 'accedi' && (
                <Pressable
                  onPress={() => cambiaModo('recupero')}
                  style={styles.dimenticata}
                  hitSlop={8}
                >
                  <Text style={styles.linkPiccolo}>Password dimenticata?</Text>
                </Pressable>
              )}

              {errore && <Text style={styles.errore}>{errore}</Text>}

              {linkInviato && (
                <Text style={styles.conferma}>
                  Se l'email è registrata, riceverai a breve un link per reimpostare la password.
                </Text>
              )}

              <Pressable style={styles.bottone} onPress={handleInvio}>
                <Text style={styles.bottoneTesto}>{testi.bottone}</Text>
              </Pressable>

              <Pressable
                onPress={() => cambiaModo(testi.verso)}
                style={styles.cambioModo}
                hitSlop={8}
              >
                <Text style={styles.link}>
                  {testi.domanda}
                  <Text style={styles.linkForte}>{testi.cambio}</Text>
                </Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.chiudi, { top: insets.top + SPAZI.s }]}
          hitSlop={10}
        >
          <X size={22} color={colori.testo} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

function creaStili(colori: Palette) {
  return StyleSheet.create({
    radice: {
      flex: 1,
      overflow: 'hidden',
    },
    blob: {
      position: 'absolute',
      backgroundColor: colori.accento,
    },
    striscia: {
      position: 'absolute',
      backgroundColor: colori.accentoSecondario,
      boxShadow: `0 0 8px 1px ${colori.accentoSecondario}`,
    },
    sfondo: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colori.sfondo,
    },
    contenuto: {
      ...StyleSheet.absoluteFill,
    },
    riempi: {
      flex: 1,
    },
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: SPAZI.xl,
    },
    chiudi: {
      position: 'absolute',
      left: SPAZI.l,
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colori.superficie,
      borderWidth: 1,
      borderColor: colori.bordo,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titolo: {
      fontSize: 32,
      fontWeight: '800',
      color: colori.testo,
    },
    sottotitolo: {
      fontSize: 15,
      color: colori.testoSecondario,
      marginTop: SPAZI.s,
    },
    campi: {
      marginTop: SPAZI.xl,
      gap: SPAZI.m,
    },
    campo: {
      borderWidth: 1.5,
      borderColor: colori.bordo,
      borderRadius: RAGGI.m,
      backgroundColor: colori.superficie,
      paddingHorizontal: SPAZI.l,
      paddingVertical: 14,
      fontSize: 16,
      color: colori.testo,
    },
    campoAttivo: {
      borderColor: colori.accento,
      boxShadow: `0 0 10px 0px ${colori.accento}`,
    },
    dimenticata: {
      alignSelf: 'flex-end',
      marginTop: SPAZI.m,
    },
    linkPiccolo: {
      color: colori.accento,
      fontSize: 14,
      fontWeight: '600',
    },
    errore: {
      marginTop: SPAZI.m,
      color: colori.pericolo,
      fontSize: 14,
      fontWeight: '600',
    },
    conferma: {
      marginTop: SPAZI.m,
      padding: SPAZI.m,
      borderRadius: RAGGI.s,
      backgroundColor: colori.accentoTenue,
      color: colori.testo,
      fontSize: 14,
      overflow: 'hidden',
    },
    bottone: {
      marginTop: SPAZI.xl,
      backgroundColor: colori.accento,
      paddingVertical: 16,
      borderRadius: RAGGI.m,
      alignItems: 'center',
      boxShadow: `0 0 16px 0px ${colori.accento}`,
    },
    bottoneTesto: {
      color: colori.testoSuAccento,
      fontSize: 16,
      fontWeight: '800',
    },
    cambioModo: {
      marginTop: SPAZI.xl,
      alignSelf: 'center',
    },
    link: {
      color: colori.testoSecondario,
      fontSize: 15,
    },
    linkForte: {
      color: colori.accento,
      fontWeight: '700',
    },
  });
}