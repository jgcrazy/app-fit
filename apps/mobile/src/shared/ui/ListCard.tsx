import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Badge, ROTULO_STATUS, type TomStatus } from './Badge';
import { AnelDeFoco, useInteracao } from './interacao';

/**
 * ListCard do Ensign, em React Native: a linha padrão de listagem.
 * Especificação: artifact Ensign, project/components/ListCard/README.md.
 *
 * Deliberadamente sem graça: título, metadado, status e valor. Os dados chegam
 * já formatados ("45 min", "12/03, 07:30") — o componente não formata nada.
 * Com onPress a linha inteira vira um botão (nunca onClick num contêiner).
 */
export type ListCardProps = {
  /** Uma linha, truncada. Se precisa de duas, não é ListCard. */
  title: string;
  meta?: string;
  /** Valor já formatado. Sai em tabular-nums para não dançar na lista. */
  value?: string;
  status?: TomStatus;
  statusLabel?: string;
  onPress?: () => void;
};

export function ListCard({ title, meta, value, status, statusLabel, onPress }: ListCardProps) {
  const { focado, estiloEscala, handlers } = useInteracao();

  // Um nome só para o leitor de tela, na ordem em que se lê a linha.
  const rotuloStatus = status ? (statusLabel ?? ROTULO_STATUS[status]) : undefined;
  const nomeAcessivel = [title, meta, rotuloStatus, value].filter(Boolean).join(', ');

  const conteudo = (fundo: string) => (
    <View className={`flex-row items-center gap-4 rounded-card border border-border-default p-4 ${fundo}`}>
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-body-strong text-content-primary">
          {title}
        </Text>
        {meta ? <Text className="text-body-sm text-content-muted">{meta}</Text> : null}
      </View>
      {status ? <Badge tone={status}>{statusLabel}</Badge> : null}
      {value ? <Text className="text-numeric text-content-primary">{value}</Text> : null}
    </View>
  );

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={nomeAcessivel}>
        {conteudo('bg-surface-raised')}
      </View>
    );
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={nomeAcessivel} onPress={onPress} {...handlers}>
      {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => (
        <Animated.View style={estiloEscala}>
          {conteudo(pressed || hovered ? 'bg-surface-raised-hover' : 'bg-surface-raised')}
          {focado ? <AnelDeFoco raio="card" /> : null}
        </Animated.View>
      )}
    </Pressable>
  );
}
