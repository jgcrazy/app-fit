/**
 * Garantias de contraste do Ensign, medidas nos tokens gerados (tema app).
 * Se alguém mudar uma cor em design-system/tokens.json e quebrar a leitura,
 * este teste fica vermelho no CI. Limites: WCAG 2 — 4,5:1 texto, 3:1 borda/ícone.
 */
import { describe, expect, test } from '@jest/globals';

import { cor, type TokenCor } from '../tokens';

/** "#RRGGBB" ou "#RRGGBBAA" -> luminância relativa (WCAG 2). Alfa é ignorado. */
function luminancia(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contraste(a: string, b: string) {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

const par = (texto: TokenCor, fundo: TokenCor) => contraste(cor[texto], cor[fundo]);

describe('contraste dos tokens do tema app', () => {
  test.each<[TokenCor, TokenCor]>([
    ['content-primary', 'surface-canvas'],
    ['content-primary', 'surface-raised'],
    ['content-secondary', 'surface-canvas'],
    ['content-muted', 'surface-raised'],
    ['content-on-accent', 'surface-accent'],
    ['content-on-secondary', 'surface-secondary'],
    ['action-primary-fg', 'action-primary-bg'],
    ['action-primary-fg', 'action-primary-bg-active'],
    ['action-danger-fg', 'action-danger-bg'],
  ])('texto %s sobre %s passa 4,5:1', (texto, fundo) => {
    expect(par(texto, fundo)).toBeGreaterThanOrEqual(4.5);
  });

  test.each<[TokenCor, TokenCor]>([
    ['action-secondary-border', 'surface-canvas'],
    ['border-focus', 'surface-canvas'],
  ])('borda %s sobre %s passa 3:1', (borda, fundo) => {
    expect(par(borda, fundo)).toBeGreaterThanOrEqual(3);
  });

  test('texto do botão primário é navy, nunca branco', () => {
    expect(cor['action-primary-fg']).toBe(cor['content-on-accent']);
    // A regra dura do Ensign: branco sobre Sunflare é ilegível (1,48:1).
    expect(contraste('#FFFFFF', cor['action-primary-bg'])).toBeLessThan(2); // ensign-lint-ignore: o branco proibido, de propósito
  });
});
