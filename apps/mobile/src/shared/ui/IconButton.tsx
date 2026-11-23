import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { px } from '@/shared/theme/layout';
import { escalas } from '@/shared/theme/tokens';

import { Icon, type NomeIcone } from './Icon';
import { AnelDeFoco, useInteracao } from './interacao';

/**
 * IconButton do Ensign, em React Native: botão só de ícone.
 * Especificação: artifact Ensign, project/components/Button/README.md (seção IconButton).
 *
 * O alvo é sempre size-touch (44×44), mesmo com ícone de 16px: o visual é o
 * ícone, a área de toque não encolhe.
 */
export type IconButtonProps = {
  name: NomeIcone;
  /** Obrigatório: é o nome acessível ("Voltar", "Notificações"). */
  label: string;
  /** Tamanho do ícone em px. Padrão size-icon-md (20). */
  size?: number;
  disabled?: boolean;
  onPress?: () => void;
};

export function IconButton({
  name,
  label,
  size = px(escalas.size['size-icon-md']),
  disabled = false,
  onPress,
}: IconButtonProps) {
  const { focado, estiloEscala, handlers } = useInteracao();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      {...handlers}
      className={disabled ? 'self-start opacity-disabled' : 'self-start'}>
      {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => (
        <Animated.View style={estiloEscala}>
          <View
            className={`size-touch items-center justify-center rounded-button ${
              pressed || hovered ? 'bg-action-ghost-bg-hover' : 'bg-transparent'
            }`}>
            {/* Decorativo: o nome acessível é o label do botão. */}
            <Icon name={name} size={size} cor="action-ghost-fg" />
          </View>
          {focado ? <AnelDeFoco /> : null}
        </Animated.View>
      )}
    </Pressable>
  );
}
