# Admin — Laravel 13 + PostgreSQL

O painel roda no tema **`admin`**: claro, analítico, denso. O Navy continua
segurando a marca na sidebar e na topbar, que são `surface-brand` e **não**
invertem com o tema.

Stack: Laravel 13 (PHP 8.3+), PostgreSQL, Vite, Tailwind. Serve tanto para
**Blade + Livewire** quanto para **Inertia + React** — o design system é o mesmo
CSS nos dois casos.

## 1. Ativando o tema

```blade
{{-- resources/views/layouts/admin.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR" data-theme="admin">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
  @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-surface-canvas text-content-primary antialiased">
  <div class="flex min-h-screen">
    <x-admin.sidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <x-admin.topbar />
      <main class="flex-1 p-8">
        <div class="mx-auto w-full max-w-[1280px] space-y-6">
          {{ $slot }}
        </div>
      </main>
    </div>
  </div>
  <x-admin.toast-host />
</body>
</html>
```

`data-theme="admin"` no `<html>` é o que troca todo o conjunto de cores. É a única
linha que faz isso.

## 2. CSS

```css
/* resources/css/app.css */
@import './ensign-theme.css';   /* gerado de tokens.json */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`ensign-theme.css` é **gerado**, não editado. Ele traz:

- `:root, [data-theme="app"] { … }` e `[data-theme="admin"] { … }`
- as classes de estilo de texto (`.body`, `.h2`, `.metric-xl`, …)
- os raios semânticos por tema
- a receita de foco de dois anéis
- o bloco de `prefers-reduced-motion`

## 3. AdminLayout

### Sidebar

```blade
<aside class="w-[264px] shrink-0 bg-surface-brand">
  <div class="flex h-16 items-center px-5">
    <x-brand-mark class="h-7 text-content-on-brand" />
  </div>
  <nav class="space-y-1 px-2 py-2">
    @foreach ($itens as $item)
      <a href="{{ $item->url }}"
         @class([
           'relative flex h-11 items-center gap-3 rounded-md px-3 text-label',
           'text-content-on-brand bg-surface-brand-hover' => $item->ativo,
           'text-content-secondary hover:bg-surface-brand-hover hover:text-content-on-brand' => ! $item->ativo,
         ])
         @if($item->ativo) aria-current="page" @endif>
        @if ($item->ativo)
          <span class="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2
                       rounded-r-sm bg-border-accent" aria-hidden="true"></span>
        @endif
        <x-icon :name="$item->icone" class="size-5 shrink-0" />
        <span class="truncate">{{ $item->rotulo }}</span>
      </a>
    @endforeach
  </nav>
</aside>
```

A barra amarela de 3px é o indicador de ativo — e é parte dos 10%. O item ativo
**não** ganha fundo amarelo; ele ganha `surface-brand-hover` mais a barra.

### Topbar

64px, `surface-raised` (branca), borda inferior `border-default`. À esquerda o
breadcrumb em `body-sm` + `content-secondary`; à direita busca, notificações e
avatar. É aqui que mora o botão **"+ Novo"** — `surface-accent` +
`content-on-accent`, um por página.

## 4. KPICard

```blade
<div class="rounded-card border border-border-default bg-surface-raised p-5 shadow-sm">
  <div class="flex items-start justify-between gap-3">
    <p class="overline text-content-secondary">{{ $rotulo }}</p>
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full
                 bg-surface-accent-soft">
      <x-icon :name="$icone" class="size-5 text-content-accent" aria-hidden="true" />
    </span>
  </div>
  <p class="metric-xl mt-3 text-content-primary">{{ $valor }}</p>
  <p @class(['body-sm mt-1 flex items-center gap-1',
             'text-feedback-success-fg' => $delta > 0,
             'text-feedback-error-fg' => $delta < 0,
             'text-content-muted' => $delta == 0])>
    <x-icon :name="$delta > 0 ? 'arrow-up' : ($delta < 0 ? 'arrow-down' : 'minus')"
            class="size-4" aria-hidden="true" />
    {{ $deltaFormatado }} <span class="text-content-muted">vs. período anterior</span>
  </p>
</div>
```

Grade: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`.

