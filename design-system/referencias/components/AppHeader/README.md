Cabeçalho fixo do app: 56px, `surface-brand` (navy nos dois temas), com saudação
opcional, título e ações rápidas.

## Anatomia

```
surface-brand · min-height 56px · padding 0 space-2 0 space-4
voltar      IconButton, alvo 44px, content-secondary
saudação    body-sm   content-secondary    ← opcional
título      h2        content-on-brand     ← truncado
ação        IconButton (notificações), alvo 44px
```

## `surface-brand` não inverte

O header é navy nos dois temas, e por isso o título é `content-on-brand`
(branco em ambos) e não `content-primary`. Mesmo mecanismo da sidebar do admin:
a marca não some quando o tema muda.

## Safe area

O header fica **abaixo** do inset superior. Aplique o padding do
`useSafeAreaInsets().top` no container acima dele, ou o título colide com o
notch. Nunca um valor fixo de 44.

## Saudação

Quando existe, vai acima do título em `body-sm` + `content-secondary` — "Boa
noite, jG" sobre "Pedidos". Duas linhas em 56px fica apertado, então use saudação
só em telas de nível superior (home), não em telas de detalhe.

## Z-index

`z-header` (20). Fica abaixo de dropdown, scrim, overlay e toast.

## Erros comuns

- Título em `content-primary` — no tema admin isso o deixa navy sobre navy.
- Esquecer o safe area inset.
- Mais de duas ações no header. A terceira vai para um menu.
- Botão de ícone sem `accessibilityLabel`.
- Altura menor que 56px, ou botões com alvo abaixo de 44px.
