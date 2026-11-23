import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Field } from '../Field';

/** Contrato do Field (artifact Ensign, components/Field/README.md). */
describe('Field — input', () => {
  test('o rótulo fica acima e é o nome acessível do campo', async () => {
    await render(<Field label="Peso (kg)" placeholder="Ex.: 72,5" />);
    expect(screen.getByText('Peso (kg)')).toBeTruthy();
    expect(screen.getByLabelText('Peso (kg)')).toBeTruthy();
  });

  test('repassa o texto digitado', async () => {
    const onChangeText = jest.fn();
    await render(<Field label="Nome" onChangeText={onChangeText} />);
    await fireEvent.changeText(screen.getByLabelText('Nome'), 'Ana');
    expect(onChangeText).toHaveBeenCalledWith('Ana');
  });

  test('obrigatório é dito em texto, não só com cor', async () => {
    await render(<Field label="E-mail" required />);
    expect(screen.getByText(/obrigatório/)).toBeTruthy();
  });

  test('ajuda aparece e vira a dica de acessibilidade', async () => {
    await render(<Field label="Altura (cm)" help="Sem sapato." />);
    expect(screen.getByText('Sem sapato.')).toBeTruthy();
    expect(screen.getByLabelText('Altura (cm)').props.accessibilityHint).toBe('Sem sapato.');
  });

  test('erro substitui a ajuda, é anunciado e marca o campo inválido', async () => {
    await render(<Field label="Altura (cm)" help="Sem sapato." error="Use só números. Ex.: 172" />);
    expect(screen.queryByText('Sem sapato.')).toBeNull();
    expect(screen.getByRole('alert')).toBeTruthy();
    const campo = screen.getByLabelText('Altura (cm)');
    expect(campo.props.accessibilityHint).toBe('Use só números. Ex.: 172');
    expect(campo.props['aria-invalid']).toBe(true);
  });

  test('desabilitado não é editável', async () => {
    await render(<Field label="CPF" disabled />);
    expect(screen.getByLabelText('CPF').props.editable).toBe(false);
  });

  test('textarea é multilinha', async () => {
    await render(<Field as="textarea" label="Observações" />);
    expect(screen.getByLabelText('Observações').props.multiline).toBe(true);
  });
});

describe('Field — select', () => {
  const opcoes = [
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediario', label: 'Intermediário' },
  ];

  test('mostra a opção escolhida e anuncia como valor', async () => {
    await render(<Field as="select" label="Nível" options={opcoes} value="intermediario" />);
    const gatilho = screen.getByRole('button', { name: 'Nível' });
    expect(gatilho.props.accessibilityValue).toEqual({ text: 'Intermediário' });
  });

  test('sem valor mostra o placeholder', async () => {
    await render(<Field as="select" label="Nível" options={opcoes} placeholder="Escolha um nível" />);
    expect(screen.getAllByText('Escolha um nível').length).toBeGreaterThan(0);
  });

  test('escolher uma opção no menu chama onValueChange com o value', async () => {
    const onValueChange = jest.fn();
    await render(<Field as="select" label="Nível" options={opcoes} onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByTestId('menu-opcao-iniciante'));
    expect(onValueChange).toHaveBeenCalledWith('iniciante');
  });

  test('a opção atual vem marcada no menu', async () => {
    await render(<Field as="select" label="Nível" options={opcoes} value="iniciante" />);
    expect(screen.getByTestId('menu-opcao-iniciante').props.accessibilityState).toMatchObject({ checked: true });
    expect(screen.getByTestId('menu-opcao-intermediario').props.accessibilityState).toMatchObject({ checked: false });
  });

  test('desabilitado não abre menu', async () => {
    await render(<Field as="select" label="Nível" options={opcoes} disabled />);
    expect(screen.queryByTestId('menu-opcao-iniciante')).toBeNull();
  });
});
