# Movimento

Movimento neste sistema faz três coisas: confirma um toque, explica de onde algo
veio e leva o olho até a única coisa que mudou. Qualquer outra coisa é enfeite e
é cortada.

Durações e easings são tokens (`duration-*`, `ease-*`); as animações nomeadas
abaixo são receitas montadas com eles.

## Durações

| Token | Valor | Para |
| --- | --- | --- |
| `duration-instant` | 0ms | Fallback de movimento reduzido; mudanças que não devem animar |
| `duration-fast` | 120ms | Press, hover, checkbox, retorno de toque |
| `duration-base` | 200ms | **Padrão.** Fades, cor, acordeão, tooltip |
| `duration-slow` | 320ms | Bottom sheet, drawer, modal, troca de rota |
| `duration-slower` | 480ms | Ciclo de shimmer, revelação de onboarding, entrada de gráfico |

## Easings

| Token | Curva | Para |
| --- | --- | --- |
| `ease-standard` | `cubic-bezier(0.2,0,0,1)` | Tudo que é interrompível ou reversível |
| `ease-decelerate` | `cubic-bezier(0,0,0,1)` | **Entradas**: sheet subindo, toast entrando, menu abrindo |
| `ease-accelerate` | `cubic-bezier(0.3,0,1,1)` | **Saídas**: sheet descendo, toast saindo, dispensar |
| `ease-spring` | `cubic-bezier(0.34,1.56,0.64,1)` | Um overshoot, com parcimônia |
| `ease-linear` | `linear` | Só loops: shimmer, spinner, progresso |

**A regra do par.** Entrada desacelera — entra rápido e assenta. Saída acelera —
sai da frente. Tudo que um dedo pode agarrar e reverter no meio usa
`ease-standard`. `ease-spring` é permitido em exatamente duas coisas: o indicador
de aba ativa e um salvamento bem-sucedido. Nunca em um contêiner que carregue
texto; o overshoot deixa a cópia legível-e-ilegível.

## Animações nomeadas

```css
@keyframes ensign-fade-in     { from { opacity: 0 } to { opacity: 1 } }
@keyframes ensign-scale-in     { from { opacity: 0; transform: scale(.96) }
                                 to   { opacity: 1; transform: scale(1) } }
@keyframes ensign-slide-up     { from { transform: translateY(100%) }
                                 to   { transform: translateY(0) } }
@keyframes ensign-slide-down   { from { opacity: 0; transform: translateY(-12px) }
                                 to   { opacity: 1; transform: translateY(0) } }
@keyframes ensign-shimmer      { from { background-position: -160% 0 }
                                 to   { background-position: 260% 0 } }
@keyframes ensign-spin         { to { transform: rotate(360deg) } }
@keyframes ensign-pulse-accent { 0%,100% { opacity: 1 } 50% { opacity: .55 } }
```

| Receita | Duração + easing | Usada por |
| --- | --- | --- |
| `fade-in` | `base` + `ease-standard` | Tooltip, validação em linha, item novo na lista |
| `scale-in` | `fast` + `ease-decelerate`, origem no gatilho | Dropdown, popover, menu de ações de linha |
| `slide-up` | `slow` + `ease-decelerate` | Bottom sheet, drawer, modal no mobile |
| `slide-down` | `base` + `ease-decelerate` | Toast entrando pelo topo |
| `shimmer` | `slower` + `ease-linear`, infinito | Skeleton de carregamento |
| `spin` | 800ms + `ease-linear`, infinito | Spinner de botão em loading |
| `press` | `fast` + `ease-standard`, `scale(.97)` | Todo elemento pressionável |

As saídas reaproveitam os mesmos keyframes invertidos, com `ease-accelerate` em
`duration-fast`.

## Especificações por componente

**Press.** Todo tocável escala para `.97` em `duration-fast`. No React Native use
`Pressable` com `style={({pressed}) => ...}` ou Reanimated; aplique
`opacity-press` (0,88) no alvo inteiro onde o scale fica estranho.

**Botão primário.** O fundo transiciona `surface-accent` → `surface-accent-hover`
em `duration-fast`. Em loading, o rótulo dá lugar ao `spin` em `size-icon-md` com
`content-on-accent`, e o botão mantém a largura — sem reflow.

**Bottom sheet.** `slide-up`, `duration-slow`, `ease-decelerate`. O scrim entra em
`duration-base` ao mesmo tempo. O arraste acompanha o dedo 1:1; soltar passando de
40% da altura dispensa com `ease-accelerate`, senão volta com `ease-standard`.

**Bottom tab bar.** O indicador ativo se move entre abas em `duration-base` com
`ease-spring`. A cor do ícone atravessa de `content-secondary` em
`opacity-tab-inactive` para `content-accent` em opacidade cheia, em
`duration-fast`. O rótulo nunca anima de tamanho.

**Toast.** `slide-down` na entrada, dispensa automática em 4s (6s se carregar uma
ação), saída com `ease-accelerate` em `duration-fast`. Hover ou foco pausa o
cronômetro.

**Modal.** O scrim entra em `duration-base`; o painel usa `scale-in` no desktop e
`slide-up` no mobile, os dois em `duration-slow`.

**Acordeão / disclosure.** Altura em `duration-base` + `ease-standard`, com a
opacidade do conteúdo atrasada 60ms para o texto não borrar.

**Skeleton.** Base `surface-raised` com uma faixa `surface-raised-hover` varrida
por `shimmer`. O skeleton espelha as caixas do layout real — nunca um retângulo
cinza genérico onde vai aparecer um card.

**Entrada do gráfico.** Barras crescem da linha de base, linhas varrem da esquerda
para a direita, em `duration-slower` com `ease-decelerate`, escalonadas 40ms por
série. **Uma vez, só na primeira pintura** — nunca ao trocar filtro, onde se lê
como dado pulando.

**Foco.** Foco *não* anima. Ele aparece na hora, porque um anel de foco que faz
fade-in é um anel de foco que você perde.

## A receita de foco

Sunflare sobre branco dá 1,48:1, então o indicador de foco do admin são **dois
anéis**: o amarelo da marca por dentro, um contorno navy por fora dando o
contraste.

```css
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--border-focus),
              0 0 0 4px var(--border-focus-outline);
}
```

No tema app, `border-focus-outline` é `navy-950`, que se lê como um halo escuro
sobre o canvas navy. No admin é `navy-900`, a 15,4:1 contra o branco. De um jeito
ou de outro, o indicador passa 3:1 contra o entorno.

Nunca `outline: none` sem substituir o indicador.

## Movimento reduzido

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: var(--duration-instant) !important;
    animation-iteration-count: 1 !important;
    transition-duration: var(--duration-instant) !important;
    scroll-behavior: auto !important;
  }
}
```

React Native: `AccessibilityInfo.isReduceMotionEnabled()`, e aí descarte o
transform mantendo a mudança de opacidade. **Mudança de posição sai; mudança de
cor e opacidade fica** — elas carregam estado, não enfeite.

## Regras

- Nada anima por mais que `duration-slower` (480ms).
- Sem parallax, sem scroll-jacking, sem gradiente animado de fundo.
- Nunca anime `width`, `height`, `top` ou `left` onde `transform` resolve.
- Animação interrompível tem que ser interrompível — sem cadeia enfileirada e não
  cancelável.
- Estado de carregamento só aparece depois de 150ms de espera real, senão toda
  resposta rápida pisca um skeleton.
- Uma coisa se move por vez. Se duas regiões animam juntas, o olho não escolhe
  nenhuma.
