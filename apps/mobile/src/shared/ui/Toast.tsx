import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { px } from '@/shared/theme/layout';
import { curva, duracao } from '@/shared/theme/movimento';
import { escalas, type TokenCor } from '@/shared/theme/tokens';

import { Button } from './Button';
import { Icon, type NomeIcone } from './Icon';
import { IconButton } from './IconButton';

/**
 * Toast do Ensign, em React Native: feedback flutuante.
 * Especificação: artifact Ensign, project/components/Toast/README.md.
 *
 * Renderiza UM toast. A fila, a posição, o limite (três) e o cronômetro são do
 * host: 4s, ou 6s quando há ação, pausando enquanto o usuário interage.
 * A cor vive na barra de 4px e no ícone, nunca no fundo inteiro.
 */
export type TomFeedback = 'success' | 'error' | 'warning' | 'info';

export type ToastProps = {
  tone?: TomFeedback;
  title: string;
  /** Uma frase. Erro diz o próximo passo. */
  description?: string;
  /** Ação opcional ("Desfazer"). Com ação o host deve dar 6s. */
  action?: { label: string; onPress: () => void };
  onClose?: () => void;
};

const TOM: Record<TomFeedback, { icone: NomeIcone; cor: TokenCor; barra: string }> = {
  success: { icone: 'check', cor: 'feedback-success-fg', barra: 'border-l-feedback-success-border' },
  error: { icone: 'x', cor: 'feedback-error-fg', barra: 'border-l-feedback-error-border' },
  warning: { icone: 'alert', cor: 'feedback-warning-fg', barra: 'border-l-feedback-warning-border' },
  info: { icone: 'info', cor: 'feedback-info-fg', barra: 'border-l-feedback-info-border' },
};

// Entra descendo (slide-down) e sai subindo, com as curvas do Ensign. O
// Reanimated já respeita o "reduzir movimento" do sistema nas layout animations.
const ENTRADA = FadeInDown.duration(duracao('duration-base')).easing(curva('ease-decelerate'));
const SAIDA = FadeOutUp.duration(duracao('duration-fast')).easing(curva('ease-accelerate'));

export function Toast({ tone = 'info', title, description, action, onClose }: ToastProps) {
  const { icone, cor, barra } = TOM[tone];
  const erro = tone === 'error';

  return (
    <Animated.View entering={ENTRADA} exiting={SAIDA}>
      <View
        className={`flex-row items-start gap-3 rounded-card border border-l-4 border-border-default bg-surface-overlay p-4 ${barra}`}>
        <View className="pt-px">
          <Icon name={icone} size={px(escalas.size['size-icon-md'])} cor={cor} />
        </View>

        <View className="min-w-0 flex-1 gap-1">
          {/* O anúncio fica no bloco de texto, não no contêiner: assim Fechar e a ação
              continuam focáveis. Erro interrompe o leitor de tela; os outros não. */}
          <View
            accessible
            accessibilityRole={erro ? 'alert' : undefined}
            accessibilityLabel={description ? `${title}. ${description}` : title}
            accessibilityLiveRegion={erro ? 'assertive' : 'polite'}
            className="gap-1">
            <Text className="text-body-strong text-content-primary">{title}</Text>
            {description ? <Text className="text-body-sm text-content-secondary">{description}</Text> : null}
          </View>
          {action ? (
            <View className="pt-1">
              <Button variant="ghost" size="sm" onPress={action.onPress}>
                {action.label}
              </Button>
            </View>
          ) : null}
        </View>

        {onClose ? <IconButton name="x" label="Fechar" size={px(escalas.size['size-icon-sm'])} onPress={onClose} /> : null}
      </View>
    </Animated.View>
  );
}
