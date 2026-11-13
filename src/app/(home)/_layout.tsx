import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { COLORS } from '../../theme/colors';

const HomeTabsLayout = () => {
  return (
    <NativeTabs
      backgroundColor={COLORS.navy}
      tintColor={COLORS.white}
      iconColor={{ default: COLORS.textMutedLight, selected: COLORS.white }}
      labelStyle={{
        default: { color: COLORS.textMutedLight, fontSize: 11 },
        selected: { color: COLORS.white, fontSize: 11, fontWeight: '600' },
      }}
      indicatorColor={COLORS.primary}
      rippleColor="rgba(255,255,255,0.12)"
      badgeBackgroundColor={COLORS.primary}
      badgeTextColor={COLORS.white}
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="square.grid.2x2.fill" md="dashboard" />
        <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="files">
        <NativeTabs.Trigger.Icon sf="doc.text.fill" md="description" />
        <NativeTabs.Trigger.Label>Files</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="contact">
        <NativeTabs.Trigger.Icon sf="envelope.fill" md="mail" />
        <NativeTabs.Trigger.Label>Contact</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="setting">
        <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default HomeTabsLayout;
