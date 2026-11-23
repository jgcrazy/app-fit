# Ensign

Um design system de duas superfícies construído sobre três cores. Um único
conjunto de tokens governa um **app mobile** escuro e imersivo e um **painel
administrativo web** claro e analítico — os mesmos componentes, os mesmos nomes,
dois temas.

O nome vem da cor primária, **Ensign Navy**. Renomeie o sistema à vontade; nada
nos tokens depende disso.

---

## As três cores, e o orçamento

| Papel | Cor | Hex | Proporção | Token |
| --- | --- | --- | --- | --- |
| Primária — dominante | Ensign Navy | `#1B2340` | 60% | `navy-900` |
| Secundária — suporte | Champagne Satin | `#D8CBB0` | 30% | `champagne-200` |
| Destaque — ação | Sunflare Yellow | `#FFCF14` | 10% | `sunflare-500` |

**60-30-10 é um orçamento, não um enfeite.** Ele é gasto assim:

- **Os 60% são o chão.** `surface-canvas` é Navy no app e um off-white quente no
  admin — mas o Navy continua segurando a identidade no admin pela sidebar e pela
  topbar (`surface-brand`, que não inverte com o tema). Navy é o que você mais vê.
- **Os 30% são Champagne Satin, e são majoritariamente TEXTO.** É a parte que
  quase toda implementação erra. O Champagne cumpre seus 30% como
  `content-secondary`, `border-strong` e `surface-secondary-soft` — grandes áreas
  calmas, não blocos bege enormes. Em força máxima (`surface-secondary`) ele é o
  card *invertido*: uma interrupção deliberada, uma ou duas vezes por tela.
- **Os 10% são Sunflare Yellow, e são escassos de propósito.** Uma ação primária
  por região de tela. O item de navegação ativo. O estado selecionado. Se uma tela
  tem dois botões amarelos competindo, um deles está errado.

Jeito rápido de auditar uma tela: aperte os olhos. Você deve ver um campo navy,
algumas zonas quentes e calmas, e **um** ponto brilhante puxando o olhar. Se
houver três pontos brilhantes, os 10% estouraram.

---

## A regra dura

**Texto branco nunca fica sobre Sunflare Yellow.** `#FFFFFF` sobre `#FFCF14` mede
**1,48:1** — é ilegível, e é o erro mais provável em um sistema com acento
amarelo.

Qualquer coisa sobre `surface-accent` usa **`content-on-accent`**, que é Navy nos
dois temas, a 10,42:1. O token existe justamente para ninguém precisar lembrar da
regra.

```
ERRADO   background: var(--surface-accent); color: #fff;
CERTO    background: var(--surface-accent); color: var(--content-on-accent);
```

O mesmo vale para o Champagne: texto sobre `surface-secondary` usa
`content-on-secondary` (Navy, 9,62:1).

---

## Como usar este sistema

Leia nesta ordem:

1. **`tokens.json`** — a fonte da verdade. Todas as cores, estilos de texto,
   espaçamentos, raios, sombras, durações, easings, opacidades, z-index e
   tamanhos.
2. **Sistema de cores** — a arquitetura 60-30-10, as camadas semânticas e as
   garantias de contraste de cada token.
3. **Tipografia**, **Layout e espaçamento**, **Movimento**, **Gráficos e dados**
   — o resto das fundações.
4. **App (Expo / NativeWind)** e **Admin (Laravel / Inertia)** — como os mesmos
   tokens aterrissam em cada superfície.
5. **Guia do Claude Code** — o manual de operação: regras de projeto, ordem de
   construção e os prompts que mantêm o código gerado dentro do sistema.

### Camadas de token

Nunca pule uma camada.

```
PRIMITIVOS          navy-900 · champagne-200 · sunflare-500 · sand-100
  (rampas 50-950)   ↓ usados só por este sistema, nunca pelo código do produto
SEMÂNTICOS          surface-canvas · content-primary · border-strong
  (dois temas)      ↓ é isto que você escreve nos componentes
COMPONENTES         Button, Input, KPICard, DataTable, …
```

O código do produto usa a camada **semântica**. Um hex solto em um componente, ou
um `navy-900` em um template, é defeito — veja as regras de lint no guia do Claude
Code.

### Temas

`tokens.json` define dois: **`app`** (primeiro, logo o fallback) e **`admin`**.
Eles são *escolhidos*, não invertidos — cada valor foi selecionado e conferido em
contraste contra os próprios fundos.

```html
<html data-theme="app">    <!-- raiz do Expo / React Native -->
<html data-theme="admin">  <!-- layout do admin em Laravel -->
```

Dentro do admin, uma região `surface-brand` (sidebar, topbar) é navy com texto
branco e **não** precisa trocar de tema — `content-on-brand` é branco nos dois
temas exatamente por isso.

### Fontes

Três famílias, todas disponíveis no Google Fonts; nenhum binário acompanha este
sistema.

