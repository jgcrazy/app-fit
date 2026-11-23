# Ensign — instalação do pacote

Dois repositórios, o mesmo `tokens.json`. O gerador emite o que cada superfície
precisa.

```
pacote-ensign/
  design-system/
    tokens.json                    ← a fonte da verdade (copie para os 2 repos)
    tailwind-preset.web.js         ← gerado
    tailwind-preset.native.js      ← gerado
    tokens.ts                      ← gerado
  resources/css/
    ensign-theme.css               ← gerado
    app.css                        ← o seu ponto de entrada
  scripts/
    build-design-system.mjs
    lint-design-system.mjs
  .claude/commands/
    ds-check.md
    ds-componente.md
  CLAUDE.admin.md                  ← renomeie para CLAUDE.md no repo do admin
  CLAUDE.app.md                    ← renomeie para CLAUDE.md no repo do app
  tailwind.config.admin.js
  tailwind.config.app.js
```

## 1. Admin (Laravel 13)

```bash
# na raiz do projeto Laravel
mkdir -p design-system scripts .claude/commands

cp pacote-ensign/design-system/tokens.json        design-system/
cp pacote-ensign/scripts/*.mjs                    scripts/
cp pacote-ensign/.claude/commands/*.md            .claude/commands/
cp pacote-ensign/CLAUDE.admin.md                  CLAUDE.md
cp pacote-ensign/tailwind.config.admin.js         tailwind.config.js
cp pacote-ensign/resources/css/app.css            resources/css/app.css

node scripts/build-design-system.mjs
```

`package.json`:

```json
{
  "scripts": {
    "ds:build": "node scripts/build-design-system.mjs",
    "ds:lint": "node scripts/lint-design-system.mjs",
    "dev": "vite",
    "build": "npm run ds:build && vite build"
  }
}
```

No layout do painel, `data-theme="admin"` no `<html>`. É a única linha que troca
o tema inteiro.

```blade
<html lang="pt-BR" data-theme="admin">
```

Dependências:

```bash
npm i -D tailwindcss @tailwindcss/forms autoprefixer postcss
```

## 2. App (Expo + NativeWind v4)

```bash
mkdir -p design-system scripts .claude/commands

cp pacote-ensign/design-system/tokens.json        design-system/
cp pacote-ensign/scripts/*.mjs                    scripts/
cp pacote-ensign/.claude/commands/*.md            .claude/commands/
cp pacote-ensign/CLAUDE.app.md                    CLAUDE.md
cp pacote-ensign/tailwind.config.app.js           tailwind.config.js

node scripts/build-design-system.mjs
```

`package.json`:

```json
{
  "scripts": {
    "ds:build": "node scripts/build-design-system.mjs",
    "ds:lint": "node scripts/lint-design-system.mjs",
    "start": "expo start"
  }
}
```

Dependências:

```bash
npx expo install nativewind tailwindcss react-native-reanimated \
  react-native-safe-area-context react-native-gesture-handler \
  expo-font @expo-google-fonts/plus-jakarta-sans @expo-google-fonts/inter \
  lucide-react-native react-native-svg
```

`global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

O preset **nativo** traz os valores do tema `app` literais, porque o React Native
não resolve `var()` da mesma forma que o navegador. Se um dia o app ganhar tema
claro, troque para o preset web + `vars()` do NativeWind — o `tokens.ts` já expõe
os dois temas (`temas.app` e `temas.admin`).

## 3. Lint automático

Sem isso, as regras existem só no papel.

**pre-commit** (`.husky/pre-commit`):

```bash
#!/bin/sh
npm run ds:lint || exit 1
```

**CI** (GitHub Actions):

```yaml
- run: npm ci
- run: npm run ds:build
- run: git diff --exit-code design-system resources/css  # gerados em dia?
- run: npm run ds:lint
```

O `git diff --exit-code` garante que ninguém commitou um gerado desatualizado —
se `tokens.json` mudou e o build não rodou, o CI falha.

## 4. Mudando um token

Nunca no código do produto. Sempre nesta ordem:

1. Decida o token: nome, valor nos dois temas, nota de uso.
2. **Meça o contraste** contra cada superfície que ele vai encontrar — 4,5:1 para
   texto, 3:1 para borda funcional, anel de foco e ícone.
3. Edite `design-system/tokens.json`.
4. `npm run ds:build` nos dois repositórios.
5. Só então use nos componentes.

Um token que entrou sem medição é um bug esperando um relatório de
acessibilidade.

## 5. Verificando o build

```bash
node scripts/build-design-system.mjs
# Ensign — gerando de .../design-system/tokens.json
#   resources/css/ensign-theme.css
#   design-system/tailwind-preset.web.js
#   design-system/tailwind-preset.native.js
#   design-system/tokens.ts
# Pronto: 137 cores, 2 temas, 19 estilos de texto.

node scripts/lint-design-system.mjs
# Ensign lint: N arquivos, nenhum problema.
```
