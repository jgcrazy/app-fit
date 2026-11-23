A tabela de gestão do painel: cabeçalho tingido, zebra, números tabulares
alinhados à direita, ordenação acessível, pílula de status e menu de ações por
linha.

## Anatomia

```
cabeçalho   surface-secondary-soft · overline · content-on-secondary · sticky
células     body (texto) · numeric + tabular-nums (números) · padding space-3
zebra       ímpares surface-raised · pares surface-canvas
hover       surface-raised-hover
borda       border-subtle entre linhas · border-default no cabeçalho e rodapé
rodapé      "41–60 de 338" em body-sm + content-secondary
```

Altura de linha: 48px, ou 40px em modo compacto.

## Números

Coluna com `numeric: true` ganha `text-align: right` e `tabular-nums`. Essa é a
diferença entre uma coluna de dinheiro legível e uma que dança. **Toda** coluna de
valor, contagem ou percentual é `numeric`.

## Ordenação

O cabeçalho ordenável é um `<button>` dentro do `<th>`, e o `<th>` carrega
`aria-sort="ascending" | "descending"`. Não é um `div` com `onClick`, e não é um
ícone solto.

## Colunas especiais

- `key: 'status'` renderiza um `Badge` — passe o tom (`active`, `pending`,
  `canceled`, `neutral`), não o rótulo bruto.
- `key: 'acoes'` renderiza um `IconButton` de 44px de alvo.

## Filtros

Em **uma linha acima** da tabela, nunca entre as tabelas: busca à esquerda,
filtros no meio, densidade e exportar à direita. O componente não os renderiza —
o host monta a barra.

## Responsivo

Abaixo de `lg`, as colunas secundárias colapsam em uma linha de detalhe
expansível. Tabela nunca entra em scroll horizontal sem uma borda que anuncie que
há mais conteúdo.

## Estados

Vazio: título `h3`, uma frase `body` + `content-secondary`, e a ação primária.
**Nunca** um cabeçalho de tabela sozinho sobre o nada.
Carregando: skeleton com o mesmo número de colunas e 5 linhas.

## O consumidor fornece

Dados já formatados e paginados, os handlers de ordenação e paginação, e o
`range`. O componente não busca, não ordena e não pagina.

## Erros comuns

- Dinheiro sem `numeric`.
- Ordenação em `div` com `onClick`, ou sem `aria-sort`.
- Cabeçalho em `surface-secondary` (bege cheio) em vez de `-soft` — pesa demais
  numa tabela de 20 linhas.
- Menu de ações com alvo menor que 44px.
- Tabela vazia sem estado vazio.
- Paginação por `offset` em tabela com centenas de milhares de linhas — no
  Postgres o fim da lista fica lento; use cursor.
