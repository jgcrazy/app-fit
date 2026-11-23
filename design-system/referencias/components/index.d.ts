// Ensign — tipos dos componentes. Documentação, não checagem.
// Global: window.Ensign

export type Tema = 'app' | 'admin';
export type TomStatus = 'active' | 'pending' | 'canceled' | 'neutral';
export type TomFeedback = 'success' | 'error' | 'warning' | 'info';

export type NomeIcone =
  | 'arrow-up' | 'arrow-down' | 'minus' | 'plus' | 'check' | 'x'
  | 'alert' | 'info' | 'search' | 'bell' | 'chevron-left' | 'chevron-down'
  | 'package' | 'home' | 'user' | 'chart' | 'list' | 'dots';

export interface IconProps {
  name: NomeIcone;
  /** px. Abaixo de 24 o traço é 1.75px; de 24 para cima, 2px. */
  size?: number;
  /** Sem label o ícone é decorativo (aria-hidden). Com label, vira role="img". */
  label?: string;
  className?: string;
}

export interface ButtonProps {
  /** primary é o CTA: um por região de tela. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Trava a largura e troca o rótulo pelo spinner. Também desabilita. */
  loading?: boolean;
  disabled?: boolean;
  icon?: NomeIcone;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: unknown) => void;
  className?: string;
  children?: unknown;
}

export interface IconButtonProps {
  name: NomeIcone;
  /** Obrigatório: é o nome acessível do botão. */
  label: string;
  size?: number;
  onClick?: (e: unknown) => void;
  className?: string;
}

export interface FieldProps {
  as?: 'input' | 'select' | 'textarea';
  label?: string;
  /** Mensagem de erro. Define aria-invalid e aria-describedby. */
  error?: string;
  /** Texto de ajuda. Suprimido quando há erro. */
  help?: string;
  placeholder?: string;
  type?: string;
  inputMode?: string;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  id?: string;
  className?: string;
}

export interface BadgeProps {
  tone?: TomStatus;
  /** false remove o ponto. Em tabela densa, use false. */
  dot?: boolean;
  /** Sem children usa o rótulo padrão do tom. */
  children?: unknown;
  className?: string;
}

export interface CardProps {
  flat?: boolean;
  className?: string;
  children?: unknown;
}

export interface KPICardProps {
  /** Vai para overline + content-secondary. */
  label: string;
  value: string | number;
  /** Variação percentual. Decide cor, seta e sinal. null/omitido esconde a linha. */
  delta?: number | null;
  deltaLabel?: string;
  icon?: NomeIcone;
  className?: string;
}

export interface ListCardProps {
  title: string;
  meta?: string;
  value?: string;
  status?: TomStatus;
  statusLabel?: string;
  className?: string;
}

export interface FeatureCardProps {
  title: string;
  body?: string;
  cta?: string;
  className?: string;
}

export interface ColunaTabela {
  key: string;
  label: string;
  /** Alinha à direita e aplica tabular-nums. */
  numeric?: boolean;
  sortable?: boolean;
  sort?: 'asc' | 'desc';
}

export interface DataTableProps {
  columns: ColunaTabela[];
  /** A coluna 'status' renderiza um Badge; a coluna 'acoes', um IconButton. */
  rows: Array<Record<string, unknown>>;
  /** Ex.: "41–60 de 338". */
  range?: string;
  footer?: boolean;
  className?: string;
}

export interface ToastProps {
  tone?: TomFeedback;
  title: string;
  /** error vira role="alert"; os outros, role="status". */
  children?: unknown;
  className?: string;
}

export interface ItemNav {
  key: string;
  label: string;
  icon: NomeIcone;
  href?: string;
}

export interface BottomTabBarProps {
  /** No máximo 4. O rótulo nunca é omitido. */
  items: ItemNav[];
  active?: string;
  className?: string;
}

export interface AppHeaderProps {
  title: string;
  greeting?: string;
  back?: boolean;
  action?: boolean;
  className?: string;
}

export interface SidebarProps {
  items: ItemNav[];
  active?: string;
  className?: string;
}

export declare const Icon: (p: IconProps) => unknown;
export declare const Button: (p: ButtonProps) => unknown;
export declare const IconButton: (p: IconButtonProps) => unknown;
export declare const Field: (p: FieldProps) => unknown;
export declare const Badge: (p: BadgeProps) => unknown;
export declare const Card: (p: CardProps) => unknown;
export declare const KPICard: (p: KPICardProps) => unknown;
export declare const ListCard: (p: ListCardProps) => unknown;
export declare const FeatureCard: (p: FeatureCardProps) => unknown;
export declare const DataTable: (p: DataTableProps) => unknown;
export declare const Toast: (p: ToastProps) => unknown;
export declare const BottomTabBar: (p: BottomTabBarProps) => unknown;
export declare const AppHeader: (p: AppHeaderProps) => unknown;
export declare const Sidebar: (p: SidebarProps) => unknown;
