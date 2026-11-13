import { Text, View } from 'react-native';
import CustomScreen from '../../component/screen';

const Contact = () => {
  return (
    <CustomScreen title="Contact">
      <View className="rounded-2xl border border-border bg-surface p-4">
        <Text className="font-semibold text-main">Support</Text>
      </View>
    </CustomScreen>
  );
};

export default Contact;