| Família | Chave | Onde |
| --- | --- | --- |
| Plus Jakarta Sans | `display` | Display e títulos — geométrica, carrega a marca |
| Inter | `sans` | Corpo, rótulos, tabelas, números — legível a 11px |
| JetBrains Mono | `mono` | IDs, SKUs, payloads |

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
```

No Expo, carregue com `expo-font`; a chamada está na seção do Expo.

---

## Fundamentos de conteúdo

O produto fala **português do Brasil**, na segunda pessoa, curto.

| Faça | Não faça |
| --- | --- |
| "Confirmar pedido" | "Clique aqui para confirmar o seu pedido" |
| "Não foi possível salvar. Tente de novo." | "Erro 500: internal server error" |
| "3 pedidos pendentes" | "Você possui um total de 3 (três) pedidos pendentes" |
| "Pendente" | "AGUARDANDO APROVAÇÃO DO SISTEMA" |

- **Botão é verbo.** "Salvar", "Criar pedido", "Adicionar item" — nunca "OK" nem
  "Enviar" quando existe verbo melhor.
- **Erro diz o próximo passo.** Diga o problema, depois a saída.
- **Número é sempre formatado.** `R$ 1.234,56`, datas em `pt-BR`, e
  `font-variant-numeric: tabular-nums` sempre que números empilharem em coluna.
- **Estado vazio não é erro.** Um título, uma frase, uma ação.
- **Cor nunca carrega significado sozinha.** Pílula de status tem rótulo; série de
  gráfico tem rótulo direto ou entrada de legenda.

## Iconografia

**Lucide** (ou Phosphor), traço `size-stroke-icon` = **1,75px**, indo a 2px a
partir de 24px. Os tamanhos vêm de `size-icon-sm | md | lg` (16 / 20 / 24px).

- Ícone herda `currentColor` — nunca fixe a cor de um ícone.
- Botão só de ícone precisa de `aria-label`; ícone decorativo precisa de
  `aria-hidden="true"`.
- Dois estilos nunca se misturam na mesma tela. Escolha Lucide e fique nele.
- Ícone nunca substitui rótulo na bottom tab bar nem no menu de ações de tabela.

## Garantias de acessibilidade

Todo par de tokens citado em uma nota de uso foi medido, nos dois temas, contra
cada superfície que o token realmente encontra:

- Texto corrido ≥ **4,5:1**; texto a partir de 24px, bordas funcionais, anéis de
  foco e ícones ≥ **3:1**.
- `content-muted` passa 4,5:1 até sobre `surface-raised-hover`, o fundo mais
  difícil que ele encontra.
- `border-strong` — não `border-default` — é o token de tudo que o usuário precisa
  perceber: borda de input, contorno de checkbox, eixo de gráfico.
- Foco é um indicador de **dois anéis** no admin, porque Sunflare sobre branco dá
  1,48:1 isolado. A receita está na seção Movimento.
- As seis séries de gráfico passam faixa de luminosidade, piso de croma, separação
  para deficiência de visão de cores e contraste de superfície nos **dois** temas;
  os slots 1–3 passam ainda a separação all-pairs, então gráficos de dispersão e
  bolha ficam limitados a três séries.
- Áreas de toque ≥ **44px** (`size-touch`), inclusive botões de ícone do admin.

---

## Consumindo este sistema

| | Valor |
| --- | --- |
| Namespace / global do bundle | **`window.Ensign`** |
| Bundle | `components/bundle.js` (script clássico, usa `window.React` 18) |
| Folha dos componentes | `components/bundle.css` |
| Tipos | `components/index.d.ts` |
| Tokens | `tokens.json` |

O `bundle.css` e os componentes leem as **custom properties** dos tokens
(`var(--surface-canvas)`, `var(--radius-card)`, …). Então o tema precisa estar
carregado **antes** dele, em qualquer superfície.

### Ordem de carregamento

```
1. o tema       as custom properties dos tokens (tokens.css gerado, ou
                ensign-theme.css gerado por scripts/build-design-system.mjs)
2. bundle.css   as classes dos componentes
3. bundle.js    define window.Ensign
```

React 18 (`window.React`, `window.ReactDOM`) tem que existir antes do
`bundle.js`. O bundle **não** traz React.

### Por superfície

- **Admin (Laravel 13 + Vite):** gere `ensign-theme.css` a partir de
  `tokens.json`, importe-o antes das diretivas do Tailwind, e ponha
  `data-theme="admin"` no `<html>`. Os componentes podem vir do bundle ou ser
  reescritos como componentes Blade/Livewire — os tokens são os mesmos.
- **App (Expo + NativeWind):** o React Native não resolve `var()` como o
  navegador; use o preset nativo gerado, que traz os valores do tema `app`
  literais. `tokens.ts` expõe os dois temas caso o app ganhe tema claro.
- **Canvas de design:** copie `tokens.json`, `components/bundle.css` e
  `components/bundle.js` para `ds/ensign/`, carregue o tema primeiro e monte os
  componentes reais por `Ensign.<Componente>` em vez de recriá-los em markup.

### Dois temas

`app` é o primeiro tema, logo o fallback. Troque com `data-theme`:

```html
<html data-theme="app">    <!-- escuro, imersivo -->
<html data-theme="admin">  <!-- claro, analítico -->
```

Os três raios semânticos (`--radius-card`, `--radius-control`,
`--radius-button`) mudam por tema no CSS, não no `tokens.json` — é o único
bloco que separa a personalidade das duas superfícies.

### Regra para quem consome

Leia o valor do token; não adivinhe. Um hex que você não leu de `tokens.json` é
um palpite, e o lint do pacote de código o acusa.
