#!/usr/bin/env node
/**
 * Ensign Design System — gerador.
 *
 * Monorepo app-fit. Lê design-system/tokens.json (a fonte da verdade) e emite:
 *
 *   App (sempre):
 *     apps/mobile/src/shared/theme/tailwind-preset.native.js  preset NativeWind (valores literais, tema app)
 *     apps/mobile/src/shared/theme/tokens.ts                  tokens tipados para uso imperativo no RN
 *     apps/mobile/src/shared/theme/fonts.ts                   fontes que o app carrega com expo-font
 *
 *   Admin (só com --admin, quando o painel existir):
 *     apps/api/resources/css/ensign-theme.css                 tema web, os dois data-theme
 *     apps/api/resources/css/tailwind-preset.web.js           preset web (var(), troca tema)
 *
 * Uso:  node scripts/build-design-system.mjs [--admin] [--tokens caminho] [--out raiz]
 *
 * NUNCA edite os arquivos de saída. Edite tokens.json e rode de novo.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const arg = (nome, padrao) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > -1 ? process.argv[i + 1] : padrao;
};

// Raiz do monorepo: um nível acima de scripts/, de onde quer que o comando rode.
const RAIZ_REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RAIZ = resolve(arg('out', RAIZ_REPO));
const COM_ADMIN = process.argv.includes('--admin');
const DIR_APP = 'apps/mobile/src/shared/theme';
const DIR_ADMIN = 'apps/api/resources/css';
const CAMINHO_TOKENS = resolve(arg('tokens', join(RAIZ, 'design-system/tokens.json')));
const T = JSON.parse(readFileSync(CAMINHO_TOKENS, 'utf8'));

const TEMAS = T.color.themes.map((t) => t.id);
const [TEMA_BASE] = TEMAS;

/** Raios semânticos por tema: a única diferença de personalidade entre app e admin. */
const RAIO_SEMANTICO = {
  app:   { 'radius-card': '16px', 'radius-control': '12px', 'radius-button': '9999px' },
  admin: { 'radius-card': '8px',  'radius-control': '8px',  'radius-button': '6px' },
};

/** Famílias simples de token: {tokens:[{name,value,usage}]} */
const FAMILIAS_SIMPLES = ['spacing', 'radius', 'duration', 'easing', 'opacity', 'zIndex', 'size'];

const valorNoTema = (v, tema) =>
  typeof v === 'string' ? v : (v[tema] ?? v[TEMA_BASE]);

// ───────────────────────────────────────────── fontes no React Native
//
// No RN uma fonte custom é chamada pelo nome exato com que foi registrada, e
// cada peso é um arquivo. `fontWeight` sobre "Plus Jakarta Sans" não escolhe o
// arquivo certo no Android: o peso tem que estar no nome. Os nomes seguem o
// padrão dos pacotes @expo-google-fonts (ex.: PlusJakartaSans_700Bold).

const SUFIXO_PESO = {
  100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium',
  600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black',
};
/** Primeira família da pilha: "\"Plus Jakarta Sans\", \"Inter\", …" -> "Plus Jakarta Sans" */
const familiaPrincipal = (chave) =>
  T.type.families[chave].split(',')[0].trim().replace(/^"|"$/g, '');
const fonteRN = (chave, peso) => {
  const p = Number(peso);
  if (!SUFIXO_PESO[p]) throw new Error(`Peso sem arquivo de fonte: ${peso} (${chave})`);
  return `${familiaPrincipal(chave).replace(/\s+/g, '')}_${p}${SUFIXO_PESO[p]}`;
};
const pacoteFonte = (chave) =>
  `@expo-google-fonts/${familiaPrincipal(chave).toLowerCase().replace(/\s+/g, '-')}`;
/** Peso padrão de cada família quando usada sem estilo de texto (font-sans, font-display…). */
const PESO_PADRAO_FAMILIA = { display: 700, sans: 400, mono: 400 };

const estilos = () =>
  T.type.groups.flatMap((g) => g.styles.map((s) => ({ ...s, family: s.family ?? g.family })));

/** letterSpacing em em -> px, porque o RN não resolve em. */
const espacamentoPx = (s) =>
  s.letterSpacing?.endsWith('em')
    ? `${+(parseFloat(s.letterSpacing) * parseFloat(s.fontSize)).toFixed(2)}px`
    : s.letterSpacing;

