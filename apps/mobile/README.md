# app-fit — mobile

Expo SDK 58 / React Native 0.88, TypeScript. Android e iOS.

```bash
npm install
npx expo start
```

`EXPO_PUBLIC_API_URL` aponta para a API (padrão `http://localhost:8000/api/v1`).

## Estrutura

```
src/
├── app/          rotas (expo-router, file-based)
├── features/
│   ├── identity/    auth, perfil de saúde
│   ├── training/    catálogo, fichas, execução
│   ├── evolution/   peso, medidas, check-in
│   └── habits/      água, sono, hábitos
│       └── cada um: api/ components/ hooks/ screens/
├── shared/
│   ├── api/       cliente HTTP
│   ├── db/        SQLite + fila de sync offline
│   ├── security/  token no Keychain/Keystore, biometria
│   ├── theme/     tokens do design system
│   └── ui/        componentes base
├── components/   componentes do template (migrar para shared/ui aos poucos)
└── hooks/
```

Organização **por feature**, não por tipo de arquivo. Com dois domínios grandes
(treino e nutrição), uma pasta `components/` global vira bagunça em semanas.

## Regras

- **Nenhuma cor, espaçamento ou tamanho de fonte literal em componente.**
  Tudo vem de `src/shared/theme/tokens.js`, que é o ponto único de troca do
  design system.
- **Dark mode é requisito.** Academia é ambiente escuro, celular na mão suada.
  Todo token de cor tem par claro/escuro.
- **Token de sessão só em `expo-secure-store`.** Nunca AsyncStorage.
- **Escrita de dado passa pela fila de sync** (`src/shared/db/sync-queue.ts`),
  não direto no cliente HTTP. A tela de execução de treino precisa funcionar
  sem rede.
- **Tipos de payload vêm do OpenAPI gerado**, não escritos à mão.

## Pendências

- [ ] Trocar `expo-sqlite` por banco criptografado (SQLCipher) antes de
      persistir dado de saúde em produção
- [ ] Gerar tipos da API via `openapi-typescript`
- [ ] Substituir `src/shared/theme/tokens.js` pelos tokens reais do design system
- [ ] Bloqueio biométrico nas telas de saúde (`expo-local-authentication` já instalado)
- [ ] Reagendamento de notificações locais ao reorganizar a semana

> `npm audit` reporta 3 vulnerabilidades moderadas, todas em `minimatch`
> transitivo via `@expo/fingerprint` (dependência do próprio Expo). Não há
> correção do nosso lado; reavaliar a cada upgrade de SDK.
