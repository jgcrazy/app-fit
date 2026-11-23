A linha padrão de listagem do app: título, metadado, pílula de status e valor.
É o componente mais repetido do produto, então ele é deliberadamente sem graça.

## Anatomia

```
surface-raised · border-default 1px · radius-card (16px no app) · padding space-4
título    body-strong   content-primary   ← truncado com ellipsis
metadado  body-sm       content-muted
status    Badge
valor     numeric       content-primary   ← tabular-nums
```

Altura resultante: 64–72px, que é a densidade do app. No admin, uma lista assim
normalmente deveria ser um `DataTable`.

## Elevação no escuro

No tema app a elevação é **passo de superfície + borda de 1px**, não sombra:
`surface-raised` sobre `surface-canvas`. Sombra sobre navy é quase invisível, e
tentar compensar com sombra mais forte só suja a tela.

## Truncamento

O título trunca em uma linha. Se o seu dado precisa de duas linhas de título, ele
não é um `ListCard` — é um card de detalhe.

## O consumidor fornece

Os dados já formatados: `R$ 128,90`, não `128.9`. A formatação de moeda e data é
da camada de apresentação, e o componente não a faz.

Para a linha inteira ser clicável, envolva em `<a href>` ou `<button>` — não
ponha `onClick` no card.

## Erros comuns

- `onClick` no div do card. O Tab não alcança.
- Valor sem `tabular-nums`: numa lista de dez pedidos os números dançam.
- Metadado em `content-secondary` em vez de `content-muted` — aí ele compete com
  o título.
- Sombra em vez de passo de superfície no tema app.
- Usar `ListCard` no admin onde cabia uma tabela.