const escrever = (rel, conteudo) => {
  const alvo = join(RAIZ, rel);
  mkdirSync(dirname(alvo), { recursive: true });
  writeFileSync(alvo, conteudo, 'utf8');
  console.log(`  ${rel}  ${conteudo.length.toLocaleString('pt-BR')} bytes`);
};

// ─────────────────────────────────────────────────────────────── CSS

function construirCss() {
  const l = [];
  l.push(`/* ${T.name} — gerado de tokens.json. Não edite. */`);
  l.push('');

  // Bloco base: tema app + todas as famílias não temáticas
  l.push(`:root,\n[data-theme="${TEMA_BASE}"] {`);
  l.push(`  color-scheme: ${TEMA_BASE === 'app' ? 'dark' : 'light'};`);
  for (const t of T.color.tokens) l.push(`  --${t.name}: ${valorNoTema(t.value, TEMA_BASE)};`);
  l.push('');
  for (const fam of FAMILIAS_SIMPLES) {
    if (!T[fam]) continue;
    for (const t of T[fam].tokens) l.push(`  --${t.name}: ${t.value};`);
  }
  if (T.shadow) for (const t of T.shadow.tokens) l.push(`  --${t.name}: ${valorNoTema(t.value, TEMA_BASE)};`);
  l.push('');
  for (const [chave, pilha] of Object.entries(T.type.families)) l.push(`  --font-${chave}: ${pilha};`);
  l.push('');
  for (const [k, v] of Object.entries(RAIO_SEMANTICO[TEMA_BASE] ?? {})) l.push(`  --${k}: ${v};`);
  l.push('}');
  l.push('');

  // Temas seguintes: só as sobrescritas
  for (const tema of TEMAS.slice(1)) {
    l.push(`[data-theme="${tema}"] {`);
    l.push(`  color-scheme: ${tema === 'app' ? 'dark' : 'light'};`);
    for (const t of T.color.tokens) {
      if (typeof t.value === 'string') continue;
      const v = t.value[tema];
      if (v && v !== t.value[TEMA_BASE]) l.push(`  --${t.name}: ${v};`);
    }
    if (T.shadow) for (const t of T.shadow.tokens) {
      if (typeof t.value === 'string') continue;
      const v = t.value[tema];
      if (v && v !== t.value[TEMA_BASE]) l.push(`  --${t.name}: ${v};`);
    }
    for (const [k, v] of Object.entries(RAIO_SEMANTICO[tema] ?? {})) l.push(`  --${k}: ${v};`);
    l.push('}');
    l.push('');
  }

  // Classes de estilo de texto
  l.push('/* Estilos de texto */');
  for (const g of T.type.groups) {
    for (const s of g.styles) {
      const fam = s.family ?? g.family;
      const decl = [
        `font-family: var(--font-${fam})`,
        `font-size: ${s.fontSize}`,
        `line-height: ${s.lineHeight}`,
        `font-weight: ${s.fontWeight}`,
      ];
      if (s.letterSpacing) decl.push(`letter-spacing: ${s.letterSpacing}`);
      if (s.name === 'overline') decl.push('text-transform: uppercase');
      if (s.name === 'numeric') decl.push('font-variant-numeric: tabular-nums');
      l.push(`.${s.name} { ${decl.join('; ')}; }`);
    }
  }
  l.push('');

  // Foco de dois anéis — Sunflare sozinho sobre branco é 1,48:1
  l.push('/* Foco: anel interno da marca + contorno externo que dá o contraste */');
  l.push(':where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {');
  l.push('  outline: none;');
  l.push('  box-shadow: 0 0 0 2px var(--border-focus), 0 0 0 4px var(--border-focus-outline);');
  l.push('}');
  l.push('');

  // Movimento reduzido
  l.push('@media (prefers-reduced-motion: reduce) {');
  l.push('  *, *::before, *::after {');
  l.push('    animation-duration: var(--duration-instant) !important;');
  l.push('    animation-iteration-count: 1 !important;');
  l.push('    transition-duration: var(--duration-instant) !important;');
  l.push('    scroll-behavior: auto !important;');
  l.push('  }');
  l.push('}');
  l.push('');

  // Keyframes do sistema
  l.push('/* Animações nomeadas */');
  l.push('@keyframes ensign-fade-in { from { opacity: 0 } to { opacity: 1 } }');
  l.push('@keyframes ensign-scale-in { from { opacity: 0; transform: scale(.96) } to { opacity: 1; transform: scale(1) } }');
  l.push('@keyframes ensign-slide-up { from { transform: translateY(100%) } to { transform: translateY(0) } }');
  l.push('@keyframes ensign-slide-down { from { opacity: 0; transform: translateY(-12px) } to { opacity: 1; transform: translateY(0) } }');
  l.push('@keyframes ensign-shimmer { from { background-position: -160% 0 } to { background-position: 260% 0 } }');
  l.push('@keyframes ensign-spin { to { transform: rotate(360deg) } }');
  l.push('@keyframes ensign-pulse-accent { 0%, 100% { opacity: 1 } 50% { opacity: .55 } }');
  l.push('');

  return l.join('\n');
}

