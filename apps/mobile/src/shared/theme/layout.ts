import { Platform } from 'react-native';

import { escalas } from './tokens';

/** "16px" -> 16. Para quando o RN pede número (estilo imperativo, Reanimated). */
export const px = (valor: string) => parseFloat(valor);

/**
 * Altura da tab bar nativa, que o padding inferior das telas precisa vencer.
 * É medida da plataforma, não token.
 */
export const ALTURA_TAB_BAR = Platform.select({ ios: 50, android: 80 }) ?? 0;

/**
 * Espessura de cada anel do foco, da receita do Ensign (04-movimento):
 * 2px de border-focus por dentro + 2px de border-focus-outline por fora.
 */
export const ANEL_FOCO = 2;

/** Padding inferior de tela com scroll: safe area + tab bar + space-4. Sem isso o último card some atrás da tab bar. */
export const paddingInferiorTela = (insetInferior: number) =>
  insetInferior + ALTURA_TAB_BAR + px(escalas.spacing['space-4']);
