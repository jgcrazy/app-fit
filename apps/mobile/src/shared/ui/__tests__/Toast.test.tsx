import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Toast } from '../Toast';

/** Contrato do Toast (artifact Ensign, components/Toast/README.md). */
describe('Toast', () => {
  test('mostra título e descrição', async () => {
    await render(<Toast tone="success" title="Treino salvo" description="Ele já aparece no seu histórico." />);
    expect(screen.getByText('Treino salvo')).toBeTruthy();
    expect(screen.getByText('Ele já aparece no seu histórico.')).toBeTruthy();
  });

  test('erro é um alerta que interrompe o leitor de tela', async () => {
    await render(<Toast tone="error" title="Não foi possível salvar" description="Confira a conexão e tente de novo." />);
    const alerta = screen.getByRole('alert', { name: 'Não foi possível salvar. Confira a conexão e tente de novo.' });
    expect(alerta.props.accessibilityLiveRegion).toBe('assertive');
  });

  test.each(['success', 'warning', 'info'] as const)('%s é anunciado sem interromper e não é alerta', async (tom) => {
    const { toJSON } = await render(<Toast tone={tom} title="Aviso" />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(JSON.stringify(toJSON())).toContain('"accessibilityLiveRegion":"polite"');
  });

  test('a cor do tom fica na barra lateral, não no fundo', async () => {
    const arvore = JSON.stringify((await render(<Toast tone="warning" title="Aviso" />)).toJSON());
    expect(arvore).toContain('border-l-feedback-warning-border');
    expect(arvore).toContain('bg-surface-overlay');
    expect(arvore).not.toContain('bg-feedback-warning');
  });

  test('com erro, Fechar e a ação continuam botões focáveis fora do alerta', async () => {
    await render(<Toast tone="error" title="Falhou" onClose={() => {}} action={{ label: 'Tentar de novo', onPress: () => {} }} />);
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeTruthy();
  });

  test('Fechar só aparece com onClose e dispara', async () => {
    const onClose = jest.fn();
    await render(<Toast title="Pronto" onClose={onClose} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Fechar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('sem onClose não há botão Fechar', async () => {
    await render(<Toast title="Pronto" />);
    expect(screen.queryByRole('button', { name: 'Fechar' })).toBeNull();
  });

  test('ação opcional vira botão', async () => {
    const onPress = jest.fn();
    await render(<Toast tone="info" title="Registro removido" action={{ label: 'Desfazer', onPress }} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Desfazer' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
