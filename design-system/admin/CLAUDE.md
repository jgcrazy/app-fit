# Ensign — regras de UI (Admin · Laravel 13 + PostgreSQL)

Renomeie para `CLAUDE.md` na raiz do repositório do backend/admin.

## Stack fechada — não proponha alternativas

- Laravel 13 (PHP 8.3+), PostgreSQL, Vite, Tailwind
- Blade + Livewire  *(ou Inertia + React — escolha uma e apague a outra linha)*
- Ícones: Lucide (`lucide-react` / blade-ui-kit)
- Design system: **Ensign**

## Fonte da verdade

`design-system/tokens.json`. Toda cor, espaçamento, raio, tipo, duração e easing
vem dele.

```
npm run ds:build    # regenera CSS, preset e tokens.ts
npm run ds:lint     # falha se o código escapou do sistema
```

**Nunca edite à mão:** `resources/css/ensign-theme.css`,
`design-system/tailwind-preset.web.js`, `design-system/tokens.ts`.
São gerados. Mude `tokens.json` e rode `ds:build`.

## Proibido — falha no lint, falha no review

- Hex, `rgb()`, `hsl()` em qualquer Blade, componente, template ou CSS.
- Nome de rampa primitiva no produto: `navy-*`, `champagne-*`, `sunflare-*`,
  `sand-*`. Primitivos só existem dentro do design system.
- `text-white` ou `color: #fff` sobre `surface-accent` / fundo amarelo.
  Use **`content-on-accent`**. Branco sobre `#FFCF14` é **1,48:1**.
- Valor arbitrário do Tailwind em cor, espaço, raio ou fonte: `p-[13px]`,
  `text-[15px]`, `bg-[#1B2340]`, `rounded-[10px]`. Exceção única:
  `max-w-[1280px]`, que vem de `size-content-max`.
- `outline: none` sem substituir o indicador de foco.
- `onClick` em `div` ou `span` — o Tab não alcança.
- Criar componente novo quando já existe um equivalente no design system.
- Emoji na UI.

## Obrigatório

- Tokens semânticos: `surface-*`, `content-*`, `border-*`, `action-*`,
  `feedback-*`, `status-*`, `chart-*`.
- Raios semânticos: `rounded-card`, `rounded-control`, `rounded-button`.
- `data-theme="admin"` no `<html>` do layout do painel.
- Borda de input e de controle em **`border-strong`**, nunca `border-default`
  (`border-default` está abaixo de 3:1 por design).
- Número em coluna com a classe `numeric` (traz `tabular-nums`), alinhado à
  direita.
- Botão só de ícone com `aria-label`; alvo de no mínimo 44px mesmo que o visual
  seja 32px.
- Ordenação de tabela como `<button>` no `<th>` com `aria-sort`.
- Erro de campo com `aria-describedby` ligando campo e mensagem.
- Toda página tem estado vazio, de carregamento e de erro.
- Texto em pt-BR, segunda pessoa, botão como verbo ("Criar pedido", não "Enviar").
- Dinheiro em `numeric(12,2)` ou centavos em `bigint` — nunca `float`. Datas em
  `timestamptz`, formatadas em `America/Sao_Paulo`.

## Regras de composição

- **Um único `surface-accent` por página.** O botão "+ Novo" da topbar costuma
  ser ele. Se a página precisa de outro, um dos dois está errado.
- Sidebar é `surface-brand` (navy) com rótulos `content-on-brand` (branco), e
  **não** inverte com o tema. O item ativo recebe `surface-brand-hover` mais uma
  barra `border-accent` de 3px na esquerda — **nunca** fundo amarelo.
- Cards são `surface-raised` (branco) sobre `surface-canvas` (off-white quente).
  É esse contraste que faz um painel denso ser legível.
- Conteúdo limitado a `max-w-[1280px]`; largura extra vira margem, não linha mais
  longa.
- Rótulo de KPI e cabeçalho de coluna em `overline` + `content-secondary`.
  **Nunca** `content-muted` a 11px.
- Gráfico plota sobre `surface-chart`. Séries em `chart-1`…`chart-6` na ordem
  fixa, nunca em ciclo. Dispersão e bolha: no máximo 3 séries.
- `#FFCF14` não é cor de série nem cor de texto no tema claro.

## Antes de criar qualquer componente

Leia `design-system/README.md` e a seção relevante. Se o componente existe, use;
se precisa de variante, estenda — não faça um paralelo.

**Se faltar um componente para montar uma tela, PARE e diga o que falta antes de
criar um novo.**

## Ao terminar

```
npm run ds:build && npm run ds:lint && npm run lint
php artisan test
```

Não considere pronto com lint vermelho. Revise na tela a 1440px e a 1024px:
contraste, navegação por teclado, foco visível.
