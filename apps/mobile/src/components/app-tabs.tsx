import { NativeTabs } from 'expo-router/native-tabs';

import { cor } from '@/shared/theme/tokens';

/**
 * Tab bar nativa no Ensign: surface-deep, ativo em content-accent, inativo em
 * content-secondary. O rótulo nunca some.
 */
export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={cor['surface-deep']}
      indicatorColor={cor['surface-raised']}
      iconColor={{ default: cor['content-secondary'], selected: cor['content-accent'] }}
      labelStyle={{
        default: { color: cor['content-secondary'] },
        selected: { color: cor['content-accent'] },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Início</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explorar</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
