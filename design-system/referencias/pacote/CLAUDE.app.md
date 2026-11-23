# Ensign — regras de UI (App · Expo + NativeWind)

Renomeie para `CLAUDE.md` na raiz do repositório do app.

## Stack fechada — não proponha alternativas

- Expo (React Native) + Expo Router
- NativeWind v4 para estilo, Reanimated + Gesture Handler para movimento
- Ícones: `lucide-react-native`
- Design system: **Ensign**, tema `app` (escuro)

## Fonte da verdade

`design-system/tokens.json`.

```
npm run ds:build    # regenera o preset nativo e tokens.ts
npm run ds:lint
```

**Nunca edite à mão:** `design-system/tailwind-preset.native.js`,
`design-system/tokens.ts`. São gerados.

## Proibido — falha no lint, falha no review

- Hex, `rgb()`, `hsl()` em qualquer componente ou tela.
- Nome de rampa primitiva: `navy-*`, `champagne-*`, `sunflare-*`, `sand-*`.
- `text-white` em cima de `bg-action-primary-bg` ou `bg-surface-accent`.
  Use **`text-action-primary-fg`** / **`text-content-on-accent`**.
  Branco sobre `#FFCF14` é **1,48:1**.
- Valor arbitrário: `p-[13px]`, `text-[15px]`, `rounded-[10px]`,
  `bg-[#1B2340]`.
- `StyleSheet.create` com cor literal. Se precisar de estilo imperativo, leia de
  `tokens.ts`.
- Área tocável abaixo de 44px (`size-touch`).
- `TouchableOpacity`/`Pressable` sem `accessibilityRole`, e botão só de ícone sem
  `accessibilityLabel`.
- Emoji na UI.

## Obrigatório

- Tokens semânticos: `bg-surface-*`, `text-content-*`, `border-border-*`,
  `bg-action-*`, `text-feedback-*`, `bg-status-*`.
- `rounded-card` (16px), `rounded-control` (12px), `rounded-button` (pílula).
- **Raiz de toda tela com `bg-surface-canvas`.** Sem isso a tela nasce branca.
- `px-4` de margem lateral em toda tela.
- Padding inferior da região de scroll = `insets.bottom` + altura da tab bar +
  `space-4`. Sem isso o último card morre atrás da tab bar.
- `useSafeAreaInsets()` para insets — nunca um valor fixo no código.
- Número em coluna com `fontVariant: ['tabular-nums']`.
- Press: `scale(0.97)` em `duration-fast`, ou `opacity-press` onde o scale
  atrapalha.
- Respeitar `AccessibilityInfo.isReduceMotionEnabled()`: corta transform, mantém
  opacidade.
- Teclado correto em todo campo (`keyboardType`, `autoComplete`); CPF, CEP e
  telefone mascarados.
- Toda tela tem estado vazio, de carregamento (skeleton que espelha o layout
  real) e de erro.
- Texto em pt-BR, segunda pessoa, botão como verbo.

## Regras de composição

- **Um único botão `surface-accent` na viewport.** Se a ação precisa ficar fixa, é
  uma barra encaixada acima da tab bar sobre `surface-deep` — não um botão
  flutuante sobre o conteúdo.
- `FeatureCard` (`surface-secondary`, o card bege invertido) aparece **uma ou duas
  vezes por tela**. Três seguidos e os 30% viraram os 60%.
- Texto sobre `surface-secondary` é `content-on-secondary` (navy).
- BottomTabBar: no máximo 4 itens, `surface-deep`, ativo em `content-accent` com
  indicador `border-accent` de 3px, inativo em `content-secondary` a
  `opacity-tab-inactive`. **O rótulo nunca desaparece.**
- AppHeader: 56px, `surface-brand`, título `h2` + `content-on-brand`.
- Elevação no escuro é **passo de superfície + borda de 1px**, não sombra.
- `placeholderTextColor` em `content-muted` — foi escolhido para passar 4,5:1
  sobre `surface-input`.

## Antes de criar qualquer componente

Leia `design-system/README.md` e a seção do app. Se existe, use; se precisa de
variante, estenda.

**Se faltar um componente para montar uma tela, PARE e diga o que falta antes de
criar um novo.**

## Ao terminar

```
npm run ds:build && npm run ds:lint && npx tsc --noEmit && npm run lint
```

Revise no simulador a 390px de largura: contraste, área de toque, safe area em
cima e embaixo, e o último item da lista acima da tab bar.
