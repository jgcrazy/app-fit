import {
  ArrowDown,
  ArrowUp,
  Bell,
  ChartColumn,
  Check,
  ChevronDown,
  ChevronLeft,
  Ellipsis,
  House,
  Info,
  List,
  type LucideIcon,
  Minus,
  Package,
  Plus,
  Search,
  TriangleAlert,
  User,
  X,
} from 'lucide-react-native';

import { View } from 'react-native';

import { px } from '@/shared/theme/layout';
import { cor as cores, escalas, type TokenCor } from '@/shared/theme/tokens';

/** Os nomes do Ensign (components/index.d.ts), mapeados para o Lucide. */
const ICONES = {
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  minus: Minus,
  plus: Plus,
  check: Check,
  x: X,
  alert: TriangleAlert,
  info: Info,
  search: Search,
  bell: Bell,
  'chevron-left': ChevronLeft,
  'chevron-down': ChevronDown,
  package: Package,
  home: House,
  user: User,
  chart: ChartColumn,
  list: List,
  dots: Ellipsis,
} satisfies Record<string, LucideIcon>;

export type NomeIcone = keyof typeof ICONES;

export type IconProps = {
  name: NomeIcone;
  /** px. Abaixo de 24 o traço é size-stroke-icon (1,75px); de 24 para cima, 2px. */
  size?: number;
  /**
   * No RN não há currentColor: quem usa passa o token de cor do contexto
   * (o mesmo do texto ao lado). Padrão: content-primary.
   */
  cor?: TokenCor;
  /** Sem label o ícone é decorativo e some para o leitor de tela. Com label, é uma imagem com nome. */
  label?: string;
};

const TRACO_FINO = px(escalas.size['size-stroke-icon']);
const LIMITE_TRACO_GROSSO = px(escalas.size['size-icon-lg']);

export function Icon({ name, size = px(escalas.size['size-icon-md']), cor = 'content-primary', label }: IconProps) {
  const Desenho = ICONES[name];
  // O Lucide marca todo SVG com aria-hidden, o que apagaria um label posto nele.
  // Por isso o desenho é sempre escondido, e o nome acessível fica num View em volta.
  const desenho = (
    <Desenho
      size={size}
      color={cores[cor]}
      strokeWidth={size >= LIMITE_TRACO_GROSSO ? 2 : TRACO_FINO}
      aria-hidden
      importantForAccessibility="no-hide-descendants"
    />
  );

  if (!label) return desenho;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label}>
      {desenho}
    </View>
  );
}
