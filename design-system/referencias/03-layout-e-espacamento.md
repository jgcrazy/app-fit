# Layout, espaçamento e densidade

Uma grade de 4px, duas densidades. O app respira; o admin compacta.

## Escala de espaçamento

| Token | Valor | Onde entra |
| --- | --- | --- |
| `space-0` | 0 | Reset |
| `space-px` | 1px | Fios, largura de anel |
| `space-1` | 4px | Vão ícone-rótulo, padding de badge |
| `space-2` | 8px | Rótulo para campo, fileira de chips, vão interno de lista |
| `space-3` | 12px | Padding de controle, card compacto, célula de tabela do admin |
| `space-4` | 16px | **Padrão.** Margem lateral do app, padding de card, vão entre cards |
| `space-5` | 20px | Padding generoso de card, painel do admin |
| `space-6` | 24px | Vão de seção, padding de conteúdo do admin, padding de sheet |
| `space-8` | 32px | Blocos sem relação, padding de página do admin |
| `space-10` | 40px | Regiões de página |
| `space-12` | 48px | Padding de hero, estados vazios |
| `space-16` | 64px | Ritmo de página em telas largas do admin |

`space-2` até `space-6` cobrem quase tudo. Só vá para `space-10` e acima para
separar regiões inteiras.

**Componha com gap, não empilhe margin.** Flex e grid com `gap` — um grupo de
irmãos tem um valor de vão, não oito margens.

## Raio: duas personalidades

| Token | App | Admin |
| --- | --- | --- |
| `radius-card` | **16px** | **8px** |
| `radius-control` | **12px** | **8px** |
| `radius-button` | **9999px** (pílula) | **6px** |

Mais a escala bruta: `radius-xs` 4, `sm` 6, `md` 8, `lg` 12, `xl` 16, `2xl` 24,
`pill` 9999. Use `radius-2xl` nos cantos superiores do bottom sheet e no drawer do
app.

No código do produto escreva os três semânticos; deixe o tema decidir o valor.

## Tamanhos

| Token | Valor | Nota |
| --- | --- | --- |
| `size-touch` | 44px | Área de toque mínima. Inegociável no app; vale para botões de ícone do admin também. |
| `size-control-sm` | 32px | Altura de controle sm do admin |
| `size-control-md` | 40px | Altura padrão de controle do admin |
| `size-control-lg` | 48px | Altura de controle do app |
| `size-icon-sm / md / lg` | 16 / 20 / 24px | |
| `size-sidebar` | 264px | Sidebar do admin, expandida |
| `size-sidebar-collapsed` | 72px | Sidebar só com ícones |
| `size-content-max` | 1280px | Teto da coluna de conteúdo do admin |
| `size-stroke-icon` | 1,75px | Traço do ícone |

Um botão de ícone de 32px no admin ainda precisa de 44px de área clicável —
aumente o alvo, não o visual.

## Layout do app (referência 390 × 844)

```
┌─────────────────────────────┐
│ AppHeader   56px  z-header  │  surface-brand
├─────────────────────────────┤
│                             │
│ região de scroll            │  surface-canvas
│ margem lateral space-4      │
│ vão entre cards space-4     │
│                             │
│ ...                         │
│ padding inferior = altura   │
│ da tab bar + safe area +    │
│ space-4                     │
├─────────────────────────────┤
│ BottomTabBar 56px z-tabbar  │  surface-deep
│ + inset de safe area        │
└─────────────────────────────┘
```

- **Margem lateral é `space-4`**, nos dois lados, em toda tela.
- Respeite os insets de safe area em cima e embaixo — `useSafeAreaInsets()`, nunca
  um 44 fixo no código.
- O padding inferior da região de scroll tem que vencer a tab bar, ou o último
  card fica escondido atrás dela.
- Cards são largura cheia menos as margens. Nenhum scroll horizontal aninhado,
  exceto um carrossel deliberado.
- Uma tela, uma ação primária. Se ela precisa ficar fixa, é uma barra encaixada
  acima da tab bar sobre `surface-deep` — não um botão flutuante sobre o conteúdo.

## Layout do admin (referência 1440, funciona a partir de 1024)

```
┌────────┬──────────────────────────────────────────┐
│Sidebar │ Topbar 64px  z-header   surface-raised   │
│ 264px  ├──────────────────────────────────────────┤
│        │                                          │
│surface │  conteúdo · padding space-8              │
│-brand  │  max-width size-content-max (1280px)     │
│        │  vão de seção space-6                    │
│ z-     │                                          │
│ header │  surface-canvas                          │
└────────┴──────────────────────────────────────────┘
```

- A sidebar é `surface-brand` (navy) com rótulos `content-on-brand` (branco). O
  item ativo recebe `surface-brand-hover` mais uma **barra `border-accent` de 3px
  na borda esquerda**.
- A topbar é `surface-raised` com borda inferior `border-default`.
- O conteúdo é `surface-canvas` (off-white quente); os cards sobre ele são
  `surface-raised` (branco). É esse contraste que torna um painel denso legível.
- Abaixo de 1024px a sidebar colapsa para `size-sidebar-collapsed`; abaixo de
  768px ela vira um drawer sobre `surface-scrim`.

### Breakpoints

| Nome | Mínimo | Comportamento |
| --- | --- | --- |
| `sm` | 640px | App segue em coluna única; admin em navegação por drawer |
| `md` | 768px | Admin: sidebar colapsada só com ícones, grade de KPI 2 colunas |
| `lg` | 1024px | Admin: sidebar cheia, grade de KPI 3 colunas, tabela com todas as colunas |
| `xl` | 1280px | Conteúdo chega ao teto; sobra vira margem |
| `2xl` | 1536px | Só margem — o comprimento de linha nunca cresce |

Largura extra compra margem, nunca comprimento de linha.

## Densidade

| | App | Admin |
| --- | --- | --- |
| Altura de linha | 64–72px | 48px (40px compacto) |
| Padding de célula | `space-4` | `space-3` |
| Tamanho de corpo | `body-lg` / `body` | `body` / `body-sm` |
| Padding de card | `space-4`–`space-5` | `space-5` |
| Entre cards | `space-4` | `space-6` |

## Elevação

O app é escuro, então **elevação é passo de superfície mais borda de 1px**, não
sombra — sombra é quase invisível sobre navy.

| Nível | App | Admin |
| --- | --- | --- |
| 0 | `surface-canvas` | `surface-canvas` |
| 1 | `surface-raised` + `border-default` | `surface-raised` + `shadow-sm` |
| 2 | `surface-raised` + `shadow-md` | `surface-raised` + `shadow-md` |
| 3 | `surface-overlay` + `shadow-lg` + `surface-scrim` | igual |

`shadow-accent` é o único brilho que este sistema permite: um CTA primário em
repouso. Nunca em texto, nunca em card.

## Z-index

`z-base` 0 · `z-sticky` 10 · `z-header` 20 · `z-tabbar` 30 · `z-dropdown` 40 ·
`z-scrim` 50 · `z-overlay` 60 · `z-toast` 70.

Toasts ficam acima de modais de propósito — uma confirmação de salvamento precisa
ser visível de dentro de um diálogo.
