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

// @expo/ui carrega SwiftUI/Compose no import. No teste, o menu mostra o
// gatilho e uma opção pressionável por ação (testID "menu-opcao-<id>"), e o
// picker da web vira uma lista de opções pressionáveis.
jest.mock('@expo/ui/community/menu', () => {
  const { Pressable, Text, View } = require('react-native');
  return {
    MenuView: ({ children, actions = [], onPressAction }) => (
      <View>
        {children}
        {actions.map((acao) => (
          <Pressable
            key={acao.id ?? acao.title}
            testID={`menu-opcao-${acao.id ?? acao.title}`}
            accessibilityState={{ checked: acao.state === 'on' }}
            onPress={() => onPressAction?.({ nativeEvent: { event: acao.id ?? acao.title } })}>
            <Text>{acao.title}</Text>
          </Pressable>
        ))}
      </View>
    ),
  };
});

// Safe area: o mock oficial devolve insets zerados (sem provider na árvore).
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
