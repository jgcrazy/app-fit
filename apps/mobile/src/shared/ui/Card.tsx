import { type ReactNode } from 'react';
import { View } from 'react-native';

/**
 * Card do Ensign, em React Native: o contêiner base.
 * Especificação: artifact Ensign, bundle.css (.ens-card) e 03-layout-e-espacamento.md.
 *
 * No tema app (escuro) elevação é passo de superfície + borda de 1px, não
 * sombra: sombra some sobre navy. Por isso não há prop de sombra aqui.
 */
export type CardProps = {
  children?: ReactNode;
};

export function Card({ children }: CardProps) {
  return <View className="gap-3 rounded-card border border-border-default bg-surface-raised p-5">{children}</View>;
}
