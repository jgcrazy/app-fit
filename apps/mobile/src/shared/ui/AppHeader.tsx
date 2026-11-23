import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ALTURA_APP_HEADER } from '@/shared/theme/layout';

import type { NomeIcone } from './Icon';
import { IconButton } from './IconButton';

/**
 * AppHeader do Ensign, em React Native: o cabeçalho fixo das telas.
 * Especificação: artifact Ensign, project/components/AppHeader/README.md.
 *
 * 56px em surface-brand (navy nos dois temas), título em content-on-brand.
 * O próprio header aplica o inset superior: o navy desce por trás da barra
 * de status e nenhuma tela esquece o safe area.
 */
export type AcaoHeader = { icon: NomeIcone; label: string; onPress: () => void };

export type AppHeaderProps = {
  title: string;
  /** Só em telas de nível superior (início): "Boa noite, Ana". */
  greeting?: string;
  /** Mostra o botão Voltar. */
  onBack?: () => void;
  /** No máximo duas: a terceira vai para um menu. */
  actions?: [AcaoHeader] | [AcaoHeader, AcaoHeader];
};

export function AppHeader({ title, greeting, onBack, actions }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-surface-brand" style={{ paddingTop: insets.top }}>
      <View
        className={`flex-row items-center gap-1 pr-2 ${onBack ? 'pl-1' : 'pl-4'}`}
        style={{ minHeight: ALTURA_APP_HEADER }}>
        {onBack ? <IconButton name="chevron-left" label="Voltar" onPress={onBack} /> : null}

        <View className="min-w-0 flex-1">
          {greeting ? (
            <Text numberOfLines={1} className="text-body-sm text-content-secondary">
              {greeting}
            </Text>
          ) : null}
          <Text accessibilityRole="header" numberOfLines={1} className="text-h2 text-content-on-brand">
            {title}
          </Text>
        </View>

        {(actions ?? []).map((acao) => (
          <IconButton key={acao.label} name={acao.icon} label={acao.label} onPress={acao.onPress} />
        ))}
      </View>
    </View>
  );
}
