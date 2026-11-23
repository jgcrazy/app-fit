import { describe, expect, test } from '@jest/globals';

import { ALTURA_TAB_BAR, paddingInferiorTela, px } from '../layout';
import { escalas } from '../tokens';

describe('helpers de layout', () => {
  test('px converte valor de token em número', () => {
    expect(px('16px')).toBe(16);
    expect(px('1.75px')).toBe(1.75);
    expect(px('120ms')).toBe(120);
  });

  test('padding inferior vence safe area + tab bar + space-4', () => {
    const insetInferior = 34;
    expect(paddingInferiorTela(insetInferior)).toBe(
      insetInferior + ALTURA_TAB_BAR + px(escalas.spacing['space-4']),
    );
  });

  test('área de toque mínima do design system é 44px', () => {
    expect(px(escalas.size['size-touch'])).toBe(44);
  });
});
