import { Text, View } from 'react-native';
import CustomButton from './button';



const TopHeader = ({screenTitle}:{screenTitle:string}) => {

  return (
    <View className='bg-navy px-4 py-3 flex-row items-center justify-between'>
      <View>
      <Text className="text-xs font-bold uppercase text text-muted">NativeUpload</Text>
        <Text className="text-xl font-bold text-white">
          {screenTitle}
        </Text>
      </View>
     <CustomButton title="Upload" onPress={() => console.log('Upload clicked')} />
    </View>
  );
};

export default TopHeader