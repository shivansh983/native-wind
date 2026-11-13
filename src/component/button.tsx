import { Pressable, Text } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'navy' | 'outline';
  disabled?: boolean;
}

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}: CustomButtonProps) => {
  const boxClass =
    variant === 'primary'
      ? 'bg-primary'
      : variant === 'navy'
        ? 'bg-navy'
        : 'bg-transparent border border-border';

  const textClass = variant === 'outline' ? 'text-main' : 'text-white';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${boxClass} ${disabled ? 'opacity-50' : ''} items-center justify-center rounded-xl px-4 py-2.5 active:opacity-80`}
    >
      <Text className={`${textClass} text-sm font-semibold`}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;
