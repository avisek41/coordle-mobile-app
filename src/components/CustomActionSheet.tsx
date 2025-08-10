import React from 'react';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';

export interface ActionItem {
  id: string;
  title: string;
  onPress: () => void;
  isDestructive?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
}

export interface CustomActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  actions: ActionItem[];
  showCancelButton?: boolean;
  cancelButtonText?: string;
  onCancelPress?: () => void;
}

const CustomActionSheet: React.FC<CustomActionSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  actions,
  showCancelButton = false,
  cancelButtonText = 'Cancel',
  onCancelPress,
}) => {
  const handleCancel = () => {
    if (onCancelPress) {
      onCancelPress();
    }
    onClose();
  };

  const handleActionPress = (action: ActionItem) => {
    if (!action.isDisabled) {
      action.onPress();
      onClose();
    }
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <VStack className="w-full">
          {/* Header section with title and subtitle */}
          {(title || subtitle) && (
            <VStack className="px-4 py-3 border-b border-gray-200">
              {title && (
                <Text className="text-lg font-heading text-gray-900 text-left">
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text className="text-sm font-body text-gray-600 text-left mt-1">
                  {subtitle}
                </Text>
              )}
            </VStack>
          )}

          {/* Action items */}
          {actions.map(action => (
            <ActionsheetItem
              key={action.id}
              onPress={() => handleActionPress(action)}
              disabled={action.isDisabled}
            >
              <HStack className="flex-row items-center justify-start w-full">
                {action.icon && <HStack className="mr-3">{action.icon}</HStack>}
                <ActionsheetItemText
                  size="md"
                  className={action.isDestructive ? 'text-red-600' : ''}
                >
                  {action.title}
                </ActionsheetItemText>
              </HStack>
            </ActionsheetItem>
          ))}

          {/* Cancel button */}
          {showCancelButton && (
            <ActionsheetItem onPress={handleCancel}>
              <ActionsheetItemText size="md" className="text-gray-500">
                {cancelButtonText}
              </ActionsheetItemText>
            </ActionsheetItem>
          )}
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default CustomActionSheet;
