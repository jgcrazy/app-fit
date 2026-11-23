#!/usr/bin/env node
/**
 * Confere a mensagem de commit: Conventional Commits citando a issue.
 *
 *   feat(mobile): Button do Ensign (#7)
 *   fix(ci): workflow inválido (#3)
 *   docs: regras de redação (#15)
 *
 * Tipos: feat fix docs chore ci test refactor perf build style revert.
 * Escopo opcional, em minúsculas. A issue (#N) pode estar no título ou no corpo
 * ("Refs #N", "Closes #N"). Merges, reverts automáticos e fixup!/squash! passam.
 *
 * Uso: node scripts/check-commit-msg.mjs <arquivo-da-mensagem>
 * Roda no hook commit-msg (.githooks/) e no CI, para cada commit do PR.
 */
import { readFileSync } from 'node:fs';

const arquivo = process.argv[2];
if (!arquivo) {
  console.error('uso: check-commit-msg.mjs <arquivo>');
  process.exit(2);
}

const mensagem = readFileSync(arquivo, 'utf8')
  .split('\n')
  .filter((l) => !l.startsWith('#')) // comentários do editor do git
  .join('\n')
  .trim();
const [titulo = ''] = mensagem.split('\n');

const LIVRE = /^(Merge |Revert "|fixup! |squash! |amend! )/;
const PADRAO = /^(feat|fix|docs|chore|ci|test|refactor|perf|build|style|revert)(\([a-z0-9-]+\))?!?: \S.+/;
const ISSUE = /#\d+/;

const erros = [];
if (!LIVRE.test(titulo)) {
  if (!PADRAO.test(titulo)) {
    erros.push('O título não segue Conventional Commits: "tipo(escopo): descrição".');
  }
  if (titulo.length > 100) erros.push(`O título tem ${titulo.length} caracteres (máximo 100).`);
  if (!ISSUE.test(mensagem)) {
    erros.push('A mensagem não cita a issue (#N). Todo trabalho tem issue: abra uma no GitHub e cite.');
  }
}

if (erros.length) {
  console.error(`\nCommit recusado:\n  ${titulo || '(mensagem vazia)'}\n`);
  for (const e of erros) console.error(`  - ${e}`);
  console.error('\nExemplo: feat(mobile): Button do Ensign (#7)\n');
  process.exit(1);
}
