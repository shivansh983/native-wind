import { Modal, Pressable, Text, View } from 'react-native';

export interface MenuAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionMenuProps {
  visible: boolean;
  title?: string;
  actions: MenuAction[];
  onClose: () => void;
}

// the 3-dots sheet
const ActionMenu = ({ visible, title, actions, onClose }: ActionMenuProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* tap outside to dismiss */}
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        {/* keeps the tap off the backdrop */}
        <Pressable className="rounded-t-3xl bg-surface pb-8 pt-2">
          {title ? (
            <Text
              className="px-5 pb-2 pt-3 text-xs text-muted"
              numberOfLines={1}
            >
              {title}
            </Text>
          ) : null}

          {actions.map((action, i) => (
            <View key={action.label}>
              {i > 0 ? <View className="h-px bg-border" /> : null}

              <Pressable
                onPress={action.onPress}
                className="px-5 py-4 active:bg-border/40"
              >
                <Text
                  className={`text-base font-semibold ${
                    action.destructive ? 'text-danger' : 'text-main'
                  }`}
                >
                  {action.label}
                </Text>
              </Pressable>
            </View>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ActionMenu;