// ─────────────────────────────────────────────────── preset do Tailwind

/** Agrupa tokens de cor por prefixo semântico: surface-canvas -> {surface: {canvas: …}} */
const PREFIXOS = ['surface', 'content', 'border', 'action', 'feedback', 'status', 'chart'];
const PRIMITIVOS = ['navy', 'champagne', 'sunflare', 'sand'];

function coresPreset(resolver) {
  const out = {};
  for (const t of T.color.tokens) {
    const pre = PREFIXOS.find((p) => t.name === p || t.name.startsWith(`${p}-`));
    if (!pre) continue; // primitivos ficam de fora do preset de propósito
    const resto = t.name === pre ? 'DEFAULT' : t.name.slice(pre.length + 1);
    (out[pre] ??= {})[resto] = resolver(t);
  }
  return out;
}

function escalaSimples(fam, prefixo, resolver) {
  if (!T[fam]) return {};
  const out = {};
  for (const t of T[fam].tokens) {
    const chave = t.name.startsWith(`${prefixo}-`) ? t.name.slice(prefixo.length + 1) : t.name;
    out[chave] = resolver(t);
  }
  return out;
}

function construirPreset({ modo }) {
  const web = modo === 'web';
  const cor = web ? (t) => `var(--${t.name})` : (t) => valorNoTema(t.value, 'app');
  const bruto = web ? (t) => `var(--${t.name})` : (t) => String(t.value);

  const fontSize = {};
  for (const g of T.type.groups) {
    for (const s of g.styles) {
      fontSize[s.name] = [s.fontSize, {
        lineHeight: String(s.lineHeight),
        fontWeight: String(s.fontWeight),
        ...(s.letterSpacing ? { letterSpacing: s.letterSpacing } : {}),
      }];
    }
  }

  const fontFamily = {};
  for (const chave of Object.keys(T.type.families)) {
    fontFamily[chave] = web
      ? [`var(--font-${chave})`]
      : [fonteRN(chave, PESO_PADRAO_FAMILIA[chave] ?? 400)];
  }

  const borderRadius = {
    ...escalaSimples('radius', 'radius', bruto),
    card: web ? 'var(--radius-card)' : RAIO_SEMANTICO.app['radius-card'],
    control: web ? 'var(--radius-control)' : RAIO_SEMANTICO.app['radius-control'],
    button: web ? 'var(--radius-button)' : RAIO_SEMANTICO.app['radius-button'],
  };

  const theme = {
    colors: coresPreset(cor),
    spacing: { ...escalaSimples('spacing', 'space', bruto), ...escalaSimples('size', 'size', bruto) },
    borderRadius,
    // No nativo, os estilos de texto viram utilitários (abaixo) para carregar a fonte certa.
    ...(web ? { fontSize } : {}),
    fontFamily,
    transitionDuration: escalaSimples('duration', 'duration', bruto),
    transitionTimingFunction: escalaSimples('easing', 'ease', bruto),
    zIndex: escalaSimples('zIndex', 'z', bruto),
    opacity: escalaSimples('opacity', 'opacity', bruto),
    ...(web ? { boxShadow: escalaSimples('shadow', 'shadow', bruto) } : {}),
  };

  const cabecalho = `/* ${T.name} — preset do Tailwind (${modo}). Gerado de tokens.json. Não edite. */\n`;
  if (web) {
    return cabecalho + `module.exports = ${JSON.stringify({ theme: { extend: theme } }, null, 2)};\n`;
  }

  // Nativo: `text-h2` etc. trazem família (com o peso no nome), tamanho, linha e tracking.
  const utilitarios = {};
  for (const s of estilos()) {
    utilitarios[`.text-${s.name}`] = {
      fontFamily: fonteRN(s.family, s.fontWeight),
      fontSize: s.fontSize,
      lineHeight: String(s.lineHeight),
      ...(s.letterSpacing ? { letterSpacing: espacamentoPx(s) } : {}),
      ...(s.name === 'overline' ? { textTransform: 'uppercase' } : {}),
      ...(s.name === 'numeric' ? { fontVariantNumeric: 'tabular-nums' } : {}),
    };
  }
  return cabecalho
    + `const plugin = require('tailwindcss/plugin');\n\n`
    + `const theme = ${JSON.stringify({ extend: theme }, null, 2)};\n\n`
    + `const estilosDeTexto = ${JSON.stringify(utilitarios, null, 2)};\n\n`
    + `module.exports = {\n  theme,\n  plugins: [plugin(({ addUtilities }) => addUtilities(estilosDeTexto))],\n};\n`;
}

