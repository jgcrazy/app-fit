import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { Collapsible } from '@/components/ui/collapsible';
import { paddingInferiorTela, px } from '@/shared/theme/layout';
import { escalas } from '@/shared/theme/tokens';
import { Button } from '@/shared/ui/Button';

/**
 * Catálogo de desenvolvimento: mostra variantes lado a lado, então é a única
 * tela onde mais de um primary aparece junto. Nas telas do produto, um por região.
 */
function CatalogoButton() {
  return (
    <View className="gap-4">
      <View className="flex-row flex-wrap gap-3">
        <Button>Registrar treino</Button>
        <Button variant="secondary">Ver histórico</Button>
        <Button variant="ghost">Agora não</Button>
        <Button variant="danger">Excluir registro</Button>
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button size="sm">sm</Button>
        <Button size="md" icon="plus">
          md com ícone
        </Button>
        <Button size="lg">lg</Button>
      </View>
      <View className="flex-row flex-wrap gap-3">
        <Button loading>Salvando</Button>
        <Button disabled>Desabilitado</Button>
      </View>
    </View>
  );
}

function Codigo({ children }: { children: string }) {
  return <Text className="text-code-sm text-content-secondary">{children}</Text>;
}

export default function ExplorarScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface-canvas">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 gap-6"
        contentContainerStyle={{
          paddingTop: insets.top + px(escalas.spacing['space-8']),
          paddingBottom: paddingInferiorTela(insets.bottom),
        }}>
        <View className="gap-2">
          <Text className="text-display-md text-content-primary">Explorar</Text>
          <Text className="text-body-lg text-content-secondary">
            Como este app está organizado, enquanto as telas de verdade não chegam.
          </Text>
        </View>

        <View className="gap-2">
          <Collapsible titulo="Rotas por arquivo">
            <Text className="text-body text-content-secondary">
              Cada arquivo em <Codigo>src/app/</Codigo> é uma tela. O <Codigo>_layout.tsx</Codigo>{' '}
              monta a navegação por abas.
            </Text>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <Text className="text-label text-content-link underline">Ler a documentação</Text>
            </ExternalLink>
          </Collapsible>

          <Collapsible titulo="Design system Ensign">
            <Text className="text-body text-content-secondary">
              Cores, tipos e espaços vêm de <Codigo>design-system/tokens.json</Codigo>, na raiz do
              repositório. Rode <Codigo>npm run ds:build</Codigo> para gerar o tema do app e{' '}
              <Codigo>npm run ds:lint</Codigo> para checar as telas.
            </Text>
          </Collapsible>

          <Collapsible titulo="Componentes: Button">
            <CatalogoButton />
          </Collapsible>

          <Collapsible titulo="Movimento">
            <Text className="text-body text-content-secondary">
              Animações usam <Codigo>react-native-reanimated</Codigo> com as durações do design
              system. Este bloco abre em <Codigo>duration-base</Codigo> (200ms).
            </Text>
          </Collapsible>
        </View>
      </ScrollView>
    </View>
  );
}
