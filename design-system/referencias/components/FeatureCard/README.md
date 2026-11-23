O card invertido — Champagne Satin em força máxima. É a aparição dos **30%** como
preenchimento, e a interrupção deliberada de uma tela que é 60% navy.

## Anatomia

```
surface-secondary (#D8CBB0) · radius-card · padding space-5
título   h3 (display)   content-on-secondary   ← navy, 9,6:1
texto    body           content-on-secondary
CTA      Button primary (surface-accent + content-on-accent)
```

## A regra de frequência

**Um ou dois por tela.** Três cards bege seguidos e os 30% viraram os 60% — a
tela deixa de ser Ensign Navy e passa a ser um sanduíche.

Use para: promoção, onboarding, um recurso novo, um estado vazio que quer
convidar. Não use para: linha de lista, container genérico, agrupamento.

## Texto é `content-on-secondary`

Navy, nos dois temas, a 9,62:1 sobre Champagne. O token existe pelo mesmo motivo
que `content-on-accent`: o fundo não inverte com o tema, então o texto também
não pode.

## O CTA amarelo sobre o bege

Funciona — `content-on-accent` (navy) sobre `surface-accent` (amarelo) dá 10,42:1,
e o botão amarelo sobre bege se separa bem. Mas esse botão **conta** no orçamento
dos 10%: se a tela já tem um CTA primário em outro lugar, o do FeatureCard é
`secondary`.

## Erros comuns

- Três ou mais por tela.
- Texto branco sobre o bege (1,8:1).
- Usar como container de conteúdo normal.
- Dois CTAs amarelos na tela — um aqui e um na barra de ação.
- Imagem de fundo atrás do texto sem garantir contraste.
