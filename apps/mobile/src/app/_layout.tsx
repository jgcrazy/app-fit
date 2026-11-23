import '@/global.css';

import { useFonts } from 'expo-font';
import { DarkTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import AppTabs from '@/components/app-tabs';
import { fontes } from '@/shared/theme/fonts';
import { cor } from '@/shared/theme/tokens';

SplashScreen.preventAutoHideAsync();

// O app só tem o tema `app` (escuro). A navegação nativa recebe as mesmas cores.
const temaNavegacao = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: cor['content-accent'],
    background: cor['surface-canvas'],
    card: cor['surface-deep'],
    text: cor['content-primary'],
    border: cor['border-default'],
    notification: cor['surface-accent'],
  },
};

export default function RootLayout() {
  const [fontesProntas, erroFontes] = useFonts(fontes);

  // Com erro de fonte o app segue com a fonte do sistema: melhor que ficar preso na splash.
  const pronto = fontesProntas || erroFontes != null;

  useEffect(() => {
    if (pronto) SplashScreen.hideAsync();
  }, [pronto]);

  if (!pronto) return null;

  return (
    <ThemeProvider value={temaNavegacao}>
      <StatusBar style="light" />
      <AppTabs />
    </ThemeProvider>
  );
}
