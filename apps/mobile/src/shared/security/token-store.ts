import * as SecureStore from 'expo-secure-store';

/**
 * Token de sessão no Keychain (iOS) / Keystore (Android).
 *
 * NUNCA usar AsyncStorage para isto: AsyncStorage é texto puro no disco.
 * Ver docs/arquitetura.md, seção Segurança.
 */
const ACCESS_TOKEN_KEY = 'appfit.access_token';
const REFRESH_TOKEN_KEY = 'appfit.refresh_token';

export async function saveTokens(access: string, refresh?: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });

  if (refresh) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }
}

export function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}
