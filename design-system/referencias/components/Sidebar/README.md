Navegação lateral do painel: 264px, `surface-brand` (navy), item ativo com
`surface-brand-hover` **mais uma barra `border-accent` de 3px na esquerda**.

## Anatomia

```
surface-brand · width size-sidebar (264px) · padding space-2
item         min-height size-control-md (40px) · radius-md · padding 0 space-3
inativo      content-secondary → hover: surface-brand-hover + content-on-brand
ativo        surface-brand-hover + content-on-brand
             + barra 3×24px border-accent, colada na borda esquerda
ícone        size-icon-md (20px)
```

## O ativo não é amarelo

Esta é a regra que mais se perde na implementação: **o item ativo não ganha fundo
amarelo.** Ele ganha `surface-brand-hover` (navy um passo acima) mais a barra de
3px em Sunflare.

Fundo amarelo no item ativo gasta os 10% em navegação, e aí não sobra destaque
para a ação da página. A barra de 3px marca o ativo com uma fração do pixel —
exatamente o que o orçamento permite.

## Navy nos dois temas

`surface-brand` não inverte. É isso que mantém o painel na marca: sidebar navy
contra conteúdo off-white quente, dentro de um tema claro. Os rótulos são
`content-on-brand` (branco em ambos), não `content-primary`.

## Colapso

- Abaixo de `lg` (1024px): `size-sidebar-collapsed` (72px), só ícones — e aí cada
  item precisa de `title`/tooltip, porque o rótulo saiu.
- Abaixo de `md` (768px): vira drawer sobre `surface-scrim`.

## Acessibilidade

`<nav aria-label="Navegação do painel">`, itens como `<a href>` com
`aria-current="page"` no ativo. A barra de 3px é `aria-hidden` — o
`aria-current` é que comunica.

## Erros comuns

- Fundo amarelo no item ativo.
- Rótulo em `content-primary`.
- Item com altura abaixo de 40px, ou sem alvo de 44px na versão colapsada.
- Sidebar que inverte para branco no tema claro — aí o painel perde a marca.
- Colapsar para ícones sem tooltip.
