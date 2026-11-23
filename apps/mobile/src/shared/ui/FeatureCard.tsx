import { Text, View } from 'react-native';

import { Button } from './Button';

/**
 * FeatureCard do Ensign, em React Native: o card invertido, Champagne em força
 * máxima. Especificação: artifact Ensign, project/components/FeatureCard/README.md.
 *
 * Um ou dois por tela, no máximo: três seguidos e os 30% viram os 60%.
 * Use para convite, onboarding, recurso novo ou estado vazio que chama para a
 * ação; nunca como contêiner genérico ou linha de lista.
 *
 * O CTA é sempre o primário (amarelo, texto navy). Ele conta no orçamento dos
 * 10%: se a tela já tem um primário, não passe `cta` aqui. A variante
 * secundária não existe porque o botão secondary do tema app some no bege
 * (1,00:1) — aguardando token no Ensign, ver #26.
 */
export type FeatureCardProps = {
  title: string;
  body?: string;
  /** Rótulo do botão (verbo). Só com onCta. */
  cta?: string;
  onCta?: () => void;
};

export function FeatureCard({ title, body, cta, onCta }: FeatureCardProps) {
  return (
    <View className="gap-3 rounded-card bg-surface-secondary p-5">
      {/* Texto sobre o bege é sempre content-on-secondary (navy, 9,62:1): o fundo não inverte. */}
      <Text accessibilityRole="header" className="text-h3 text-content-on-secondary">
        {title}
      </Text>
      {body ? <Text className="text-body text-content-on-secondary">{body}</Text> : null}
      {cta && onCta ? (
        <View className="pt-1">
          <Button size="md" onPress={onCta}>
            {cta}
          </Button>
        </View>
      ) : null}
    </View>
  );
}
