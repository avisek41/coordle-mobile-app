import React, { useState } from 'react';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Box } from '@/components/ui/box';
import { TouchableOpacity, StyleSheet } from 'react-native';
import GradientButton from './GradientButton';
import Dropdown from './Dropdown';
import { Colors } from '@/src/configs/CustomTheme';

export interface Restaurant {
  name: string;
  link: string;
}

export interface CustomActionFormProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  label?: string;
  placeholder?: string;
  initialValue?: string;
  onSubmit: (value: string, restaurant?: string) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  maxLength?: number;
  multiline?: boolean;
  restaurants?: Restaurant[];
  selectedRestaurant?: string;
  restaurantLabel?: string;
}

const CustomActionForm: React.FC<CustomActionFormProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  label,
  placeholder = 'Please enter text here',
  initialValue = '',
  onSubmit,
  onCancel,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  isLoading = false,
  maxLength,
  multiline = false,
  restaurants,
  selectedRestaurant,
  restaurantLabel = 'Select restaurant',
}) => {
  const [value, setValue] = useState(initialValue);
  const [selectedRestaurantValue, setSelectedRestaurantValue] = useState(
    selectedRestaurant || (restaurants && restaurants.length > 0 ? restaurants[0].name : '')
  );

  // Convert restaurants to dropdown options
  const restaurantOptions = restaurants
    ? restaurants.map((restaurant) => ({
        label: restaurant.name,
        value: restaurant.name,
      }))
    : [];

  const showRestaurantDropdown = restaurants && restaurants.length > 1;

  React.useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      // If selectedRestaurant is provided (edit mode), use it; otherwise use first restaurant
      if (selectedRestaurant) {
        setSelectedRestaurantValue(selectedRestaurant);
      } else if (restaurants && restaurants.length > 0) {
        setSelectedRestaurantValue(restaurants[0].name);
      } else {
        setSelectedRestaurantValue('');
      }
    }
  }, [isOpen, initialValue, selectedRestaurant, restaurants]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setValue(initialValue);
    setSelectedRestaurantValue(
      selectedRestaurant || (restaurants && restaurants.length > 0 ? restaurants[0].name : '')
    );
    onClose();
  };

  const handleSubmit = () => {
    if (value.trim()) {
      // If there's a restaurant dropdown, always pass the selected restaurant value
      if (showRestaurantDropdown && selectedRestaurantValue) {
        onSubmit(value.trim(), selectedRestaurantValue);
      } else if (restaurants && restaurants.length > 0) {
        // If no dropdown but restaurants exist, use the selectedRestaurantValue or first restaurant
        const restaurantToUse = selectedRestaurantValue || restaurants[0].name;
        onSubmit(value.trim(), restaurantToUse);
      } else {
        // No restaurants, just submit the value
        onSubmit(value.trim());
      }
      setValue(initialValue);
      setSelectedRestaurantValue(
        selectedRestaurant || (restaurants && restaurants.length > 0 ? restaurants[0].name : '')
      );
    }
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={handleCancel}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <VStack className="w-full px-4 pb-4 custom-action-form">
          
          {/* Header section with title and subtitle */}
          {(title || subtitle) && (
            <VStack className="py-3 mb-4">
              {title && (
                <Text className="text-lg titleFontWeight text-black text-left">
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

          {/* Restaurant Dropdown - Show only when there are multiple restaurants */}
          {showRestaurantDropdown && (
            <VStack className="mb-5" space="xs">
              <Text className="text-sm font-body text-black">
                {restaurantLabel}
              </Text>
              <Dropdown
                label=""
                placeholder="Select restaurant"
                options={restaurantOptions}
                value={selectedRestaurantValue}
                onValueChange={(selectedValue) => {
                  if (typeof selectedValue === 'string') {
                    setSelectedRestaurantValue(selectedValue);
                  }
                }}
              />
            </VStack>
          )}

          {/* Form Input */}
          <VStack className="mb-16" space="xs">
            {label && (
              <Text className="text-sm font-body text-black mb-1">
                {label}
              </Text>
            )}
            <Input
              className="bg-gray-50 border border-gray-200 rounded-lg"
              style={multiline ? styles.multilineInput : styles.input}
            >
              <InputField
                value={value}
                onChangeText={setValue}
                placeholder={placeholder}
                multiline={multiline}
                numberOfLines={multiline ? 3 : 1}
                maxLength={maxLength}
                autoFocus={!showRestaurantDropdown}
                className="text-base font-body text-black"
                style={multiline ? styles.multilineInputField : undefined}
              />
            </Input>
          </VStack>

          {/* Action Buttons */}
          <HStack className="w-full mt-16" space="md" style={styles.buttonContainer}>
            {/* Cancel Button */}
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>
                {cancelButtonText}
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <Box style={styles.submitButtonContainer}>
              <GradientButton
                title={submitButtonText}
                onPress={handleSubmit}
                loading={isLoading}
                disabled={!value.trim() || isLoading || (showRestaurantDropdown && !selectedRestaurantValue)}
                size="medium"
                style={styles.submitButton}
                textStyle={styles.submitButtonText}
              />
            </Box>
          </HStack>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};

const styles = StyleSheet.create({
  input: {
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 80,
  },
  titleFontWeight: {
    fontWeight: 900,
    fontFamily: 'AvenirLTPro-Bold',
    fontSize: 18,
  },
  multilineInputField: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  buttonContainer: {
    width: '100%'
  },
  cancelButton: {
    flex: 0.75,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: 'AvenirLTPro-Medium',
  },
  submitButtonContainer: {
    flex: 1,
  },
  submitButton: {
    flex: 0.55,
    marginTop: 0,
    height: 48,
    width: '100%',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'AvenirLTPro-Medium',
  },
  customActionForm: {
    overflow: 'hidden',
  },
});

export default CustomActionForm;

