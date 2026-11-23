# Guia do Claude Code

Como operar o Claude Code dentro deste design system, em três repositórios
(backend/admin, app, pacote de tokens) sem que ele invente cor, tamanho ou
componente.

A ideia central: **o Claude Code não decide design.** Ele lê `tokens.json`,
obedece ao `CLAUDE.md` e falha o lint se escapar. Design é decidido aqui, uma vez.

---

## 1. Travando a stack

Cole isto no início de qualquer sessão nova, ou deixe no `CLAUDE.md`:

```
Stack fechada, não proponha alternativas:
- Backend + Admin: Laravel 13 (PHP 8.3+), PostgreSQL, Vite, Tailwind,
  Blade + Livewire  [ou: Inertia + React]
- App: Expo (React Native) + NativeWind v4 + Expo Router + Reanimated
- Ícones: Lucide (lucide-react no admin, lucide-react-native no app)
- Design system: Ensign. tokens.json é a fonte da verdade.
```

Sem isso o Claude Code sugere styled-components, shadcn do zero, ou um segundo
sistema de cor. Com isso ele vai direto ao ponto.

---

## 2. O `CLAUDE.md` do projeto

Um por repositório, na raiz. Este é o arquivo que mais economiza tempo — ele
elimina a necessidade de repetir regras em cada prompt.

```md
# Ensign — regras de UI

## Fonte da verdade
`design-system/tokens.json`. Toda cor, espaçamento, raio, tipo, duração e
easing vem dele. Para gerar o CSS/preset: `npm run ds:build`.
Nunca edite `ensign-theme.css`, `tokens.ts` nem o preset à mão — são gerados.

## Proibido (falha no lint, falha no review)
- Hex, rgb(), hsl() em qualquer arquivo de componente, Blade, template ou estilo.
- Nome de rampa primitiva no produto: navy-*, champagne-*, sunflare-*, sand-*.
- `text-white` ou `color: #fff` sobre surface-accent / bg amarelo.
  Use `content-on-accent`. Branco sobre #FFCF14 é 1,48:1.
- Valor arbitrário de Tailwind em cor, espaço, raio ou fonte:
  `p-[13px]`, `text-[15px]`, `bg-[#1B2340]`, `rounded-[10px]`.
  Espaço e tipo vêm da escala; se falta um passo, discuta antes de inventar.
- `outline: none` sem substituir o indicador de foco.
- Criar um componente novo quando já existe um no design system.
- Emoji em UI.

## Obrigatório
- Tokens semânticos: surface-*, content-*, border-*, action-*, feedback-*,
  status-*, chart-*.
- Raios semânticos: rounded-card, rounded-control, rounded-button.
- Tudo tocável com no mínimo 44px (size-touch).
- Botão só de ícone com aria-label (web) / accessibilityLabel (RN).
- Número em coluna com a classe `numeric` + tabular-nums.
- Todo elemento interativo é `<button>`, `<a href>` ou `<input>` + `<label>`.
  Nunca onClick em div ou span.
- Toda tela tem estado vazio, de carregamento e de erro.
- Texto em pt-BR, segunda pessoa, botão como verbo.

## Tema
Admin: `data-theme="admin"` no <html>. App: tema `app` (padrão).
`surface-brand` é navy nos dois temas — sidebar e topbar do admin não invertem.

## Antes de criar qualquer componente
Leia `design-system/README.md` e a seção relevante. Se o componente existe,
use; se precisa de uma variante, estenda-o — não faça um paralelo.

## Ao terminar
Rode `npm run ds:lint` e `npm run lint`. Não considere pronto com lint vermelho.
```

---

## 3. Ordem de construção

Não peça tudo de uma vez. Cada fase entrega algo testável, e cada uma depende da
anterior.

| Fase | Entrega | Pronto quando |
| --- | --- | --- |
| **0** | `tokens.json` + gerador + `CLAUDE.md` | `npm run ds:build` produz CSS e preset; lint passa |
| **1** | Átomos: Button, Input, Select, Textarea, Checkbox, Badge, StatusPill, Typography | Todos os estados existem: default, hover, focus, active, disabled, loading, error |
| **2** | Navegação: AppHeader, BottomTabBar (app); Sidebar, Topbar (admin) | A navegação funciona nas duas superfícies, item ativo marcado |
| **3** | Dados: ListCard, FeatureCard, KPICard, DataTable | Tabela com busca, filtro, ordenação, paginação, ações de linha |
| **4** | Sobreposição: Modal, BottomSheet, Drawer, Toast, Popover | Foco preso no overlay, Esc fecha, scrim clicável |
| **5** | Telas reais, montadas só com o que veio das fases 1–4 | Nenhum componente novo foi necessário |

Pular a fase 1 é o erro clássico: as telas saem bonitas e cada uma com um botão
diferente.

---

## 4. Prompts por fase

Os prompts abaixo assumem que o `CLAUDE.md` já está no lugar — por isso são
curtos. Repetir as regras no prompt é desperdício; elas já estão lidas.

### Fase 0 — fundação

```
Leia design-system/tokens.json e design-system/README.md.

