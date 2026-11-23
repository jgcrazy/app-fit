/* Ambiente de teste do app. */

// Reanimated 4.7 no Jest: o mock oficial (react-native-reanimated/mock) importa
// o módulo de verdade, que na plataforma nativa chama setCSSEventHandler e
// quebra no JSReanimated. Este mock mínimo cobre só o que os componentes usam;
// animação não é o que os testes verificam (estado, acessibilidade, eventos).
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  const Animated = { View, Text, createAnimatedComponent: (c) => c };
  const identidade = (t) => t;
  const entrada = { duration: () => entrada, delay: () => entrada };
  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    Easing: { bezier: () => identidade, linear: identidade },
    FadeIn: entrada,
    useSharedValue: (inicial) => {
      let valor = inicial;
      return { get: () => valor, set: (novo) => (valor = novo), value: inicial };
    },
    useAnimatedStyle: (fabrica) => fabrica(),
    useReducedMotion: () => false,
    withTiming: (destino) => destino,
  };
});
