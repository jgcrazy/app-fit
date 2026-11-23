import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Card } from '../Card';
import { ListCard } from '../ListCard';

/** Contrato do ListCard (artifact Ensign, components/ListCard/README.md). */
describe('ListCard', () => {
  const treino = { title: 'Treino A — Peito e tríceps', meta: 'Hoje, 07:30', value: '45 min' };

  test('mostra título, metadado e valor como vieram (sem formatar)', async () => {
    await render(<ListCard {...treino} />);
    expect(screen.getByText('Treino A — Peito e tríceps')).toBeTruthy();
    expect(screen.getByText('Hoje, 07:30')).toBeTruthy();
    expect(screen.getByText('45 min')).toBeTruthy();
  });

  test('título trunca em uma linha', async () => {
    await render(<ListCard {...treino} />);
    expect(screen.getByText('Treino A — Peito e tríceps').props.numberOfLines).toBe(1);
  });

  test('um nome acessível só, na ordem de leitura da linha', async () => {
    await render(<ListCard {...treino} status="active" statusLabel="Concluído" />);
    expect(screen.getByLabelText('Treino A — Peito e tríceps, Hoje, 07:30, Concluído, 45 min')).toBeTruthy();
  });

  test('status sem rótulo próprio usa o padrão do tom', async () => {
    await render(<ListCard title="Treino B" status="pending" />);
    expect(screen.getByLabelText('Treino B, Pendente')).toBeTruthy();
  });

  test('sem onPress não é botão', async () => {
    await render(<ListCard {...treino} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('com onPress a linha inteira é um botão que dispara', async () => {
    const onPress = jest.fn();
    await render(<ListCard {...treino} onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: /Treino A/ }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('Card', () => {
  test('renderiza o conteúdo', async () => {
    await render(
      <Card>
        <Text>Resumo da semana</Text>
      </Card>,
    );
    expect(screen.getByText('Resumo da semana')).toBeTruthy();
  });
});
