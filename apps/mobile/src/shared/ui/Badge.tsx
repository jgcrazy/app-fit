import { Text, View } from 'react-native';

/**
 * Badge do Ensign, em React Native: pílula de status.
 * Especificação: artifact Ensign, project/components/Badge/README.md.
 *
 * Quatro tons, não um por estado do domínio: mapeie seu enum para um deles num
 * lugar só. A cor nunca carrega o estado sozinha — sempre há rótulo em texto.
 */
export type TomStatus = 'active' | 'pending' | 'canceled' | 'neutral';

export type BadgeProps = {
  tone?: TomStatus;
  /** false remove o ponto. Em lista densa, use false: a coluna já diz que é status. */
  dot?: boolean;
  /** Sem rótulo usa o padrão do tom. Em pt-BR, sem caixa alta digitada. */
  children?: string;
};

export const ROTULO_STATUS: Record<TomStatus, string> = {
  active: 'Ativo',
  pending: 'Pendente',
  canceled: 'Cancelado',
  neutral: 'Rascunho',
};

// Classes literais por tom (o Tailwind só gera o que aparece escrito por inteiro).
const TOM: Record<TomStatus, { fundo: string; texto: string; ponto: string }> = {
  active: { fundo: 'bg-status-active-bg', texto: 'text-status-active-fg', ponto: 'bg-status-active-fg' },
  pending: { fundo: 'bg-status-pending-bg', texto: 'text-status-pending-fg', ponto: 'bg-status-pending-fg' },
  canceled: { fundo: 'bg-status-canceled-bg', texto: 'text-status-canceled-fg', ponto: 'bg-status-canceled-fg' },
  neutral: { fundo: 'bg-status-neutral-bg', texto: 'text-status-neutral-fg', ponto: 'bg-status-neutral-fg' },
};

// Ponto de 6px e padding vertical de 2px: valores do bundle.css do Ensign
// (.ens-badge), que não são token. Em px de propósito: as classes padrão do
// Tailwind (size-1.5, py-0.5) são em rem, e o NativeWind usa rem = 14px no
// celular — o ponto sairia com 5,25px.
const PONTO = 6;
const PADDING_VERTICAL = 2;

export function Badge({ tone = 'neutral', dot = true, children }: BadgeProps) {
  const { fundo, texto, ponto } = TOM[tone];
  const rotulo = children ?? ROTULO_STATUS[tone];

  return (
    // Um elemento de texto só para o leitor de tela: "Pendente", não "ponto, Pendente".
    <View
      accessible
      accessibilityLabel={rotulo}
      className={`flex-row items-center gap-1 self-start rounded-pill px-2 ${fundo}`}
      style={{ paddingVertical: PADDING_VERTICAL }}>
      {dot ? <View className={`rounded-pill ${ponto}`} style={{ width: PONTO, height: PONTO }} /> : null}
      <Text className={`text-label-sm ${texto}`}>{rotulo}</Text>
    </View>
  );
}
