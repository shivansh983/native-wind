import { Text, View } from 'react-native';
import CustomScreen from '../../component/screen';

const Settings = () => {
  return (
    <CustomScreen title="Settings">
      <View className="rounded-2xl border border-border bg-surface p-4">
        <Text className="font-semibold text-main">Preferences</Text>
      </View>
    </CustomScreen>
  );
};

export default Settings;
