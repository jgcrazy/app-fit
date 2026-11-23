import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { cor } from '@/shared/theme/tokens';

import { Icon } from '../Icon';

describe('Icon', () => {
  test('com label vira imagem com nome acessível', async () => {
    await render(<Icon name="bell" label="Notificações" />);
    expect(screen.getByRole('image', { name: 'Notificações' })).toBeTruthy();
  });

  test('sem label é decorativo e fica fora da árvore de acessibilidade', async () => {
    await render(<Icon name="plus" />);
    expect(screen.queryByRole('image')).toBeNull();
  });

  test('traço de 1,75px abaixo de 24px e 2px a partir de 24px', async () => {
    const { rerender, toJSON } = await render(<Icon name="check" size={20} />);
    expect(JSON.stringify(toJSON())).toContain('"strokeWidth":1.75');
    await rerender(<Icon name="check" size={24} />);
    expect(JSON.stringify(toJSON())).toContain('"strokeWidth":2');
  });

  test('a cor vem do token, padrão content-primary', async () => {
    const { toJSON } = await render(<Icon name="info" />);
    expect(JSON.stringify(toJSON())).toContain(cor['content-primary']);
  });
});
