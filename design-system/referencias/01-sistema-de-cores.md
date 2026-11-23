# Sistema de cores

Três cores de marca, quatro rampas primitivas, dois temas escolhidos e uma camada
semântica que é a única coisa que o código do produto toca.

## 1. As rampas (primitivos)

Cada rampa é perceptualmente uniforme — gerada em OKLCH, mantendo o matiz da base,
com o croma atingindo o pico nos tons médios. **Primitivos nunca entram no código
do produto.**

**Navy** — a âncora da marca. Os passos 800/900/950 são valores fixos da marca.

| 50 | 100 | 200 | 300 | 400 | 500 |
| --- | --- | --- | --- | --- | --- |
| `#F5F7FC` | `#E9EDF7` | `#D5DBED` | `#BCC4DD` | `#9EA8C7` | `#818DAF` |

| 600 | 700 | 800 | 900 | 950 | 975 |
| --- | --- | --- | --- | --- | --- |
| `#646F91` | `#495475` | `#263159` | `#1B2340` | `#12172B` | `#0C122B` |

`navy-800` é o passo elevado / de hover de card, `navy-900` é o próprio Ensign
Navy, `navy-950` é o fundo profundo e `navy-975` o mais profundo.

**Champagne** — base no passo 200.

| 50 | 100 | 200 | 300 | 400 | 500 |
| --- | --- | --- | --- | --- | --- |
| `#F8F4EC` | `#EAE3D4` | `#D8CBB0` | `#C3B597` | `#AC9D7E` | `#938566` |

| 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- |
| `#796C51` | `#5F543C` | `#473D29` | `#312919` | `#1F190C` |

**Sunflare** — base no passo 500.

| 50 | 100 | 200 | 300 | 400 | 500 |
| --- | --- | --- | --- | --- | --- |
| `#FFFAEA` | `#FFF2CC` | `#FFE8A6` | `#FFDE7A` | `#FFD758` | `#FFCF14` |

| 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- |
| `#DCB209` | `#B29002` | `#876D08` | `#614D05` | `#423400` |

**Sand** — o neutro quente que o admin precisa. Derivado do matiz do Champagne
para o tema claro nunca ficar frio. `sand-100` é `#F7F5F0`.

| 50 | 100 | 200 | 300 | 400 | 500 |
| --- | --- | --- | --- | --- | --- |
| `#FEFDFB` | `#F7F5F0` | `#EFEDE6` | `#E3E0D8` | `#D5D1C7` | `#BFBAAF` |

## 2. Onde o orçamento é gasto

| | App (escuro) | Admin (claro) |
| --- | --- | --- |
| **60% Navy** | canvas, headers, tab bar, cards | sidebar, topbar, cabeçalho de tabela, modo escuro |
| **30% Champagne** | texto secundário, bordas, faixas suaves, cards de promoção invertidos | borda de card de KPI, faixas de seção, divisores, tinta do cabeçalho de tabela |
| **10% Sunflare** | CTA primário, aba ativa, badge de promoção, estado selecionado | botão "+ Novo", barra lateral do item ativo, seleção, acento principal de gráfico |

Cota aproximada por tela:

- **um** preenchimento `surface-accent` na viewport principal (mais o indicador de
  navegação ativo, que é navegação, não ação);
- **um ou dois** blocos invertidos `surface-secondary`;
- todo o resto: canvas, superfícies elevadas e texto.

## 3. Camadas semânticas

### Surface — o chão onde as coisas pousam

```
surface-canvas          a página. OS 60%.
surface-deep            recua atrás dela (cromo do app, poços do admin)
surface-sunken          o mais profundo (atrás de um sheet, poço de tabela)
surface-raised          cards, linhas, inputs, popovers
surface-raised-hover    hover/press do acima
surface-overlay         modal, sheet, drawer
surface-scrim           o fundo (70% app / 65% admin — nunca preto puro)
surface-brand           NAVY NOS DOIS TEMAS — sidebar do admin, header do app
surface-brand-strong    navy mais profundo, dois temas
surface-brand-hover     hover dentro de uma região de marca
surface-secondary       Champagne em força máxima: o card invertido
surface-secondary-soft  os 30% calmos: faixas, cabeçalho de tabela, agrupamento
surface-accent          preenchimento Sunflare: CTA, indicador ativo
surface-accent-hover    mais claro no app, mais escuro no admin
surface-accent-soft     tinta de acento: badges, linha selecionada, aviso
surface-input           interior do campo
surface-disabled        fundo de controle desabilitado
surface-chart           o fundo de plotagem (MAIS profundo que raised, no app)
```

O fato de `surface-brand` não inverter é o mecanismo que mantém o admin na marca:
uma sidebar navy contra uma área de conteúdo off-white quente, dentro de um tema
claro.

`surface-chart` é mais profundo que `surface-raised` no app de propósito — as seis
séries validadas precisam de um fundo escuro o suficiente para passar 3:1. **Não
plote sobre `surface-canvas`.**

