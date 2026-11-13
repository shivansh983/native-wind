import { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopHeader from './header';

interface CustomScreenProps {
  title: string;
  children: ReactNode;
  onUpload?: () => void;
}

const CustomScreen = ({ title, children, onUpload }: CustomScreenProps) => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-navy">
      <TopHeader screenTitle={title} onUpload={onUpload} />
      <View className="flex-1 bg-background px-4 pt-4">{children}</View>
    </SafeAreaView>
  );
};

export default CustomScreen;
