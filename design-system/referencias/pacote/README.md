# Ensign — pacote completo

Tudo do design system Ensign em uma pasta: os tokens, o brand book, os
componentes, os geradores, o lint, os `CLAUDE.md` e as telas do canvas.

Jogue esta pasta na raiz do projeto do Claude Code e leia o
**`INSTALAR.md`** — ele tem o passo a passo por repositório.

---

## O mapa

```
ensign/
├─ README.md                      este arquivo
├─ INSTALAR.md                    como instalar no admin e no app
│
├─ CLAUDE.admin.md                → renomeie para CLAUDE.md no repo do backend/admin
├─ CLAUDE.app.md                  → renomeie para CLAUDE.md no repo do app
├─ .claude/commands/
│  ├─ ds-check.md                 /ds-check — auditoria dos arquivos alterados
│  └─ ds-componente.md            /ds-componente <Nome> — checklist antes de criar
│
├─ design-system/                 A FONTE DA VERDADE
│  ├─ tokens.json                 ← só isto você edita
│  ├─ README.md                   brand book: as 3 cores, a regra dura, como consumir
│  ├─ 01-sistema-de-cores.md      rampas, camadas semânticas, contrastes medidos
│  ├─ 02-tipografia.md            19 estilos, 3 famílias
│  ├─ 03-layout-e-espacamento.md  grade 4px, raios por tema, densidade, z-index
│  ├─ 04-movimento.md             durações, easings, receitas, foco, reduced-motion
│  ├─ 05-graficos-e-dados.md      paleta validada, sequencial, divergente, KPI
│  ├─ 06-app-expo-nativewind.md   como os tokens aterrissam no app
│  ├─ 07-admin-laravel-inertia.md como aterrissam no painel
│  ├─ 08-guia-claude-code.md      ordem de construção, prompts por fase, erros comuns
│  ├─ design-system.json          índice do artifact
│  ├─ components/
│  │  ├─ bundle.js                window.Ensign — 14 componentes React
│  │  ├─ bundle.css               as classes, 100% em var(--token)
│  │  ├─ index.d.ts               tipos, como documentação
│  │  └─ <Componente>/            README.md (guidelines) + preview.html
│  ├─ tailwind-preset.web.js      GERADO — admin, via var(), troca de tema
│  ├─ tailwind-preset.native.js   GERADO — app, valores literais do tema app
│  └─ tokens.ts                   GERADO — os dois temas, tipado, para RN
│
├─ resources/css/
│  ├─ ensign-theme.css            GERADO — os dois data-theme, classes de texto,
│  │                              foco de dois anéis, reduced-motion, keyframes
│  └─ app.css                     ponto de entrada do admin (importa o tema)
│
├─ scripts/
│  ├─ build-design-system.mjs     tokens.json → CSS + 2 presets + tokens.ts
│  └─ lint-design-system.mjs      8 regras; falha se o código escapou do sistema
│
├─ tailwind.config.admin.js       preset web + breakpoints + keyframes
├─ tailwind.config.app.js         preset nativo + nativewind
├─ package.scripts.json           os scripts para colar no package.json
│
└─ canvas/                        REFERÊNCIA, não código de produção
   ├─ canvas.json                 layout dos artboards
   ├─ Main.dc.html                styleguide
   ├─ App-Hoje.dc.html            treino do dia
   ├─ App-Dieta.dc.html           macros + bottom sheet
   ├─ Admin-Alunos.dc.html        KPIs + gráfico + tabela
   └─ Admin-Treinos.dc.html       editor de plano + tabela + toast
```

## Comece aqui

```bash
node scripts/build-design-system.mjs    # regenera os 4 arquivos derivados
node scripts/lint-design-system.mjs     # audita o projeto
```

Depois siga o `INSTALAR.md`.

## As quatro regras que o pacote inteiro serve para garantir

1. **Nenhum hex no código do produto.** Só tokens semânticos
   (`surface-*`, `content-*`, `border-*`, `action-*`, `feedback-*`, `status-*`,
   `chart-*`). O lint acusa.
2. **Nunca branco sobre Sunflare Yellow.** `#FFFFFF` sobre `#FFCF14` é
   **1,48:1**. Use `content-on-accent` — navy, 10,42:1, nos dois temas.
3. **Um `surface-accent` por região de tela.** São os 10%.
4. **Borda funcional é `border-strong`**, não `border-default` — que está abaixo
   de 3:1 por design.

## O que é gerado e o que é editado

| Editado à mão | Gerado — não edite |
| --- | --- |
| `design-system/tokens.json` | `design-system/tailwind-preset.web.js` |
| os `.md` do brand book | `design-system/tailwind-preset.native.js` |
| `design-system/components/**` | `design-system/tokens.ts` |
| os dois `tailwind.config.*.js` | `resources/css/ensign-theme.css` |

Mudar um token: edite `tokens.json`, **meça o contraste** contra cada superfície
que ele vai encontrar, rode `ds:build`, e só então use nos componentes.

## Sobre a pasta `canvas/`

São os artboards do canvas de design. Eles usam `<x-import
component-from-global-scope="Ensign.…">` e carregam `./support.js` e
`ds/ensign/…`, que só existem dentro do artifact — **não rodam localmente**.
Servem como referência de composição: o que vai em cada tela, em que ordem, com
quais tokens. Para editar as telas de verdade, use o canvas.

## Os artifacts

- Design System — `https://claude.ai/artifact/STGHQPzyBZcSHoPdGfCdTk`
- Canvas Projeto-Fit — `https://claude.ai/artifact/J2UumeUMti6yJh6jqVevw5`

Esta pasta é um espelho do primeiro no momento do download. A fonte viva é o
artifact; se alguém editar um token lá, baixe `tokens.json` de novo e rode
`ds:build`.
