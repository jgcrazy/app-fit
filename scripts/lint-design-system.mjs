#!/usr/bin/env node
/**
 * Ensign Design System — lint.
 *
 * Falha quando o código do produto escapa do sistema. Rode no pre-commit e no CI:
 * lint que não roda automático não existe.
 *
 * Uso:  node scripts/lint-design-system.mjs [caminho...]
 *       (sem argumento, varre o código de UI do monorepo: apps/mobile/src)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, extname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
/**
 * Onde mora UI de produto. Scripts de ETL, testes e config não são tela.
 * Quando o admin existir, acrescente 'apps/api/resources' (e rode o build com --admin).
 * Hoje lá só há a welcome.blade.php padrão do Laravel, que não é tela do produto.
 */
const ALVOS_PADRAO = ['apps/mobile/src'];

/** Arquivos gerados e dependências: o sistema pode ter hex, o produto não. */
const IGNORAR_CAMINHO = [
  'node_modules', 'vendor', 'dist', 'build', '.git', 'storage', 'public/build',
  'bootstrap/cache', '.expo', 'ios', 'android', 'coverage',
];
const IGNORAR_ARQUIVO = [
  'tokens.json', 'tokens.ts', 'ensign-theme.css',
  'tailwind-preset.web.js', 'tailwind-preset.native.js', 'tailwind-preset.js',
];
const EXTENSOES = ['.php', '.blade.php', '.js', '.jsx', '.ts', '.tsx', '.vue', '.css', '.scss'];

const REGRAS = [
  {
    nome: 'hex-solto',
    re: /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{1,5})?\b/g,
    msg: 'Hex no código. Use um token semântico (surface-*, content-*, border-*).',
    // IDs de elemento, âncoras e comentários de issue não são cor
    falsoPositivo: (linha) => /(?:href|id|#\{|\$ref|aria-|\bissue\b|\bPR\b)/i.test(linha),
  },
  {
    nome: 'funcao-de-cor',
    re: /\b(?:rgba?|hsla?)\s*\(/g,
    msg: 'Função de cor no código. Use um token semântico.',
  },
  {
    nome: 'rampa-primitiva',
    re: /\b(?:navy|champagne|sunflare|sand)-(?:50|975|\d{3}|\d{2})\b/g,
    msg: 'Rampa primitiva no produto. Primitivos só existem dentro do design system.',
  },
  {
    nome: 'branco-no-amarelo',
    re: /(?:surface-accent|action-primary-bg)(?![-\w])[^\n]{0,120}?\b(?:text-white|color:\s*#fff|#ffffff)\b/gi,
    msg: 'Branco sobre Sunflare é 1,48:1. Use content-on-accent (navy, 10,42:1).',
  },
  {
    nome: 'valor-arbitrario',
    re: /\b(?:bg|text|border|from|to|via|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-[xy]|rounded(?:-[tbrl]{1,2})?|w|h|min-w|min-h|max-w|max-h|leading|tracking|shadow|duration|ease)-\[/g,
    msg: 'Valor arbitrário do Tailwind. Use a escala; se falta um passo, discuta antes de inventar.',
    // max-w-[1280px] vem de size-content-max e é tolerado no layout do admin
    falsoPositivo: (linha) => /max-w-\[1280px\]/.test(linha),
  },
  {
    nome: 'foco-removido',
    re: /outline:\s*(?:none|0)\b/g,
    msg: 'outline:none sem substituir o indicador. Use a receita de foco de dois anéis.',
    falsoPositivo: (linha) => /box-shadow|focus-visible|border-focus/.test(linha),
  },
  {
    nome: 'div-interativa',
    re: /<(?:div|span)[^>]*\bon(?:Click|click)\b/g,
    msg: 'onClick em div/span: o Tab não alcança. Use <button> ou <a href>.',
  },
  {
    nome: 'emoji-na-ui',
    re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,
    msg: 'Emoji na UI. Use um ícone do Lucide.',
  },
];

function* arquivos(dir) {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    const rel = relative(RAIZ, caminho);
    if (IGNORAR_CAMINHO.some((p) => rel === p || rel.startsWith(`${p}/`))) continue;
    if (nome.startsWith('.') && nome !== '.') continue;
    const st = statSync(caminho);
    if (st.isDirectory()) { yield* arquivos(caminho); continue; }
    if (IGNORAR_ARQUIVO.includes(basename(caminho))) continue;
    const ext = nome.endsWith('.blade.php') ? '.blade.php' : extname(nome);
    if (!EXTENSOES.includes(ext)) continue;
    yield caminho;
  }
}

const alvos = process.argv.slice(2);
const lista = (alvos.length ? alvos.map((a) => resolve(a)) : ALVOS_PADRAO.map((a) => join(RAIZ, a)))
  .flatMap((a) => (statSync(a).isDirectory() ? [...arquivos(a)] : [a]));

const achados = [];
for (const caminho of lista) {
  const linhas = readFileSync(caminho, 'utf8').split('\n');
  linhas.forEach((linha, i) => {
    if (/ensign-lint-ignore/.test(linha)) return;
    for (const r of REGRAS) {
      r.re.lastIndex = 0;
      if (!r.re.test(linha)) continue;
      if (r.falsoPositivo?.(linha)) continue;
      achados.push({
        arquivo: relative(RAIZ, caminho), linha: i + 1,
        regra: r.nome, msg: r.msg, trecho: linha.trim().slice(0, 100),
      });
    }
  });
}

if (!achados.length) {
  console.log(`Ensign lint: ${lista.length} arquivos, nenhum problema.`);
  process.exit(0);
}

const porRegra = achados.reduce((a, f) => ((a[f.regra] ??= []).push(f), a), {});
for (const [regra, itens] of Object.entries(porRegra)) {
  console.error(`\n${regra} (${itens.length})`);
  console.error(`  ${itens[0].msg}`);
  for (const f of itens) console.error(`    ${f.arquivo}:${f.linha}  ${f.trecho}`);
}
console.error(`\nEnsign lint: ${achados.length} problemas em ${lista.length} arquivos.`);
process.exit(1);
