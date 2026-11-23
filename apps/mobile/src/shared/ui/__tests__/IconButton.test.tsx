import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { IconButton } from '../IconButton';

/** Contrato do IconButton (artifact Ensign, components/Button/README.md, seção IconButton). */
describe('IconButton', () => {
  test('o label é o nome acessível do botão', async () => {
    await render(<IconButton name="bell" label="Notificações" />);
    expect(screen.getByRole('button', { name: 'Notificações' })).toBeTruthy();
  });

  test('o ícone é decorativo: não vira uma segunda imagem com nome', async () => {
    await render(<IconButton name="bell" label="Notificações" />);
    expect(screen.queryByRole('image')).toBeNull();
  });

  test('chama onPress ao tocar', async () => {
    const onPress = jest.fn();
    await render(<IconButton name="chevron-left" label="Voltar" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Voltar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('desabilitado não dispara e anuncia o estado', async () => {
    const onPress = jest.fn();
    await render(<IconButton name="x" label="Fechar" onPress={onPress} disabled />);
    const botao = screen.getByRole('button', { name: 'Fechar' });
    await fireEvent.press(botao);
    expect(onPress).not.toHaveBeenCalled();
    expect(botao.props.accessibilityState).toMatchObject({ disabled: true });
  });

  test('alvo de 44×44 (size-touch) mesmo com ícone de 16px', async () => {
    await render(<IconButton name="plus" label="Adicionar" size={16} />);
    // No Jest o NativeWind não compila className em style: confere-se a classe
    // da caixa de toque (o CSS gerado foi conferido no build web) e o ícone.
    const arvore = JSON.stringify(screen.toJSON());
    expect(arvore).toMatch(/"className":"size-touch[^"]*"/);
    expect(arvore).toContain('"width":16');
    expect(arvore).toContain('"height":16');
  });
});
