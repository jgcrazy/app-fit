import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppHeader } from '../AppHeader';

/** Contrato do AppHeader (artifact Ensign, components/AppHeader/README.md). */
describe('AppHeader', () => {
  test('o título é o cabeçalho da tela e trunca em uma linha', async () => {
    await render(<AppHeader title="Treinos" />);
    const titulo = screen.getByRole('header', { name: 'Treinos' });
    expect(titulo.props.numberOfLines).toBe(1);
  });

  test('título em content-on-brand, nunca content-primary', async () => {
    const arvore = JSON.stringify((await render(<AppHeader title="Treinos" />)).toJSON());
    expect(arvore).toContain('text-content-on-brand');
    expect(arvore).not.toContain('text-content-primary');
  });

  test('saudação aparece acima do título quando existe', async () => {
    await render(<AppHeader title="Início" greeting="Boa noite, Ana" />);
    expect(screen.getByText('Boa noite, Ana')).toBeTruthy();
  });

  test('sem onBack não há botão Voltar', async () => {
    await render(<AppHeader title="Início" />);
    expect(screen.queryByRole('button', { name: 'Voltar' })).toBeNull();
  });

  test('Voltar dispara onBack', async () => {
    const onBack = jest.fn();
    await render(<AppHeader title="Treino A" onBack={onBack} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test('ações viram botões de ícone com nome acessível', async () => {
    const onPress = jest.fn();
    await render(<AppHeader title="Início" actions={[{ icon: 'bell', label: 'Notificações', onPress }]} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Notificações' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
