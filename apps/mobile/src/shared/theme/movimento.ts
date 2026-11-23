import { Easing } from 'react-native-reanimated';

import { escalas } from './tokens';

type NomeDuracao = keyof typeof escalas.duration;
type NomeCurva = keyof typeof escalas.easing;

/** "120ms" -> 120. */
export const duracao = (nome: NomeDuracao) => parseFloat(escalas.duration[nome]);

/** "cubic-bezier(0.2,0,0,1)" -> Easing.bezier(0.2, 0, 0, 1). "linear" -> Easing.linear. */
export const curva = (nome: NomeCurva) => {
  const valor: string = escalas.easing[nome];
  const m = /cubic-bezier\(([^)]+)\)/.exec(valor);
  if (!m) return Easing.linear;
  const [x1, y1, x2, y2] = m[1].split(',').map(Number);
  return Easing.bezier(x1, y1, x2, y2);
};
