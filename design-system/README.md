# Ensign — design system do app-fit

`tokens.json` é a fonte da verdade de cor, tipo, espaço, raio, sombra, movimento
e tamanho. Ele é cópia exata do design system **Ensign** (artifact do projeto),
onde ficam o brand book completo e as medições de contraste.

Dois temas: **`app`** (escuro, mobile) e **`admin`** (claro, web). Três cores no
orçamento 60-30-10: Ensign Navy `#1B2340`, Champagne Satin `#D8CBB0`, Sunflare
Yellow `#FFCF14`. **Texto branco nunca vai sobre o amarelo** (1,48:1): use
`content-on-accent`.

## Onde cada coisa mora

```
design-system/
  tokens.json                 fonte da verdade — o único arquivo que se edita
  admin/                      referência para quando o painel existir (ver abaixo)
scripts/
  build-design-system.mjs     gera os temas a partir de tokens.json
  lint-design-system.mjs      barra hex, primitivo, valor arbitrário, branco no amarelo…
.claude/commands/
  ds-check.md                 /ds-check — auditoria do que o lint não alcança
  ds-componente.md            /ds-componente — perguntas antes de criar componente
apps/mobile/
  CLAUDE.md                   regras de UI do app
  src/shared/theme/
    tailwind-preset.native.js GERADO — preset NativeWind (tema app, valores literais)
    tokens.ts                 GERADO — tokens tipados para estilo imperativo
    fonts.ts                  GERADO — pesos de fonte que o app carrega
    layout.ts                 helpers de layout (px, padding inferior das telas)
```

## Comandos (na raiz)

```bash
npm run ds:build   # regenera os arquivos GERADOS
npm run ds:lint    # varre apps/mobile/src
npm run ds:ci      # build + falha se um gerado estiver desatualizado + lint
```

O CI roda `ds:ci` no job do mobile: se `tokens.json` mudou e ninguém rodou o
build, o PR fica vermelho.

## Mudando um token

Nunca no código do produto. Sempre nesta ordem:

1. Mude primeiro no artifact do Ensign: nome, valor nos dois temas, nota de uso.
2. **Meça o contraste** contra cada superfície que ele encontra — 4,5:1 para
   texto, 3:1 para borda funcional, anel de foco e ícone.
3. Copie o `tokens.json` novo para cá.
4. `npm run ds:build` e commite os gerados junto.
5. Só então use nos componentes.

## Adaptações em relação ao pacote original

O pacote do Ensign foi escrito para dois repositórios separados; aqui é monorepo.

- **Um gerador, saídas dentro de cada app.** O build escreve em
  `apps/mobile/src/shared/theme/`; com `--admin`, em `apps/api/resources/css/`.
- **Fontes no React Native.** No RN a fonte é chamada pelo nome do arquivo de
  cada peso (`PlusJakartaSans_700Bold`); `fontWeight` sobre o nome da família não
  escolhe o arquivo no Android. Por isso, no preset nativo, os 19 estilos de texto
  (`text-h2`, `text-body`…) são utilitários que já trazem família + peso,
  tamanho, linha e tracking (convertido de `em` para `px`). O `fonts.ts` gerado
  carrega só os pesos que algum estilo usa.
- **Texto do produto segue `docs/linguagem.md`.** Os exemplos de conteúdo do
  brand book são de loja ("Confirmar pedido"); no app-fit vale a regra
  educativa do ADR 0008.

## Admin (ainda não existe)

`apps/api` hoje só tem a `welcome.blade.php` padrão do Laravel. Quando o painel
começar:

1. `npm run ds:build -- --admin` gera `ensign-theme.css` e o preset web em
   `apps/api/resources/css/`.
2. Acrescente `apps/api/resources` em `ALVOS_PADRAO` do lint.
3. Use `design-system/admin/CLAUDE.md` como base das regras do painel.
4. **Atenção:** o Laravel 13 vem com **Tailwind v4** (`@import 'tailwindcss'`,
   config em CSS). `admin/tailwind.config.js` e `admin/app.css` estão no formato
   v3 do pacote original; converta para `@theme` do v4 (ou fixe o v3) antes de
   usar.