Gere:
1. scripts/build-design-system.mjs — lê tokens.json e emite:
   - resources/css/ensign-theme.css: :root/[data-theme="app"] e
     [data-theme="admin"], as classes dos 19 estilos de texto, os raios
     semânticos por tema, a receita de foco de dois anéis e o bloco de
     prefers-reduced-motion.
   - design-system/tailwind-preset.js: cores, espaços, raios, fontSize,
     durações e easings mapeados para nomes SEMÂNTICOS.
   - design-system/tokens.ts: o mesmo em TypeScript, com tipos, para RN.
2. scripts/lint-design-system.mjs — falha se encontrar hex, rgb()/hsl(),
   nome de rampa primitiva, valor arbitrário de Tailwind em cor/espaço/raio/
   fonte, ou text-white junto de surface-accent. Deve ignorar os arquivos
   gerados e tokens.json.
3. Os scripts ds:build e ds:lint no package.json.

Pare depois disso e espere meu "continue".
```

### Fase 1 — átomos

```
Fase 1: componentes atômicos para [Blade+Livewire / React].

Usando SOMENTE tokens semânticos:
- Button: variantes primary, secondary, ghost, danger; tamanhos sm, md, lg;
  estados hover, focus-visible, active, disabled, loading (largura travada).
- Input, Select, Textarea: com rótulo, texto de ajuda, estado de erro com
  aria-describedby, e a receita de foco de dois anéis.
- Checkbox e Radio com borda border-strong.
- Badge e StatusPill: ativo, pendente, cancelado, neutro — sempre com rótulo.
- Typography: as classes/componentes dos 19 estilos.

Um arquivo por componente. Pare após o Button e espere meu "continue".
```

O **"pare e espere"** é o que evita o `// adicione o resto aqui`. Em código longo,
o Claude Code resume quando tenta entregar tudo numa resposta.

### Fase 3 — DataTable

```
Fase 3: DataTable do admin.

Requisitos:
- Cabeçalho surface-secondary-soft + overline, sticky em z-sticky.
- Zebra, hover surface-raised-hover.
- Dinheiro e contagem à direita com a classe numeric + tabular-nums.
- Coluna de status com StatusPill (fase 1).
- Barra de filtros em UMA linha acima: busca, filtros, densidade, exportar.
- Ordenação por <button> no <th> com aria-sort.
- Menu de ações por linha, alvo de 44px, abertura com scale-in.
- Seleção múltipla com barra de ação em massa.
- Paginação "41-60 de 338".
- Estado vazio e skeleton de carregamento.
- Abaixo de lg, colunas secundárias colapsam em linha de detalhe.

Dados vêm por prop/slot; o componente não busca nada.
```

### Fase 5 — telas

```
Monte a tela [X] usando SOMENTE os componentes das fases 1-4.
Se faltar algo, PARE e me diga o que falta antes de criar um componente novo.
```

Essa última frase é a mais útil do guia inteiro. Sem ela, uma tela ganha um
"card especial" que vira o décimo quarto estilo de card do projeto.

---

## 5. Comandos (`.claude/commands/`)

Slash commands economizam repetição. Um arquivo `.md` por comando.

**`.claude/commands/ds-check.md`**

```md
Audite os arquivos alterados contra o Ensign:
1. Hex, rgb(), hsl() fora dos gerados.
2. Nome de rampa primitiva no produto.
3. text-white / #fff sobre surface-accent.
4. Valor arbitrário de Tailwind em cor, espaço, raio ou fonte.
5. Tocáveis abaixo de 44px.
6. Botão de ícone sem rótulo acessível.
7. onClick em div/span.
8. outline:none sem indicador substituto.
9. Mais de um surface-accent na mesma região de tela.
10. Número em coluna sem tabular-nums.

Liste arquivo:linha e a correção. Não altere nada ainda.
```