// ───────────────────────────────────────────────────────── fonts.ts (RN)

function construirFontes() {
  const porPacote = {};
  for (const s of estilos()) (porPacote[pacoteFonte(s.family)] ??= new Set()).add(fonteRN(s.family, s.fontWeight));
  for (const [chave, peso] of Object.entries(PESO_PADRAO_FAMILIA)) {
    if (T.type.families[chave]) (porPacote[pacoteFonte(chave)] ??= new Set()).add(fonteRN(chave, peso));
  }
  const imports = Object.entries(porPacote)
    .map(([pkg, nomes]) => `import { ${[...nomes].sort().join(', ')} } from '${pkg}';`);
  const todos = Object.values(porPacote).flatMap((n) => [...n]).sort();
  return `// ${T.name} — gerado de tokens.json. Não edite.
// Só os pesos que algum estilo de texto usa: cada peso a mais é byte em conexão móvel.
${imports.join('\n')}

export const fontes = {
${todos.map((n) => `  ${n},`).join('\n')}
};
`;
}

// ─────────────────────────────────────────────────────────── tokens.ts

function construirTs() {
  const porTema = {};
  for (const tema of TEMAS) {
    porTema[tema] = Object.fromEntries(
      T.color.tokens.map((t) => [t.name, valorNoTema(t.value, tema)]),
    );
  }
  const simples = {};
  for (const fam of FAMILIAS_SIMPLES) {
    if (!T[fam]) continue;
    simples[fam] = Object.fromEntries(T[fam].tokens.map((t) => [t.name, t.value]));
  }
  // Pronto para usar em `style` no RN: fontFamily já é o arquivo do peso certo.
  const tipo = Object.fromEntries(
    estilos().map((s) => [s.name, {
      fontFamily: fonteRN(s.family, s.fontWeight),
      fontSize: parseFloat(s.fontSize),
      lineHeight: parseFloat(String(s.lineHeight)),
      ...(s.letterSpacing ? { letterSpacing: parseFloat(espacamentoPx(s)) } : {}),
      ...(s.name === 'overline' ? { textTransform: 'uppercase' } : {}),
      ...(s.name === 'numeric' ? { fontVariant: ['tabular-nums'] } : {}),
    }]),
  );

  return `// ${T.name} — gerado de tokens.json. Não edite.

export const temas = ${JSON.stringify(porTema, null, 2)} as const;

export const escalas = ${JSON.stringify(simples, null, 2)} as const;

export const textoEstilos = ${JSON.stringify(tipo, null, 2)} as const;

export const familias = ${JSON.stringify(T.type.families, null, 2)} as const;

export const raiosSemanticos = ${JSON.stringify(RAIO_SEMANTICO, null, 2)} as const;

export type TemaId = keyof typeof temas;
export type TokenCor = keyof (typeof temas)['${TEMA_BASE}'];
export type EstiloTexto = keyof typeof textoEstilos;

/** Tema padrão do app. O admin usa o CSS com data-theme="admin". */
export const cor = temas.${TEMA_BASE};
`;
}

// ───────────────────────────────────────────────────────────── executa

console.log(`Ensign — gerando de ${CAMINHO_TOKENS}`);
escrever(`${DIR_APP}/tailwind-preset.native.js`, construirPreset({ modo: 'native' }));
escrever(`${DIR_APP}/tokens.ts`, construirTs());
escrever(`${DIR_APP}/fonts.ts`, construirFontes());
if (COM_ADMIN) {
  escrever(`${DIR_ADMIN}/ensign-theme.css`, construirCss());
  escrever(`${DIR_ADMIN}/tailwind-preset.web.js`, construirPreset({ modo: 'web' }));
}
console.log(
  `Pronto: ${T.color.tokens.length} cores, ${TEMAS.length} temas, ` +
  `${T.type.groups.reduce((n, g) => n + g.styles.length, 0)} estilos de texto.`,
);
