import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { Collapsible } from '@/components/ui/collapsible';
import { paddingInferiorTela, px } from '@/shared/theme/layout';
import { escalas } from '@/shared/theme/tokens';
import { AppHeader } from '@/shared/ui/AppHeader';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { FeatureCard } from '@/shared/ui/FeatureCard';
import { Field } from '@/shared/ui/Field';
import { IconButton } from '@/shared/ui/IconButton';
import { ListCard } from '@/shared/ui/ListCard';

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
      <View className="flex-row flex-wrap items-center gap-2">
        <IconButton name="chevron-left" label="Voltar" />
        <IconButton name="bell" label="Notificações" />
        <IconButton name="plus" label="Adicionar" size={16} />
        <IconButton name="dots" label="Mais opções" disabled />
      </View>
    </View>
  );
}

function CatalogoField() {
  const [nivel, setNivel] = useState<string>();
  return (
    <View className="gap-4">
      <Field label="Peso (kg)" placeholder="Ex.: 72,5" keyboardType="decimal-pad" help="Use a mesma balança de sempre." />
      <Field label="Altura (cm)" keyboardType="number-pad" value="1,72" error="Use só números, em centímetros. Ex.: 172" required />
      <Field
        as="select"
        label="Experiência com treino"
        placeholder="Escolha uma opção"
        value={nivel}
        onValueChange={setNivel}
        options={[
          { value: 'iniciante', label: 'Começando agora' },
          { value: 'intermediario', label: 'Treino há alguns meses' },
          { value: 'avancado', label: 'Treino há anos' },
        ]}
      />
      <Field as="textarea" label="Observações" placeholder="Algo que você queira registrar sobre o treino" rows={3} />
      <Field label="E-mail" value="ana@exemplo.com" disabled />
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

          <Collapsible titulo="Componentes: Button e IconButton">
            <CatalogoButton />
          </Collapsible>

          <Collapsible titulo="Componentes: Badge">
            <View className="flex-row flex-wrap gap-2">
              <Badge tone="active">Concluído</Badge>
              <Badge tone="pending">Em andamento</Badge>
              <Badge tone="canceled">Pulado</Badge>
              <Badge tone="neutral" />
              <Badge tone="active" dot={false} />
            </View>
          </Collapsible>

          <Collapsible titulo="Componentes: Field">
            <CatalogoField />
          </Collapsible>

          <Collapsible titulo="Componentes: Card e ListCard">
            <View className="gap-3">
              <ListCard title="Treino A — Peito e tríceps" meta="Hoje, 07:30 · 6 exercícios" value="45 min" status="active" statusLabel="Concluído" onPress={() => {}} />
              <ListCard title="Treino B — Costas e bíceps" meta="Amanhã · 5 exercícios" status="pending" statusLabel="Agendado" onPress={() => {}} />
              <ListCard title="Caminhada" meta="Ontem" value="32 min" status="canceled" statusLabel="Pulado" />
              <Card>
                <Text className="text-h3 text-content-primary">Esta semana</Text>
                <Text className="text-body text-content-secondary">3 treinos registrados. Dia perdido não apaga o que você já fez.</Text>
              </Card>
            </View>
          </Collapsible>

          <Collapsible titulo="Componentes: FeatureCard">
            <FeatureCard
              title="Registre seu primeiro treino"
              body="Anote o que você fez hoje, do jeito que foi. Dá para ajustar depois."
              cta="Registrar treino"
              onCta={() => {}}
            />
          </Collapsible>

          <Collapsible titulo="Componentes: AppHeader">
            {/* No catálogo o header aparece dentro do card; numa tela real ele fica no topo e cobre a barra de status. */}
            <View className="gap-3 overflow-hidden rounded-card">
              <AppHeader title="Início" greeting="Boa noite, Ana" actions={[{ icon: 'bell', label: 'Notificações', onPress: () => {} }]} />
              <AppHeader title="Treino A — Peito e tríceps" onBack={() => {}} />
            </View>
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
