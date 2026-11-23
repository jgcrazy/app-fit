import * as Device from 'expo-device';
import { Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HintRow } from '@/components/hint-row';
import { paddingInferiorTela, px } from '@/shared/theme/layout';
import { escalas } from '@/shared/theme/tokens';

function atalhoDoMenuDev() {
  if (Platform.OS === 'web') return 'devtools do navegador';
  if (Device.isDevice) return 'sacuda o aparelho ou tecle m';
  return Platform.OS === 'android' ? 'cmd+m (ou ctrl+m)' : 'cmd+d';
}

export default function InicioScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface-canvas">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 gap-6"
        contentContainerStyle={{
          paddingTop: insets.top + px(escalas.spacing['space-8']),
          paddingBottom: paddingInferiorTela(insets.bottom),
        }}>
        <View className="gap-2">
          <Text className="text-overline text-content-secondary">app-fit</Text>
          <Text className="text-display-lg text-content-primary">Seu treino, seus registros</Text>
          <Text className="text-body-lg text-content-secondary">
            Acompanhe treinos, hábitos e evolução no seu ritmo. As estimativas mostram de onde
            vêm, e a decisão é sempre sua.
          </Text>
        </View>

        <View className="gap-3 rounded-card border border-border-default bg-surface-raised p-4">
          <Text className="text-h3 text-content-primary">Para desenvolver</Text>
          <HintRow titulo="Editar esta tela" dica="src/app/index.tsx" />
          <HintRow titulo="Menu de desenvolvimento" dica={atalhoDoMenuDev()} />
          <HintRow titulo="Gerar o tema" dica="npm run ds:build" />
        </View>
      </ScrollView>
    </View>
  );
}
