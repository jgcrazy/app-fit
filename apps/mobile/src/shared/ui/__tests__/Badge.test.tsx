import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { Badge, ROTULO_STATUS, type TomStatus } from '../Badge';

/** Contrato do Badge (artifact Ensign, components/Badge/README.md). */
describe('Badge', () => {
  test.each(Object.entries(ROTULO_STATUS) as [TomStatus, string][])(
    'tom %s sem rótulo usa o padrão "%s"',
    async (tom, rotulo) => {
      await render(<Badge tone={tom} />);
      expect(screen.getByText(rotulo)).toBeTruthy();
    },
  );

  test('rótulo próprio substitui o padrão e é o nome acessível', async () => {
    await render(<Badge tone="active">Concluído</Badge>);
    expect(screen.getByLabelText('Concluído')).toBeTruthy();
    expect(screen.queryByText('Ativo')).toBeNull();
  });

  test('sem tom é neutro', async () => {
    await render(<Badge />);
    expect(screen.getByText('Rascunho')).toBeTruthy();
  });

  test('o ponto é reforço: dot={false} remove só o ponto, o rótulo fica', async () => {
    const comPonto = JSON.stringify((await render(<Badge tone="pending" />)).toJSON());
    const semPonto = JSON.stringify((await render(<Badge tone="pending" dot={false} />)).toJSON());
    expect(comPonto).toContain('bg-status-pending-fg');
    expect(semPonto).not.toContain('bg-status-pending-fg');
    expect(semPonto).toContain('Pendente');
  });
});
