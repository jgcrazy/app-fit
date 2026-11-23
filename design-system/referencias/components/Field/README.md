Input, select e textarea no mesmo componente, com rótulo acima, texto de ajuda,
estado de erro ligado por `aria-describedby` e a borda de foco em Sunflare.

## Anatomia

```
rótulo    label           content-secondary      ← SEMPRE acima, nunca placeholder
campo     surface-input   border-strong 1px      ← radius-control
ajuda     body-sm         content-muted
erro      body-sm         feedback-error-fg      ← substitui a ajuda
```

A borda é **`border-strong`**, não `border-default` — a borda de um controle tem
que passar 3:1, e `border-default` está abaixo disso por design.

O `placeholderTextColor` / `::placeholder` usa `content-muted`, escolhido para
passar 4,5:1 sobre `surface-input` nos dois temas. Placeholder legível, mas ele
**não substitui o rótulo**.

## Erro

Passar `error` faz três coisas de uma vez: pinta a borda com
`feedback-error-border`, define `aria-invalid="true"` e liga
`aria-describedby` à mensagem. A ajuda é suprimida enquanto houver erro, para o
leitor de tela não anunciar as duas.

## Obrigatório

`required` escreve "(obrigatório)" em texto ao lado do rótulo, além do atributo.
Asterisco colorido sozinho não comunica.

## O consumidor fornece

Valor e `onChange` (ou `defaultValue` em formulário não controlado), `type`,
`inputMode`, `autoComplete`, e a máscara quando o campo pede (CPF, CEP,
telefone). O componente não valida nada.

## Erros comuns

- Placeholder como rótulo.
- `border-default` na borda do campo.
- Mensagem de erro sem `aria-describedby` — o leitor de tela não a encontra.
- `type="text"` em campo numérico no mobile: o teclado errado sobe.
- Altura abaixo de `size-control-md` (40px) no admin ou de 48px no app.
