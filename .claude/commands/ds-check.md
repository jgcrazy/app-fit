Audite os arquivos alterados contra o design system Ensign.

Rode primeiro `npm run ds:lint` e inclua o que ele encontrar. Depois verifique à
mão o que o lint não alcança:

1. **Orçamento 60-30-10** — mais de um `surface-accent` na mesma região de tela?
   Mais de dois blocos `surface-secondary`?
2. **Contraste** — algum texto em `content-muted` sobre um fundo que não seja
   `surface-canvas`, `surface-raised` ou `surface-raised-hover`? Algum `overline`
   a 11px em `content-muted`?
3. **Borda funcional** — input, checkbox, radio, segmented ou eixo de gráfico
   usando `border-default` em vez de `border-strong`?
4. **Foco** — todo interativo tem indicador visível? A receita de dois anéis está
   aplicada no admin?
5. **Alvo de toque** — algum tocável abaixo de 44px?
6. **Semântica** — `onClick` em div/span? Botão de ícone sem rótulo acessível?
   Ordenação de tabela sem `aria-sort`? Erro de campo sem `aria-describedby`?
7. **Números** — valor em coluna sem `numeric`/`tabular-nums`, ou não alinhado à
   direita?
8. **Estados** — a tela tem vazio, carregando e erro, ou só o caminho feliz?
9. **Movimento** — algo animando `width`/`height`/`top`/`left` onde `transform`
   resolve? Animação acima de 480ms? Entrada de gráfico rodando a cada filtro?
10. **Gráficos** — plotando sobre `surface-chart`? Séries em ordem fixa? Eixo
    duplo? Mais de 3 séries em dispersão? Texto na cor da série? Sunflare como
    série?
11. **Indicador de ativo** — item de sidebar ou aba com fundo amarelo em vez da
    barra `border-accent`?
12. **Tema** — raio fixo em px onde deveria ser `rounded-card`/`-control`/
    `-button`?

Liste `arquivo:linha`, o problema e a correção concreta (o token certo).
**Não altere nada ainda** — espere meu OK.
