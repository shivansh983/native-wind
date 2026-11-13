import { Text, View } from 'react-native';
import { useAppStore } from '../store/useStore';
import CustomButton from './button';

interface TopHeaderProps {
  screenTitle: string;
  onUpload?: () => void;
}

const TopHeader = ({ screenTitle, onUpload }: TopHeaderProps) => {
  const isUploading = useAppStore((state) => state.isUploading);

  return (
    <View className="flex-row items-center justify-between bg-navy px-4 pb-4 pt-2">
      <View>
        <Text className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          NativeUpload
        </Text>
        <Text className="mt-0.5 text-2xl font-bold text-white">
          {screenTitle}
        </Text>
      </View>

      <CustomButton
        title={isUploading ? 'Uploading...' : 'Upload'}
        onPress={onUpload}
        disabled={isUploading}
      />
    </View>
  );
};

export default TopHeader;
