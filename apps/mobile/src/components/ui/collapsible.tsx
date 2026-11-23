import { SymbolView } from 'expo-symbols';
import { PropsWithChildren, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { px } from '@/shared/theme/layout';
import { cor, escalas } from '@/shared/theme/tokens';

export function Collapsible({ children, titulo }: PropsWithChildren & { titulo: string }) {
  const [aberto, setAberto] = useState(false);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: aberto }}
        className="min-h-touch flex-row items-center gap-2"
        style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}
        onPress={() => setAberto((valor) => !valor)}>
        <View className="size-icon-lg items-center justify-center rounded-control bg-surface-raised">
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={px(escalas.size['size-icon-sm'])}
            weight="bold"
            tintColor={cor['content-secondary']}
            style={{ transform: [{ rotate: aberto ? '90deg' : '0deg' }] }}
          />
        </View>
        <Text className="text-body-strong text-content-primary">{titulo}</Text>
      </Pressable>

      {aberto && (
        <Animated.View entering={FadeIn.duration(px(escalas.duration['duration-base']))}>
          <View className="mt-2 gap-2 rounded-card border border-border-default bg-surface-raised p-4">
            {children}
          </View>
        </Animated.View>
      )}
    </View>
  );
}
