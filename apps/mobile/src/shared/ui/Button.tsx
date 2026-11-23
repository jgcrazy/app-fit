import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { px } from '@/shared/theme/layout';
import { cor, escalas, type TokenCor } from '@/shared/theme/tokens';

import { Icon, type NomeIcone } from './Icon';
import { AnelDeFoco, useInteracao } from './interacao';

/**
 * Button do Ensign, em React Native.
 * Especificação: artifact Ensign, project/components/Button/README.md.
 *
 * Um `primary` por região de tela: ele é os 10% de Sunflare.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  /** O rótulo. É verbo ("Salvar", "Registrar treino") e é o nome acessível. */
  children: string;
  variant?: ButtonVariant;
  /** No app o padrão é lg (48px). */
  size?: ButtonSize;
  /** Trava a largura, troca o rótulo pelo spinner e desabilita. */
  loading?: boolean;
  disabled?: boolean;
  icon?: NomeIcone;
  onPress?: () => void;
  /** Só quando o rótulo sozinho não basta para quem usa leitor de tela. */
  accessibilityHint?: string;
};

// Fundos por estado. No celular não há hover, então "pressionado" usa o
// -bg-active quando o token existe (primary) e o -bg-hover nos demais.
const FUNDO: Record<ButtonVariant, { repouso: string; hover: string; pressionado: string }> = {
  primary: {
    repouso: 'bg-action-primary-bg',
    hover: 'bg-action-primary-bg-hover',
    pressionado: 'bg-action-primary-bg-active',
  },
  secondary: {
    repouso: 'bg-action-secondary-bg border border-action-secondary-border',
    hover: 'bg-action-secondary-bg-hover border border-action-secondary-border',
    pressionado: 'bg-action-secondary-bg-hover border border-action-secondary-border',
  },
  ghost: {
    repouso: 'bg-transparent',
    hover: 'bg-action-ghost-bg-hover',
    pressionado: 'bg-action-ghost-bg-hover',
  },
  danger: {
    repouso: 'bg-action-danger-bg',
    hover: 'bg-action-danger-bg-hover',
    pressionado: 'bg-action-danger-bg-hover',
  },
};

// Texto, ícone e spinner da variante. O primary é NAVY: branco sobre Sunflare é 1,48:1.
const TINTA: Record<ButtonVariant, TokenCor> = {
  primary: 'action-primary-fg',
  secondary: 'action-secondary-fg',
  ghost: 'action-ghost-fg',
  danger: 'action-danger-fg',
};
const CLASSE_TEXTO: Record<ButtonVariant, string> = {
  primary: 'text-action-primary-fg',
  secondary: 'text-action-secondary-fg',
  ghost: 'text-action-ghost-fg',
  danger: 'text-action-danger-fg',
};

const TAMANHO: Record<ButtonSize, { classe: string; altura: number; icone: number }> = {
  sm: { classe: 'h-control-sm px-4', altura: px(escalas.size['size-control-sm']), icone: px(escalas.size['size-icon-sm']) },
  md: { classe: 'h-control-md px-4', altura: px(escalas.size['size-control-md']), icone: px(escalas.size['size-icon-md']) },
  lg: { classe: 'h-control-lg px-6', altura: px(escalas.size['size-control-lg']), icone: px(escalas.size['size-icon-md']) },
};

const ALVO_MINIMO = px(escalas.size['size-touch']);

export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  icon,
  onPress,
  accessibilityHint,
}: ButtonProps) {
  const { focado, estiloEscala, handlers } = useInteracao();

  const inativo = disabled || loading;
  const { classe, altura, icone } = TAMANHO[size];
  // sm e md ficam abaixo de 44px: o alvo cresce, o visual não.
  const folga = Math.max(0, (ALVO_MINIMO - altura) / 2);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={children}
      accessibilityHint={accessibilityHint}
      // aria-* em vez de accessibilityState: o react-native-web só traduz busy por aqui.
      aria-disabled={inativo}
      aria-busy={loading}
      disabled={inativo}
      hitSlop={{ top: folga, bottom: folga }}
      onPress={onPress}
      {...handlers}
      // Só o desabilitado esmaece. Em loading o botão continua inteiro: o spinner é o estado.
      className={disabled && !loading ? 'self-start opacity-disabled' : 'self-start'}>
      {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => {
        const fundo = pressed ? FUNDO[variant].pressionado : hovered ? FUNDO[variant].hover : FUNDO[variant].repouso;
        return (
          <Animated.View style={estiloEscala}>
            <View className={`flex-row items-center justify-center gap-2 rounded-button ${classe} ${fundo}`}>
              {/* Em loading o conteúdo fica invisível, mas ocupa o espaço: a largura não muda. */}
              <View className={`flex-row items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
                {icon ? <Icon name={icon} size={icone} cor={TINTA[variant]} /> : null}
                <Text className={`text-label ${CLASSE_TEXTO[variant]}`}>{children}</Text>
              </View>
              {loading ? (
                <View className="absolute inset-0 items-center justify-center">
                  <ActivityIndicator testID="button-spinner" size="small" color={cor[TINTA[variant]]} />
                </View>
              ) : null}
            </View>

            {focado ? <AnelDeFoco /> : null}
          </Animated.View>
        );
      }}
    </Pressable>
  );
}
