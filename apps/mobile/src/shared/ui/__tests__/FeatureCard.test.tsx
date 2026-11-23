import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { FeatureCard } from '../FeatureCard';

/** Contrato do FeatureCard (artifact Ensign, components/FeatureCard/README.md). */
describe('FeatureCard', () => {
  test('título é um cabeçalho e o texto aparece', async () => {
    await render(<FeatureCard title="Registre seu primeiro treino" body="Leva menos de um minuto." />);
    expect(screen.getByRole('header', { name: 'Registre seu primeiro treino' })).toBeTruthy();
    expect(screen.getByText('Leva menos de um minuto.')).toBeTruthy();
  });

  test('CTA é um botão que dispara', async () => {
    const onCta = jest.fn();
    await render(<FeatureCard title="Novo: metas semanais" cta="Ver metas" onCta={onCta} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Ver metas' }));
    expect(onCta).toHaveBeenCalledTimes(1);
  });

  test('sem onCta não mostra botão (CTA sem ação é botão morto)', async () => {
    await render(<FeatureCard title="Novo: metas semanais" cta="Ver metas" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('texto sobre o bege usa content-on-secondary, nunca a cor de texto padrão', async () => {
    const arvore = JSON.stringify((await render(<FeatureCard title="T" body="B" />)).toJSON());
    expect(arvore).toContain('text-content-on-secondary');
    expect(arvore).not.toContain('text-content-primary');
  });
});
