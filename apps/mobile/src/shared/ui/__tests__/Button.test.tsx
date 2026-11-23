import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '../Button';

/**
 * Contrato do Button (artifact Ensign, components/Button/README.md):
 * rótulo é o nome acessível, disabled e loading não disparam, loading avisa
 * "ocupado" e mantém o rótulo no lugar, e todo tamanho tem alvo de 44px.
 */
describe('Button', () => {
  test('é um botão com o rótulo como nome acessível', async () => {
    await render(<Button>Registrar treino</Button>);
    expect(screen.getByRole('button', { name: 'Registrar treino' })).toBeTruthy();
  });

  test('chama onPress ao tocar', async () => {
    const onPress = jest.fn();
    await render(<Button onPress={onPress}>Salvar</Button>);
    await fireEvent.press(screen.getByRole('button', { name: 'Salvar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('desabilitado não dispara e anuncia o estado', async () => {
    const onPress = jest.fn();
    await render(
      <Button onPress={onPress} disabled>
        Salvar
      </Button>,
    );
    const botao = screen.getByRole('button', { name: 'Salvar' });
    await fireEvent.press(botao);
    expect(onPress).not.toHaveBeenCalled();
    // No nativo o aria-* do Pressable vira accessibilityState no elemento.
    expect(botao.props.accessibilityState).toMatchObject({ disabled: true });
  });

  test('loading não dispara, anuncia ocupado e mostra o spinner', async () => {
    const onPress = jest.fn();
    await render(
      <Button onPress={onPress} loading>
        Salvando
      </Button>,
    );
    const botao = screen.getByRole('button', { name: 'Salvando' });
    await fireEvent.press(botao);
    expect(onPress).not.toHaveBeenCalled();
    expect(botao.props.accessibilityState).toMatchObject({ disabled: true, busy: true });
    // O rótulo continua montado (invisível) para a largura não mudar.
    expect(screen.getByText('Salvando')).toBeTruthy();
    expect(screen.getByTestId('button-spinner')).toBeTruthy();
  });

  test.each([
    ['sm', 6], // 32px de altura: cresce 6px em cima e embaixo até 44
    ['md', 2], // 40px: cresce 2px
    ['lg', 0], // 48px: já passa de 44
  ] as const)('tamanho %s tem alvo de toque de 44px (hitSlop %i)', async (size, folga) => {
    await render(<Button size={size}>Ok</Button>);
    const botao = screen.getByRole('button', { name: 'Ok' });
    expect(botao.props.hitSlop).toEqual({ top: folga, bottom: folga });
  });
});
