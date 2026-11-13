import { useRouter } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import { hasApiUrl } from '../api/config';
import { useAppStore } from '../store/useStore';
import CustomButton from './button';

interface TopHeaderProps {
  screenTitle: string;
  onUpload?: () => void;
}

const TopHeader = ({ screenTitle, onUpload }: TopHeaderProps) => {
  const isUploading = useAppStore((state) => state.isUploading);
  const router = useRouter();

  // no server yet -> config tab
  const handleUpload = () => {
    if (!hasApiUrl()) {
      Alert.alert(
        'Server not set',
        'the backend is configured for Docker, Enter your device IP with PORT and press save.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enter IP', onPress: () => router.push('/config?then=upload') },
        ],
      );
      return;
    }

    onUpload?.();
  };

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
        onPress={handleUpload}
        disabled={isUploading}
      />
    </View>
  );
};

export default TopHeader;
