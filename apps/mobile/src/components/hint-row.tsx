import { Text, View } from 'react-native';

type HintRowProps = {
  titulo: string;
  dica: string;
};

export function HintRow({ titulo, dica }: HintRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text className="shrink text-body-sm text-content-muted">{titulo}</Text>
      <View className="rounded-control bg-surface-raised-hover px-2 py-1">
        <Text className="text-code-sm text-content-secondary">{dica}</Text>
      </View>
    </View>
  );
}
