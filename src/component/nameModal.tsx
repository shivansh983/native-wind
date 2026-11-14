import { useEffect, useState } from 'react';
import { Modal, Text, TextInput, View } from 'react-native';
import { useAppStore } from '../store/useStore';
import { COLORS } from '../theme/colors';
import CustomButton from './button';

interface NameModalProps {
  visible: boolean;
  title: string;
  hint?: string;
  initial: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: (name: string) => void;
}

// asks for a file name
const NameModal = ({
  visible,
  title,
  hint,
  initial,
  confirmLabel,
  onCancel,
  onConfirm,
}: NameModalProps) => {
  const [name, setName] = useState(initial);

  // refill when a new file is picked
  useEffect(() => {
    if (visible) setName(initial);
  }, [visible, initial]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full rounded-2xl bg-surface p-5">
          <Text className="text-lg font-bold text-main">{title}</Text>

          {hint ? (
            <Text className="mt-1 text-xs text-muted">{hint}</Text>
          ) : null}

          <TextInput
            value={name}
            onChangeText={setName}
            autoFocus
            selectTextOnFocus
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="File name"
            placeholderTextColor={COLORS.textMuted}
            className="mt-3 rounded-xl border border-border px-3 py-2.5 text-main"
          />

          <View className="mt-4 flex-row justify-end gap-2">
            <CustomButton title="Cancel" variant="outline" onPress={onCancel} />
            <CustomButton
              title={confirmLabel}
              onPress={() => onConfirm(name.trim() || initial)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NameModal;

// shows after a file is picked
export const UploadNameModal = () => {
  const pending = useAppStore((state) => state.pending);
  const confirmUpload = useAppStore((state) => state.confirmUpload);
  const cancelUpload = useAppStore((state) => state.cancelUpload);

  return (
    <NameModal
      visible={pending !== null}
      title="Name this file"
      hint="This is the name stored in the database and on the server."
      initial={pending?.name ?? ''}
      confirmLabel="Upload"
      onCancel={cancelUpload}
      onConfirm={confirmUpload}
    />
  );
};
