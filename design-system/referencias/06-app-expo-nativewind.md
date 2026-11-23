# App — Expo / React Native + NativeWind

O app roda no tema **`app`**: escuro, imersivo, Ensign Navy ocupando os 60%.

## Arquivos

```
app/
  _layout.tsx              raiz: fontes, SafeAreaProvider, ThemeProvider
  (tabs)/_layout.tsx       BottomTabBar
design-system/
  tokens.ts                GERADO de tokens.json — não edite à mão
  theme.ts                 vars() por tema (app, e admin se o app ganhar claro)
  components/              Button, Input, Badge, Card, Sheet, …
global.css                 @tailwind + as custom properties
tailwind.config.js         preset do Ensign
```

`design-system/tokens.ts` é gerado. A regra: **um comando regenera, ninguém edita
o arquivo gerado.**

## 1. Preset do Tailwind

O preset mapeia **nomes semânticos** para classes utilitárias. Depois disso, a
única coisa que aparece em um componente é `bg-surface-raised`,
`text-content-primary`, `rounded-card`.

```js
// tailwind.config.js
const ensign = require('./design-system/tailwind-preset');

module.exports = {
  presets: [ensign],
  content: ['./app/**/*.{ts,tsx}', './design-system/**/*.{ts,tsx}'],
};
```

O preset cobre:

| Utilitário | Vem de |
| --- | --- |
| `bg-surface-*`, `text-content-*`, `border-border-*` | tokens de cor semânticos |
| `bg-action-primary-bg`, `text-action-primary-fg` | tokens de ação |
| `text-feedback-error-fg`, `bg-status-pending-bg` | feedback e status |
| `p-4` = `space-4` (16px) | escala de espaçamento |
| `rounded-card`, `rounded-control`, `rounded-button` | raios semânticos |
| `text-body`, `text-h2`, `text-metric-xl` | os 19 estilos de texto |
| `duration-base`, `ease-standard` | movimento |

## 2. Fontes

```tsx
// app/_layout.tsx
import { useFonts } from 'expo-font';
import { PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [pronto] = useFonts({
    PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold,
  });
  useEffect(() => { if (pronto) SplashScreen.hideAsync(); }, [pronto]);
  if (!pronto) return null;
  return (/* SafeAreaProvider + Stack */);
}
```

A splash usa `surface-brand` com a marca centralizada — sem spinner, sem
porcentagem.

## 3. Estrutura de tela

```tsx
<View className="flex-1 bg-surface-canvas">
  <AppHeader titulo="Pedidos" />
  <ScrollView
    className="flex-1"
    contentContainerClassName="px-4 pt-4 gap-4"
    contentContainerStyle={{ paddingBottom: insets.bottom + 56 + 16 }}
  >
    {/* cards */}
  </ScrollView>
</View>
```

Três coisas que não podem faltar:

1. **`bg-surface-canvas` na raiz.** É o chão navy; sem ele a tela nasce branca.
2. **`px-4`** de margem lateral, sempre.
3. **Padding inferior = `insets.bottom` + altura da tab bar + `space-4`.** Sem
   isso o último card morre atrás da tab bar.

## 4. Componentes estruturais

### AppHeader

56px, `surface-brand`, título em `h2` + `content-on-brand`. Voltar e
notificações como botões de ícone de 44px com `aria-label` (no RN,
`accessibilityLabel`). A saudação, quando existe, é `body-sm` +
`content-secondary` acima do título.

### BottomTabBar

```
surface-deep, 56px + inset inferior
ativo:   ícone content-accent, rótulo label-sm content-accent,
         indicador border-accent de 3px no topo do item
inativo: ícone + rótulo content-secondary a opacity-tab-inactive (0,72)
```

Quatro itens no máximo. O rótulo nunca desaparece — ícone sozinho não se lê. O
indicador desliza entre abas em `duration-base` + `ease-spring`.

### FeatureCard e ListCard

**ListCard** — o padrão da listagem:

```
surface-raised, rounded-card (16px), border-default, p-4
título   body-strong   content-primary
apoio    body-sm       content-muted
valor    numeric       content-primary
status   pílula status-*
```

**FeatureCard** — o card invertido, a aparição em força máxima dos 30%:

```
surface-secondary (#D8CBB0), rounded-card, p-5
título   h3            content-on-secondary   (navy, 9,6:1)
texto    body          content-on-secondary
botão    surface-accent + content-on-accent
```

Um ou dois por tela. Três cards bege seguidos e os 30% viram os 60%.

### BottomSheet

`surface-overlay`, `rounded-t-2xl` (24px), `shadow-lg`, scrim `surface-scrim`.
Uma alça de 4×32px em `border-strong` no topo. Entra com `slide-up` em
`duration-slow` + `ease-decelerate`; arraste 1:1; soltar passando de 40% dispensa.

## 5. Botões

```tsx
<Pressable
  className="h-12 rounded-button bg-action-primary-bg items-center justify-center px-6
             active:bg-action-primary-bg-active"
  style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}
  accessibilityRole="button"
>
  <Text className="text-label text-action-primary-fg">Confirmar pedido</Text>
</Pressable>
```

- Altura `size-control-lg` (48px), nunca menos que `size-touch` (44px).
- `rounded-button` = pílula no app.
- **O texto é `action-primary-fg`** — e esse token é navy. Nunca
  `text-white` aqui.
- Em loading, o rótulo sai e entra o spinner em `content-on-accent`; a largura
  fica travada.

## 6. Inputs

```
fundo    surface-input (navy-800)
borda    border-strong a 1px
raio     rounded-control (12px)
texto    body            content-primary
rótulo   label           content-secondary, acima do campo
ajuda    body-sm         content-muted
foco     2px border-focus + 2px border-focus-outline
erro     borda feedback-error-border, mensagem body-sm feedback-error-fg
```

`placeholderTextColor` vai em `content-muted` — e esse token foi escolhido para
passar 4,5:1 sobre `surface-input`, então o placeholder é legível de verdade.

Teclado: `keyboardType` e `autoComplete` corretos em todo campo. CPF, CEP e
telefone vêm mascarados.

## 7. Movimento no RN

- Press: `Pressable` com scale 0,97, ou `opacity-press` onde o scale atrapalha.
- Transições e gestos: **Reanimated**; sheets e drawers com
  `react-native-gesture-handler`.
- `Easing.bezier(0.2, 0, 0, 1)` para `ease-standard`,
  `Easing.bezier(0, 0, 0, 1)` para entradas, `Easing.bezier(0.3, 0, 1, 1)` para
  saídas.
- Respeite `AccessibilityInfo.isReduceMotionEnabled()`: corta transform, mantém
  opacidade.

## 8. Checklist de tela do app

- [ ] Raiz com `bg-surface-canvas`.
- [ ] `px-4` nas laterais.
- [ ] Padding inferior vencendo a tab bar + safe area.
- [ ] Um único botão `surface-accent` na viewport.
- [ ] Todo `surface-accent` com `content-on-accent` em cima.
- [ ] Todo tocável com no mínimo 44px e `accessibilityLabel` se for só ícone.
- [ ] Nenhum hex, nenhum `text-white`, nenhum `#` no arquivo.
- [ ] Números em coluna com `fontVariant: ['tabular-nums']`.
- [ ] Estado vazio e estado de erro desenhados, não só o caminho felizidade.