### Content — texto e ícones

```
content-primary       títulos, corpo               11,2:1+ em toda superfície
content-secondary     subtítulos, metadados         6,4:1+  (Champagne como texto)
content-muted         legendas, rótulos de eixo     4,5:1+  até em raised-hover
content-disabled      só rótulos desabilitados      ~3:1    nunca conteúdo real
content-inverse       texto sobre fundo invertido
content-accent        texto e ícones de acento      app: Sunflare / admin: #826906
content-on-accent     SEMPRE NAVY sobre amarelo     10,42:1
content-on-secondary  SEMPRE NAVY sobre champagne   9,62:1
content-on-brand      BRANCO nos dois temas         12,6:1 sobre navy-800
content-link          links em linha — sublinhe
```

`content-accent` **não** é Sunflare no admin. Sunflare sobre branco dá 1,48:1; o
valor do admin é um dourado escurecido `#826906`, a 4,5:1. No claro, Sunflare
continua sendo cor de *preenchimento*, nunca cor de texto.

### Border — e a linha dos 3:1

```
border-subtle         só decorativo (régua de lista, linha interna de card)
border-default        borda de contêiner
border-strong         FUNCIONAL, ≥3:1 — inputs, checkbox, segmented, eixos
border-focus          anel de foco interno (Sunflare, dois temas)
border-focus-outline  anel de foco externo — o que dá contraste ao indicador
border-accent         a barra de 3px de seleção
border-inverse        borda em fundo invertido; vão entre preenchimentos
```

Se a borda comunica estado ou delimita um controle, ela é `border-strong`.
`border-subtle` e `border-default` estão abaixo de 3:1 por design e nunca podem
ser a única coisa marcando uma borda interativa.

### Action, feedback, status

`action-*` cobre as quatro variantes de botão (primary, secondary, ghost, danger)
com fundo, hover, active e cor de texto todos nomeados — então um botão se escreve
sem um único hex.

`feedback-*` e `status-*` entregam trios **fg / bg / border** por estado. Cada um
deles vem com ícone e rótulo em texto; a cor nunca carrega o estado sozinha.

Repare que o Sunflare acumula o papel de **aviso**. Mantenha os dois separados por
*forma e posição*: ação é um controle preenchido, em pílula ou raio de 6px, que se
pode pressionar; aviso é uma faixa tingida (`surface-accent-soft` /
`feedback-warning-bg`) com ícone e sem affordance de clique. Nunca coloque um
banner de aviso e um CTA primário lado a lado na mesma tinta.

## 4. Receita de tema

```css
:root, [data-theme="app"] { /* valores do app */ }
[data-theme="admin"]      { /* sobrescritas do admin */ }
```

`app` é o primeiro tema, logo também é o fallback: um token sem valor de admin
herda o do app. Mantenha os dois preenchidos.

Os três **raios semânticos** são os únicos tokens que mudam por tema fora de
`color` e `shadow`, e mudam no CSS, não no `tokens.json`:

```css
:root, [data-theme="app"] {
  --radius-card: 16px;  --radius-control: 12px;  --radius-button: 9999px;
}
[data-theme="admin"] {
  --radius-card: 8px;   --radius-control: 8px;   --radius-button: 6px;
}
```

Esse único bloco é toda a diferença de personalidade: o app é amigável e em
pílula, o admin é justo e técnico.

## 5. Checagens que já passaram

Medidas nos dois temas contra cada fundo que o token encontra:

| Par | Razão |
| --- | --- |
| `content-primary` / `surface-raised-hover` (app) | 11,17 |
| `content-secondary` / `surface-raised-hover` (app) | 6,96 |
| `content-muted` / `surface-raised-hover` (app) | 4,52 |
| `content-muted` / `surface-deep` (admin) | 4,51 |
| `content-on-accent` / `surface-accent-hover` (admin) | 7,65 |
| `content-on-secondary` / `champagne-300` | 7,62 |
| `border-strong` / `surface-canvas` (admin) | 3,01 |
| todo `feedback-*-fg` sobre seu próprio `-bg`, dois temas | ≥ 4,50 |
| `action-danger-fg` / `action-danger-bg-hover` | 5,00 |
| **`#FFFFFF` sobre `#FFCF14`** | **1,48 — proibido** |

## 6. Checklist de auditoria

- [ ] Nenhum hex solto fora de `tokens.json` e do arquivo de tema gerado.
- [ ] Nenhum nome de rampa primitiva (`navy-900`, `champagne-200`) no código do produto.
- [ ] Exatamente um preenchimento `surface-accent` por região de tela.
- [ ] Todo `surface-accent` com `content-on-accent` em cima.
- [ ] Toda borda interativa usando `border-strong`, não `border-default`.
- [ ] Foco visível nos dois temas; admin usando a receita de dois anéis.
- [ ] Nenhum status comunicado só por cor.
- [ ] Gráficos plotando sobre `surface-chart`.
