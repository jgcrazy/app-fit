Card de métrica do painel: rótulo, valor grande, variação com direção, e um
ícone em disco amarelo. É quase sempre a resposta certa quando o dado é **um
número só** — um número não precisa de gráfico.

## Anatomia

```
rótulo      overline      content-secondary        ← nunca content-muted a 11px
ícone       size-icon-md  content-accent
            em disco      surface-accent-soft · radius-pill
valor       metric-xl     content-primary          ← algarismos proporcionais
variação    body-sm       feedback-success/error-fg ou content-muted
```

## O rótulo não usa `content-muted`

A 11px, `content-muted` não passa 4,5:1 com margem confortável. O rótulo é
`overline` + `content-secondary`. Essa é a regra que mais se quebra em cards de
métrica.

## Variação

`delta` é um número. O componente decide cor, seta e sinal:

| delta | Cor | Ícone |
| --- | --- | --- |
| `> 0` | `feedback-success-fg` | seta para cima |
| `< 0` | `feedback-error-fg` | seta para baixo |
| `0` | `content-muted` | traço |
| `null` | — | linha omitida |

**A seta e o sinal fazem o trabalho; a cor reforça.** Quem não distingue
verde de vermelho lê a direção pela seta.

Atenção ao domínio: em "Cancelamentos", `delta` positivo é ruim. O componente
não sabe disso — passe o sinal invertido ou use `deltaLabel` para deixar claro.

## Algarismos

`metric-xl` usa algarismos **proporcionais**, de propósito: um número isolado não
precisa alinhar com nada. Tabular é para coluna — isso é o `numeric` do
`DataTable`.

## Os 10% numa fileira de KPIs

Cada card tem um disco amarelo. Uma fileira de quatro tem quatro discos, e isso
ainda cabe nos 10% porque cada um é minúsculo. O que não cabe é um card de KPI
com **fundo** amarelo.

## Grade

`grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`.

## Erros comuns

- Rótulo em `content-muted`.
- Fundo do card em `surface-accent`.
- Sparkline com eixo, grade ou tooltip — a sparkline é textura, não leitura. Se
  o leitor precisa dos valores, é um gráfico.
- Cor sem seta.
- `metric-xl` com `tabular-nums`.
