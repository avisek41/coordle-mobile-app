import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { HStack } from '@/components/ui/hstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';

interface InputBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({
  value,
  onChangeText,
  onSend,
  placeholder = 'Message...',
  isLoading = false,
  disabled = false,
}) => {
  const isDisabled = disabled || !value.trim() || isLoading;

  return (
    <HStack className="items-center px-4 py-3 border-t border-gray-200">
      <TextInput
        style={styles.messageInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline
        placeholderTextColor="#9CA3AF"
        editable={!disabled}
      />
      <TouchableOpacity
        onPress={onSend}
        style={[styles.sendButton, isDisabled && styles.sendButtonDisabled]}
        disabled={isDisabled}
      >
        {isLoading ? (
          <ActivityIndicator size={20} color={Colors.white} />
        ) : (
          <Ionicons
            name={'send'}
            size={20}
            color={value.trim() && !isLoading ? Colors.white : '#9CA3AF'}
          />
        )}
      </TouchableOpacity>
    </HStack>
  );
};

const styles = StyleSheet.create({
  messageInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});

export default InputBox;