O rótulo é `overline` + `content-secondary` — **nunca** `content-muted` a 11px. A
seta faz o trabalho que a cor reforça.

## 5. DataTable

```
cabeçalho   surface-secondary-soft, overline, content-on-secondary, sticky z-sticky
células     body (texto) / numeric + tabular-nums (números), p-3
zebra       ímpares surface-raised, pares surface-canvas
hover       surface-raised-hover
borda       border-default entre linhas
seleção     surface-accent-soft + checkbox com border-strong
ações       botão ghost de ícone, 44px de alvo, menu com scale-in
```

- Dinheiro e contagem **alinhados à direita** com `numeric`.
- Coluna de status com pílula `status-*` — sempre com rótulo.
- Barra de filtros em **uma linha acima** da tabela: busca à esquerda, filtros no
  meio, densidade e exportar à direita.
- Abaixo de `lg`, as colunas secundárias colapsam em uma linha de detalhe
  expansível. Tabela nunca entra em scroll horizontal sem uma borda que anuncie
  isso.
- Ordenação é um `<button>` no `<th>` com `aria-sort`.
- Paginação mostra "41–60 de 338" em `body-sm` + `content-secondary`.

Estado vazio: título `h3`, uma frase `body` + `content-secondary`, e a ação
primária. Nunca uma tabela vazia com cabeçalho sozinho.

## 6. Toast

```
surface-overlay, rounded-card, shadow-lg, p-4, z-toast
barra esquerda de 4px: border-accent (info) ou feedback-*-border
ícone + título body-strong + descrição body-sm content-secondary
botão de fechar ghost, 44px de alvo
```

Entra com `slide-down`; 4s, ou 6s se tiver ação. Hover ou foco pausa o cronômetro.
`role="status"` para sucesso e info, `role="alert"` para erro.

## 7. Formulários

- Rótulo **acima** do campo, sempre: `label` + `content-secondary`. Placeholder
  não substitui rótulo.
- `surface-input` (branco) + `border-strong` + `rounded-control` (8px no admin).
- Erro: `feedback-error-border` na borda, mensagem `body-sm` +
  `feedback-error-fg`, e `aria-describedby` ligando campo e mensagem.
- Validação do servidor volta no padrão do Laravel; o componente de campo lê
  `$errors->first($name)`.
- Campo obrigatório marcado em texto, não só com asterisco colorido.
- Grade de formulário: `lg:grid-cols-2 gap-x-6 gap-y-5`, com campos largos
  (endereço, descrição) em `lg:col-span-2`.

## 8. PostgreSQL — o que o design system assume

O design system não dita o schema, mas alguns campos aparecem direto na UI:

- **Status como enum ou check constraint**, com os mesmos quatro grupos das
  pílulas: ativo/concluído, pendente/em análise, cancelado/recusado,
  rascunho/arquivado. Um quinto status sem token é um status que a UI não sabe
  pintar.
- **Dinheiro em `numeric(12,2)`** ou centavos em `bigint` — nunca `float`. A
  formatação `R$ 1.234,56` é da camada de apresentação.
- **`timestamptz`** em tudo; a UI formata em `America/Sao_Paulo`.
- Toda listagem do admin precisa de índice no que a tabela ordena e filtra por
  padrão (normalmente `created_at desc` mais a coluna de status).
- Paginação por cursor nas tabelas que passam de ~50 mil linhas; `offset` fundo de
  lista é lento em Postgres.

## 9. Checklist de página do admin

- [ ] `data-theme="admin"` no `<html>`.
- [ ] Sidebar `surface-brand` com item ativo marcado por `border-accent`, não por
      fundo amarelo.
- [ ] Um único botão `surface-accent` por página.
- [ ] Conteúdo limitado a `max-w-[1280px]`.
- [ ] Cards `surface-raised` sobre `surface-canvas` — branco sobre off-white.
- [ ] Números em coluna com `numeric` + `tabular-nums`, alinhados à direita.
- [ ] Borda de input em `border-strong`, nunca `border-default`.
- [ ] Foco com a receita de dois anéis.
- [ ] Estado vazio, de carregamento e de erro desenhados.
- [ ] Nenhum hex no Blade, no componente ou no CSS da página.
