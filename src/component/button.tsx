import { Pressable, Text } from 'react-native';


interface CustomButtomProps {
    title: string;
    onPress?: () => void;
    variant?: 'primary' | 'navy';
}


const CustomButton = ({title,onPress,variant = 'primary'}: CustomButtomProps) => {
    const bgClass = variant==='primary' ? 'bg-primary': 'bg-navy';
  
    return (
    <Pressable
      onPress={onPress}
      className={`${bgClass} px-4 py-2.5 rounded-lg items-center justify-center active:opacity-80`}
    >
      <Text className="text-white font-semibold text-sm">{title}</Text>
    </Pressable>
  )
}

export default CustomButton