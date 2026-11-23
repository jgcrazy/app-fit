# Gráficos e visualização de dados

Esta seção é a instância de marca de um método: escolha a forma, atribua a cor
pelo trabalho que ela faz, valide a paleta, aplique as especificações de marca,
adicione a camada de hover, e só então considere pronto. **A cor vem por último** —
a maioria dos gráficos ruins começa escolhendo cor.

## 1. Antes da cor: a forma

| O trabalho do dado | Forma |
| --- | --- |
| Um número que resume tudo | **Não é gráfico.** Card de KPI com `metric-xl` |
| Magnitude entre categorias | Barra horizontal (rótulos longos) ou vertical |
| Mudança no tempo | Linha; área só se o total importar |
| Parte do todo, 2–3 partes | Barra empilhada única com rótulos diretos |
| Parte do todo, 4+ partes | Barra agrupada ou small multiples — **não** rosca |
| Relação entre duas medidas | Dispersão (máx. 3 séries, veja abaixo) |
| Distribuição | Histograma ou boxplot |

Regra dura: **nunca eixo duplo.** Duas medidas de escalas diferentes viram dois
gráficos, small multiples, ou são indexadas a uma base comum.

## 2. Paleta categórica — validada

Seis slots, atribuídos em **ordem fixa**, nunca em ciclo. Uma 7ª série vira
"Outros" ou small multiples.

| Slot | Matiz | App (escuro) | Admin (claro) |
| --- | --- | --- | --- |
| `chart-1` | dourado | `#B29005` | `#AE8D0B` |
| `chart-2` | indigo | `#6078D6` | `#3D50AE` |
| `chart-3` | teal | `#05A7A7` | `#009D9D` |
| `chart-4` | coral | `#E5564A` | `#D34037` |
| `chart-5` | violeta | `#A54FC7` | `#8632A6` |
| `chart-6` | verde | `#2BB059` | `#2C7F44` |

Os dois conjuntos foram validados contra a superfície de plotagem do seu tema —
não são um flip automático um do outro:

| Checagem | App sobre `#12172B` | Admin sobre `#FFFFFF` |
| --- | --- | --- |
| Faixa de luminosidade OKLCH | passa (0,48–0,67) | passa (0,43–0,77) |
| Piso de croma | passa | passa |
| Separação CVD, pares adjacentes | ΔE 13,5 (deutan) | ΔE 13,8 (deutan) |
| Piso de visão normal | ΔE 17,2 | ΔE 22,9 |
| Contraste vs. superfície | todos ≥ 3:1 | todos ≥ 3:1 |

**Limite de séries em dispersão e bolha: três.** Nessas formas todos os pares
ficam visíveis ao mesmo tempo, e só os slots 1–3 passam a separação all-pairs
(ΔE CVD 13,6 app / 14,9 admin). Acima de três, agregue em "Outros" ou facete.

O **Sunflare Yellow `#FFCF14` não é um slot de série.** Ele continua reservado
para ação e seleção; o dourado de gráfico é um passo escurecido do mesmo matiz,
dentro da faixa de luminosidade. Isso evita que uma série se confunda com um botão
ou com um estado selecionado.

## 3. Sequencial e divergente

**Sequencial** = um matiz, claro → escuro. A rampa é a navy, em
`chart-seq-1` … `chart-seq-6`, invertida por tema para que o passo 1 seja sempre o
mais próximo da superfície.

- Escala **contínua** (heatmap, coroplético): toda a faixa, de `seq-1` a `seq-6`.
- Escala **ordinal** (etapas de funil, faixas, níveis): comece em
  **`chart-seq-2`** — é o passo mais claro que ainda passa 2:1 contra a
  superfície.

**Divergente** = dois polos quente/frio com um ponto médio neutro:
`chart-2` (indigo, baixo) ↔ `chart-diverge-mid` (neutro) ↔ `chart-4` (coral,
alto). Mesmo número de passos em cada braço. **Nunca** um matiz no ponto médio, e
nunca arco-íris.

## 4. Status nunca é série

`status-*` e `feedback-*` são reservados. Um verde de "no prazo" nunca é a série
4, e uma série verde nunca se chama "bom". Onde um matiz de série encosta em um
status do mesmo matiz, a distinção fica no **ícone + rótulo**, nunca no tom.

Variação para cima/para baixo em card de KPI:

