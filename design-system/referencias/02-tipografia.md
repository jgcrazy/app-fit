# Tipografia

Duas fontes, uma função cada. **Plus Jakarta Sans** é geométrica e levemente
peculiar — carrega a marca em tudo que é grande. **Inter** é implacavelmente
legível em tamanhos pequenos e tem algarismos tabulares de verdade — carrega cada
linha de tabela, rótulo e marca de eixo. **JetBrains Mono** cuida dos
identificadores.

Dezenove estilos, seis grupos. Se um layout precisa do vigésimo, provavelmente
precisa de um que já existe.

## Display — família `display`, Plus Jakarta Sans

| Estilo | Tam. / linha | Peso | Tracking | Uso |
| --- | --- | --- | --- | --- |
| `display-xl` | 40 / 44 | 700 | −0,02em | Número de destaque do app, onboarding, login. Um por tela. |
| `display-lg` | 32 / 38 | 700 | −0,02em | Título de tela do app, título de página do admin. |
| `display-md` | 28 / 34 | 700 | −0,01em | Abertura de seção, título de estado vazio. |

O tracking negativo importa nesses tamanhos: a Plus Jakarta Sans compõe folgada
por padrão e fica mole sem isso.

## Heading — família `display`

| Estilo | Tam. / linha | Peso | Uso |
| --- | --- | --- | --- |
| `h1` | 24 / 30 | 700 | Maior título dentro do conteúdo. |
| `h2` | 20 / 26 | 700 | Título de card e de modal, cabeçalho de painel do admin. |
| `h3` | 18 / 24 | 600 | Subseções, grupos de lista, título de card de KPI. |
| `h4` | 16 / 22 | 600 | Legenda de fieldset, linha de grupo em tabela. |

## Body — família `sans`, Inter

| Estilo | Tam. / linha | Peso | Uso |
| --- | --- | --- | --- |
| `body-lg` | 17 / 26 | 400 | Tamanho principal de leitura no app. |
| `body` | 15 / 22 | 400 | Padrão em todo lugar; parágrafo e célula de tabela do admin. |
| `body-sm` | 13 / 19 | 400 | Texto denso do admin, texto de ajuda, metadado de lista. |
| `body-strong` | 15 / 22 | 600 | Ênfase dentro do texto corrido. |

Ênfase é **peso**, não cor. `content-accent` em um trecho de texto corrido se lê
como um link que não funciona.

## Label — família `sans`

| Estilo | Tam. / linha | Peso | Tracking | Uso |
| --- | --- | --- | --- | --- |
| `label` | 13 / 16 | 600 | — | Rótulo de formulário, texto de botão md, rótulo de aba. |
| `label-sm` | 12 / 15 | 600 | — | Badges, pílulas de status, rótulos da tab bar, chips. |
| `overline` | 11 / 14 | 700 | 0,08em | Rótulos sobrescritos e cabeçalhos de coluna. |

`overline` vai em caixa alta pelo CSS (`text-transform: uppercase`), nunca
digitando maiúsculas no conteúdo. A 11px ele nunca pode ser pareado com
`content-muted` — use `content-secondary`, que ainda passa 4,5:1.

## Numeric — família `sans`

| Estilo | Tam. / linha | Peso | Algarismos | Uso |
| --- | --- | --- | --- | --- |
| `metric-xl` | 32 / 36 | 700 | proporcionais | Valor de KPI, número de destaque. |
| `metric` | 20 / 24 | 700 | proporcionais | Total do pedido, valor do carrinho. |
| `numeric` | 15 / 20 | 500 | **tabulares** | Célula de tabela, marca de eixo, linha de nota. |

A regra: **número isolado usa algarismos proporcionais; número em coluna usa
tabulares.** `numeric` é o único estilo que carrega
`font-variant-numeric: tabular-nums`, e carrega porque dígito desalinhado em
tabela é defeito de verdade.

```css
.numeric { font-variant-numeric: tabular-nums; }
```

No React Native: `fontVariant: ['tabular-nums']`.

## Code — família `mono`

| Estilo | Tam. / linha | Uso |
| --- | --- | --- |
| `code` | 13 / 20 | IDs, SKUs, códigos de rastreio, payloads. |
| `code-sm` | 12 / 18 | Identificadores em linha dentro de células. |

## Combinações que funcionam

| Contexto | Pilha |
| --- | --- |
| Tela do app | título `display-lg`, texto `body-lg`, chips `label-sm` |
| Linha de lista do app | `body-strong` primário, `body-sm` + `content-muted` secundário, `numeric` no valor |
| Card de KPI | rótulo `overline`, valor `metric-xl`, variação `body-sm` |
| Tabela do admin | cabeçalho `overline`, células `body`, `numeric` em dinheiro e contagem |
| Formulário do admin | `label` acima do campo, `body` dentro, `body-sm` de ajuda, `body-sm` de erro |
| Modal | título `h2`, texto `body`, botões `label` |

## Regras

- **Comprimento de linha** de 60 a 75 caracteres. A coluna de conteúdo do admin é
  limitada por `size-content-max` (1280px) e o texto corrido dentro dela é
  limitado de novo, mais estreito.
- **Nunca** escale um estilo com transform nem com um font-size arbitrário. Se não
  está na tabela, não existe.
- **Nunca** centralize mais do que um título e uma linha.
- **O peso carrega a hierarquia** antes do tamanho: prefira `body-strong` a `h4`
  para uma ênfase em linha.
- As três famílias carregam com `display=swap`, e a pilha de sistema atrás de cada
  uma é um fallback real — o layout não pode pular quando a webfont chega.

## Carregamento

**Web (admin):**

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
```

**Expo:**

```ts
import { useFonts } from 'expo-font';
import { PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';

const [pronto] = useFonts({
  PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold,
  Inter_400Regular, Inter_500Medium, Inter_600SemiBold,
});
```

Mantenha os pesos carregados na lista acima — 500/600/700 para display, 400/500/600
para corpo. Cada peso extra é byte em conexão móvel por uma diferença que ninguém
vê.
