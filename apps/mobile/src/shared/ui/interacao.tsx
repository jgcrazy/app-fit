import { useState } from 'react';
import { View } from 'react-native';
import { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { ANEL_FOCO } from '@/shared/theme/layout';
import { curva, duracao } from '@/shared/theme/movimento';

/**
 * Comportamento comum dos pressionáveis do Ensign (Button, IconButton…):
 * press em scale 0,97 / duration-fast / ease-standard, cortado com movimento
 * reduzido, e o estado de foco para o anel.
 */
export function useInteracao() {
  const [focado, setFocado] = useState(false);
  const reduzirMovimento = useReducedMotion();
  const escala = useSharedValue(1);
  const estiloEscala = useAnimatedStyle(() => ({ transform: [{ scale: escala.get() }] }));

  const pressionar = (valor: number) => {
    if (reduzirMovimento) return; // movimento reduzido: sai o scale, fica a cor
    escala.set(withTiming(valor, { duration: duracao('duration-fast'), easing: curva('ease-standard') }));
  };

  return {
    focado,
    estiloEscala,
    handlers: {
      onPressIn: () => pressionar(0.97),
      onPressOut: () => pressionar(1),
      onFocus: () => setFocado(true),
      onBlur: () => setFocado(false),
    },
  };
}

// Classes literais: o Tailwind só gera o que aparece escrito por inteiro.
const RAIO = {
  button: { interno: 'absolute rounded-button border-border-focus', externo: 'absolute rounded-button border-border-focus-outline' },
  control: { interno: 'absolute rounded-control border-border-focus', externo: 'absolute rounded-control border-border-focus-outline' },
  card: { interno: 'absolute rounded-card border-border-focus', externo: 'absolute rounded-card border-border-focus-outline' },
};

/** Dois anéis: Sunflare por dentro, contorno escuro por fora. Foco não anima. */
export function AnelDeFoco({ raio = 'button' }: { raio?: keyof typeof RAIO }) {
  return (
    <>
      <View
        pointerEvents="none"
        className={RAIO[raio].interno}
        style={{ top: -ANEL_FOCO, bottom: -ANEL_FOCO, left: -ANEL_FOCO, right: -ANEL_FOCO, borderWidth: ANEL_FOCO }}
      />
      <View
        pointerEvents="none"
        className={RAIO[raio].externo}
        style={{
          top: -2 * ANEL_FOCO,
          bottom: -2 * ANEL_FOCO,
          left: -2 * ANEL_FOCO,
          right: -2 * ANEL_FOCO,
          borderWidth: ANEL_FOCO,
        }}
      />
    </>
  );
}