- positivo: `feedback-success-fg` + seta para cima + sinal
- negativo: `feedback-error-fg` + seta para baixo + sinal
- neutro: `content-muted` + traço

A seta e o sinal fazem o trabalho; a cor reforça.

## 5. Marcas e anatomia

- **Marcas finas.** Barra com 4px de raio só nas pontas de dado, ancorada na linha
  de base. Linha com 2px. Marcador com no mínimo 8px.
- **Vão de 2px** em `border-inverse` entre preenchimentos vizinhos — segmentos
  empilhados e barras adjacentes. Em marcas que se sobrepõem, um anel de 2px na
  cor da superfície.
- **Grade recuada.** `chart-grid` em fio fino, só no eixo que o leitor precisa
  cruzar, sempre atrás das marcas. Eixo e linha de base em `chart-axis`.
- **Texto usa token de texto**, nunca a cor da série: valores, rótulos e legenda
  em `content-primary` / `content-secondary` / `content-muted`. A marca colorida ao
  lado é que carrega a identidade.
- **Rótulo direto, seletivo.** Nomeie a primeira e a última série, o pico, o ponto
  comentado. Nunca um número em cada ponto.
- **Marcas de eixo e células de tabela usam `numeric`** com
  `font-variant-numeric: tabular-nums`.

## 6. Interação

Um gráfico em HTML/SVG é interativo — entregue a camada de hover por padrão.

- Linha e área: crosshair + tooltip com todas as séries naquele x.
- Barra, ponto, célula: tooltip por marca.
- Área de acerto maior que a marca.
- Filtros em **uma linha acima** dos gráficos, nunca entre eles.
- A única forma que dispensa hover é um card de KPI sem plotagem.

Tooltip usa `surface-overlay` + `shadow-md` + `border-default`, rótulo em
`content-muted`, valor em `content-primary` com `numeric`.

## 7. Acessibilidade

- Com 2 ou mais séries, **sempre** legenda; com até 4, também rótulo direto. A
  identidade nunca é só cor.
- Uma série só não precisa de caixa de legenda — o título a nomeia.
- Toda visualização tem uma **visão em tabela** alcançável.
- O modo escuro é escolhido, não invertido — os dois conjuntos acima.
- Cores que precisam ser distinguidas diferem em **luminosidade**, não só em
  matiz. Por isso a ordem dos slots começa dourado → indigo (grande salto de
  luminosidade) em vez de dois tons próximos.
- Para `forced-colors`, impressão ou preferência explícita, tenha um preenchimento
  texturizado: uma hachura a 45° e seu espelho a 135°, em um passo mais escuro da
  própria rampa da série. Nunca decorativo, nunca ligado por padrão.

## 8. Card de KPI

A forma mais usada do admin, e quase sempre a resposta certa quando o dado é um
número só.

```
┌──────────────────────────────┐   surface-raised
│ ▣  PEDIDOS HOJE              │   ícone size-icon-lg em círculo
│                              │   surface-accent-soft
│    1.248                     │   metric-xl, content-primary
│    ↑ 12,4% vs. ontem         │   body-sm, feedback-success-fg
│    ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌          │   sparkline opcional, chart-2
└──────────────────────────────┘   border-default + shadow-sm
```

- Rótulo em `overline` + `content-secondary` (nunca `content-muted` a 11px).
- Valor em `metric-xl`, algarismos proporcionais.
- A sparkline não tem eixo, não tem grade, e não tem tooltip — ela é textura, não
  leitura. Se o leitor precisa dos valores, é um gráfico, não um card.
- O ícone fica em um círculo `surface-accent-soft` com o traço em `content-accent`.
  **Um** círculo amarelo por card; uma fileira de quatro KPIs tem quatro círculos,
  e isso ainda cabe nos 10% porque cada um é minúsculo.

## 9. Antipadrões

Se o seu gráfico bate com um destes, ele está errado.

- Eixo duplo.
- Rosca ou pizza com mais de três fatias.
- Arco-íris em escala sequencial.
- Matiz no ponto médio de uma divergente.
- Cor atribuída por posição no ranking em vez de pela entidade — um filtro que
  muda a quantidade de séries não pode repintar as que ficaram.
- Número em todos os pontos.
- Grade mais forte que as marcas.
- Texto na cor da série.
- Sunflare como série.
- Barra que não começa no zero.
- Animação de entrada a cada troca de filtro.
