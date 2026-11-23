Antes de escrever uma linha do componente **$ARGUMENTS**, responda:

1. **Ele já existe?** Procure em `design-system/components/` e nas seções do
   brand book. Se existe, use-o; se precisa de variante, estenda-o — não crie um
   paralelo. Se encontrou algo parecido, pare aqui e me diga o que achou.
2. **De quais tokens semânticos ele depende?** Liste nome por nome
   (`surface-*`, `content-*`, `border-*`, `action-*`, raio, espaço, estilo de
   texto, duração e easing). Se faltar um token para o que ele precisa, **pare e
   me diga** — não invente um hex próximo.
3. **Quais estados ele tem?** Mínimo: default, hover, focus-visible, active,
   disabled. Mais, conforme o caso: loading, error, selected, empty, skeleton.
4. **Em qual superfície ele vive?** App, admin, ou os dois? Se os dois, o que muda
   além do raio semântico?
5. **Qual o contrato de acessibilidade?** Elemento base (`<button>`, `<a href>`,
   `<input>`+`<label>`), atributos ARIA, alvo de toque, como o foco aparece.
6. **Em qual fase ele entra?** (1 átomos · 2 navegação · 3 dados · 4 sobreposição)
   Se depende de algo de uma fase posterior, a ordem está errada.

Só depois de eu confirmar, escreva o código: um arquivo, sem hex, sem valor
arbitrário, e com todos os estados do item 3 implementados — não apenas o default.
