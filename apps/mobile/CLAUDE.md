@AGENTS.md

# Ensign — regras de UI (App · Expo + NativeWind)

Design system **Ensign**: https://claude.ai/artifact/STGHQPzyBZcSHoPdGfCdTk
(leia com a ferramenta Artifact, `action: "read"`). Ordem de leitura:
`project/README.md` → a seção do app (`project/06-app-expo-nativewind.md`) →
`project/components/<Comp>/README.md` antes de implementar ou usar um componente.
Resumo de instalação e manutenção no repo:
[`design-system/README.md`](../../design-system/README.md).

Cópia de consulta local em `design-system/referencias/` (o artifact vale se
divergir). **Antes de montar uma tela, abra o desenho dela em
`design-system/referencias/canvas/`** (`App-Hoje`, `App-Dieta`): a tela real
segue o canvas, montada só com componentes de `src/shared/ui/`.

## Componentes: o artifact é a especificação, não o código

O `components/bundle.js` do artifact é React **web** (DOM, React 18) e não roda
no React Native. No app, cada componente é reescrito em RN em
`src/shared/ui/<Comp>.tsx`, seguindo o README dele no artifact: mesma API
(`index.d.ts`), mesmos tokens, mesmos estados. Componentes do app: Button,
IconButton, Field, Badge, Card, ListCard, FeatureCard, AppHeader, BottomTabBar,
Toast. KPICard, DataTable e Sidebar são do admin.

## Stack fechada — não proponha alternativas

- Expo (React Native) + Expo Router
- NativeWind v4 para estilo, Reanimated + Gesture Handler para movimento
- Ícones: `lucide-react-native` via `src/shared/ui/Icon.tsx` (nomes do Ensign:
  `home`, `plus`, `bell`…). O template ainda usa `expo-symbols` no Collapsible.
- Design system: **Ensign**, tema `app` (escuro). O app não tem tema claro.

## Fonte da verdade

`design-system/tokens.json`, na **raiz do monorepo** (o admin vai usar o mesmo).

```
npm run ds:build    # na raiz: regenera os arquivos de src/shared/theme/
npm run ds:lint     # na raiz: varre apps/mobile/src
```

**Nunca edite à mão** (são gerados):
`src/shared/theme/tailwind-preset.native.js`, `src/shared/theme/tokens.ts`,
`src/shared/theme/fonts.ts`.

Estilo imperativo (prop que pede cor/número, Reanimated, navegação nativa) lê de
`@/shared/theme/tokens` (`cor`, `escalas`, `textoEstilos`) e converte com `px()`
de `@/shared/theme/layout`. Nunca um literal.

## Texto: `docs/linguagem.md` manda

As regras de redação do produto (ADR 0008) vêm antes de qualquer exemplo do brand
book: nada de "sua dieta", promessa de resultado, imperativo clínico ou culpa por
dia perdido. Do Ensign valem: pt-BR, segunda pessoa, curto, botão como verbo,
erro com próximo passo, número formatado.

## Proibido — falha no lint, falha no review

- Hex, `rgb()`, `hsl()` em qualquer componente ou tela.
- Nome de rampa primitiva: `navy-*`, `champagne-*`, `sunflare-*`, `sand-*`.
- `text-white` em cima de `bg-action-primary-bg` ou `bg-surface-accent`.
  Use **`text-action-primary-fg`** / **`text-content-on-accent`**.
  Branco sobre `#FFCF14` é **1,48:1**.
- Valor arbitrário: `p-[13px]`, `text-[15px]`, `rounded-[10px]`, `bg-[#1B2340]`.
- `StyleSheet.create` com cor ou tamanho literal.
- `fontWeight` em texto com fonte do sistema de design: o peso está no nome do
  arquivo da fonte, e os utilitários `text-<estilo>` já trazem o arquivo certo.
- Área tocável abaixo de 44px (`min-h-touch` / `size-touch`).
- `Pressable` sem `accessibilityRole`, e botão só de ícone sem `accessibilityLabel`.
- Emoji na UI.

## Obrigatório

- Tokens semânticos: `bg-surface-*`, `text-content-*`, `border-border-*`,
  `bg-action-*`, `text-feedback-*`, `bg-status-*`.
- Estilos de texto: `text-display-lg`, `text-h2`, `text-body`, `text-label`,
  `text-numeric`… (os 19 do brand book).
- `rounded-card` (16px), `rounded-control` (12px), `rounded-button` (pílula).
- **Raiz de toda tela com `bg-surface-canvas`.** Sem isso a tela nasce branca.
- `px-4` de margem lateral em toda tela.
- Padding inferior da região de scroll = `paddingInferiorTela(insets.bottom)`
  (`@/shared/theme/layout`): safe area + tab bar + `space-4`.
- `useSafeAreaInsets()` para insets — nunca um valor fixo no código.
- Número em coluna com `text-numeric` (já traz `tabular-nums`).
- Press: `scale(0.97)` em `duration-fast`, ou `opacity-press` onde o scale atrapalha.
- Respeitar `AccessibilityInfo.isReduceMotionEnabled()`: corta transform, mantém opacidade.
- Teclado correto em todo campo (`keyboardType`, `autoComplete`).
- Toda tela tem estado vazio, de carregamento (skeleton que espelha o layout
  real) e de erro.

## Regras de composição

- **Um único botão `surface-accent` na viewport.** Ação fixa é barra encaixada
  acima da tab bar sobre `surface-deep` — não botão flutuante.
- `FeatureCard` (`surface-secondary`, o card bege invertido) aparece **uma ou duas
  vezes por tela**. Texto sobre ele é `content-on-secondary` (navy).
- Tab bar: no máximo 4 itens, `surface-deep`, ativo em `content-accent`, inativo
  em `content-secondary`. **O rótulo nunca desaparece.**
- AppHeader: 56px, `surface-brand`, título `text-h2` + `text-content-on-brand`.
- Elevação no escuro é **passo de superfície + borda de 1px**, não sombra.
- `placeholderTextColor={cor['content-muted']}` — passa 4,5:1 sobre `surface-input`.

## Antes de criar qualquer componente

Use `/ds-componente <Nome>`. Se existe, use; se precisa de variante, estenda.

**Se faltar um componente para montar uma tela, PARE e diga o que falta antes de
criar um novo.**

## Ao terminar

```
# na raiz
npm run ds:build && npm run ds:lint
# em apps/mobile
npx tsc --noEmit && npx expo lint
```

Revise a 390px de largura: contraste, área de toque, safe area em cima e embaixo,
e o último item da lista acima da tab bar. `/ds-check` audita o que o lint não pega.
