Barra de navegação inferior do app: até quatro itens, ativo em Sunflare com
indicador de 3px, inativos em Champagne com opacidade.

## Anatomia

```
surface-deep · min-height 56px + inset inferior · z-tabbar
ativo     ícone 24px   content-accent        opacidade cheia
          rótulo       label-sm · content-accent
          indicador    border-accent · 24×3px · radius-pill · no topo do item
inativo   ícone        content-secondary     opacity-tab-inactive (0,72)
          rótulo       label-sm
```

`opacity-tab-inactive` é 0,72 e não um número qualquer: é o ponto em que o
Champagne ainda passa 3:1 sobre `surface-deep`.

## Quatro itens, no máximo

Com cinco, os rótulos começam a truncar e os alvos encostam. Se o produto tem
cinco áreas, a quinta vai para dentro de uma das quatro.

## O rótulo nunca desaparece

Ícone sozinho não se lê. Não existe modo "só ícones" nesta barra, nem em tela
pequena.

## Movimento

O indicador desliza entre abas em `duration-base` com `ease-spring` — um dos dois
únicos lugares onde esse easing é permitido. A cor do ícone atravessa em
`duration-fast`. **O rótulo nunca anima de tamanho.**

## Safe area

O inset inferior entra como padding **dentro** da barra, não como margem abaixo
dela — senão aparece uma faixa do canvas sob a barra. E a região de scroll acima
precisa de padding igual a `insets.bottom + 56 + space-4`, ou o último card morre
atrás da barra.

## Acessibilidade

`<nav aria-label="Navegação principal">`, cada item um `<button>` (ou `<Link>`)
com `aria-current="page"` no ativo. Alvo de `size-touch`.

## Erros comuns

- Cinco itens.
- Esconder o rótulo.
- Esquecer o padding inferior na lista acima da barra. É o bug nº 1 de app com
  tab bar.
- Inset como margem em vez de padding.
- Indicador por mudança de fundo em vez da barra de 3px.
