Quatro variantes de ação, três tamanhos, e a regra de que só existe **um botão
`primary` por região de tela** — ele é os 10% de Sunflare Yellow.

## Variantes

| Variante | Fundo | Texto | Quando |
| --- | --- | --- | --- |
| `primary` | `action-primary-bg` | `action-primary-fg` (navy) | A ação da tela. Uma. |
| `secondary` | transparente + `action-secondary-border` | `action-secondary-fg` | Alternativa à primária |
| `ghost` | nada | `action-ghost-fg` | Ação terciária, barra de ferramentas |
| `danger` | `action-danger-bg` | branco (5,0:1) | Excluir, cancelar de forma irreversível |

**O rótulo do `primary` é navy, não branco.** `action-primary-fg` existe para que
ninguém precise lembrar: branco sobre `#FFCF14` é 1,48:1.

## Tamanhos

`sm` 32px · `md` 40px · `lg` 48px. No app use `lg`; no admin, `md` por padrão e
`sm` dentro de tabelas. O raio vem de `radius-button` — pílula no app, 6px no
admin.

## Estados

Todos implementados: `hover`, `focus-visible` (dois anéis), `active`
(`scale(.97)` em `duration-fast`), `disabled` (`opacity-disabled`), e `loading`.

Em `loading` o botão **mantém a largura** — o rótulo fica invisível e o spinner
entra por cima, então a linha não reflui. Também fica `disabled` e
`aria-busy="true"`.

## IconButton

Botão só de ícone. `label` é **obrigatório** — é o nome acessível. O alvo tem
`min-width`/`min-height` de `size-touch` (44px) mesmo quando o ícone é de 16px.

## O consumidor fornece

O handler (`onClick`), o rótulo e, quando for submit de formulário,
`type="submit"`. O componente não navega nem busca nada.

## Erros comuns

- `text-white` no primary. Use `action-primary-fg`.
- Dois primary na mesma tela. Um deles é secondary.
- `danger` para "Cancelar" de um diálogo — cancelar não é destrutivo; é `ghost`
  ou `secondary`. `danger` é para "Excluir pedido".
- Botão de ícone sem `label`.
- Trocar o rótulo por "Carregando..." em vez de usar `loading` — isso reflui a
  linha.
