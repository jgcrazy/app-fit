Alerta flutuante de feedback: salvou, falhou, atenção, informação. Fica em
`z-toast`, **acima de modais** — uma confirmação de salvamento precisa ser visível
de dentro de um diálogo.

## Anatomia

```
surface-overlay · radius-card · shadow-lg · padding space-4
barra esquerda de 4px   feedback-<tom>-border
ícone                   feedback-<tom>-fg
título                  body-strong    content-primary
descrição               body-sm        content-secondary
fechar                  IconButton ghost, alvo de 44px
```

A cor vive na **barra e no ícone**, não no fundo. Um toast de erro com fundo
vermelho inteiro compete com o conteúdo da tela atrás dele.

## Papéis

`error` recebe `role="alert"` — o leitor de tela interrompe e anuncia na hora.
Os outros três recebem `role="status"`, que anuncia sem interromper. Essa é a
única diferença de comportamento entre os tons.

## Tempo

Entra com `slide-down` em `duration-base` + `ease-decelerate`. Dispensa sozinho
em **4s**, ou **6s** se carregar uma ação. **Hover ou foco pausa o cronômetro** —
sem isso é impossível clicar em "Desfazer".

Saída com `ease-accelerate` em `duration-fast`.

## O consumidor fornece

A fila: o componente renderiza um toast, não gerencia pilha. O host decide
posição (canto superior direito no admin, topo no app), limite simultâneo
(três) e o cronômetro.

## Erros comuns

- Fundo inteiro na cor do tom.
- Sem `role`, ou `role="alert"` em tudo — aí todo salvamento interrompe a leitura.
- Dispensa automática em toast que carrega ação, sem pausar no hover.
- Toast para validação de campo: isso é erro de campo, pertence ao `Field`.
- Empilhar mais de três.