**`.claude/commands/ds-novo-componente.md`**

```md
Antes de criar o componente $ARGUMENTS:
1. Confirme que ele não existe no design system.
2. Diga de quais tokens semânticos ele vai depender.
3. Liste os estados que ele precisa ter.
4. Diga em qual fase ele entra.
Só então escreva o código.
```

---

## 6. Lint: as cinco regras que pegam 90%

```js
// scripts/lint-design-system.mjs — o essencial
const REGRAS = [
  { nome: 'hex-solto',
    re: /#[0-9a-fA-F]{3,8}\b/,
    msg: 'Hex no código. Use um token semântico.' },
  { nome: 'funcao-de-cor',
    re: /\b(rgba?|hsla?)\s*\(/,
    msg: 'Função de cor no código. Use um token semântico.' },
  { nome: 'rampa-primitiva',
    re: /\b(navy|champagne|sunflare|sand)-(?:\d{2,3})\b/,
    msg: 'Rampa primitiva no produto. Use surface-*/content-*/border-*.' },
  { nome: 'branco-no-amarelo',
    re: /(surface-accent|action-primary-bg)[^\n]*\b(text-white|#fff)\b/i,
    msg: 'Branco sobre amarelo: 1,48:1. Use content-on-accent.' },
  { nome: 'valor-arbitrario',
    re: /\b(?:bg|text|border|p|px|py|pt|pb|pl|pr|m|gap|rounded|w|h)-\[/,
    msg: 'Valor arbitrário. Use a escala.' },
];
```

Ignore: `tokens.json`, `ensign-theme.css`, `tailwind-preset.js`, `tokens.ts`,
`node_modules`, `vendor`, `dist`, e a pasta do design system.

Rode no pre-commit e no CI. Lint que não roda automático não existe.

---

## 7. Como o Claude Code deve ler o design system

Quando o sistema estiver publicado, a leitura é sempre nesta ordem:

1. `project/README.md` — o brand book, e o que ler depois.
2. `project/tokens.json` — os valores.
3. A seção da superfície em que ele está trabalhando (app ou admin).
4. `project/components/<Comp>/README.md` — antes de usar um componente.

**Nunca** adivinhe um valor que não leu. Se um token não existe para o que a tela
precisa, a resposta certa é dizer isso, não inventar um hex próximo.

---

## 8. Erros recorrentes, e a correção

| O que o Claude Code faz | Correção |
| --- | --- |
| Usa `text-white` no botão amarelo | `content-on-accent` no `CLAUDE.md` + regra de lint |
| Inventa `#1E2847` "próximo do navy" | Regra de hex solto; dizer "use um token existente ou pare e pergunte" |
| Resume código longo com `// resto aqui` | "Pare após o componente X e espere meu continue" |
| Cria um card novo por tela | "Se faltar algo, PARE e me diga antes de criar" |
| Põe `p-[13px]` | Regra de valor arbitrário |
| Usa `div` com `onClick` | Regra de elemento interativo real |
| Pinta o item ativo da sidebar de amarelo | A barra `border-accent` de 3px é o indicador, não o fundo |
| Põe três botões amarelos na tela | "Um `surface-accent` por região de tela" |
| Aplica o mesmo raio nas duas superfícies | Raios semânticos; o tema decide |
| Esquece o padding inferior da tab bar | Está no checklist da seção do app |

---

## 9. Ciclo de trabalho

```
1. Escolha a fase. Uma por vez.
2. Prompt curto; o CLAUDE.md carrega as regras.
3. "Pare após X e espere continue" em qualquer coisa longa.
4. Rode /ds-check nos arquivos alterados.
5. npm run ds:lint && npm run lint
6. Revise na tela: contraste, foco por teclado, 390px e 1440px.
7. Commit por fase, não por arquivo.
```

## 10. Quando o design system precisa mudar

Mudança de design não acontece no código do produto. Acontece aqui, nesta ordem:

1. Decida o token (nome, valor nos dois temas, nota de uso).
2. **Meça o contraste** contra cada superfície que ele vai encontrar — 4,5:1 para
   texto, 3:1 para borda funcional, anel de foco e ícone.
3. Adicione em `tokens.json`.
4. `npm run ds:build` nos repositórios.
5. Só então use nos componentes.

Um token que entrou sem medição é um bug esperando um relatório de
acessibilidade.
