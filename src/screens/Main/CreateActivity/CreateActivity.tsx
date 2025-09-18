import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input } from '@/components/ui/input';
import { Header } from '@/src/components';
import { globalStyles } from '@/src/styles';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { Colors } from '@/src/configs/CustomTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GradientButton } from '@/src/components';

const CreateActivity: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'CreateActivity'>>();
  const { tripId, tripName, activityName } = route.params;
  const { showToast, ToastComponent } = useSimpleToast();

  const [formData, setFormData] = useState({
    eventName: activityName || '',
    reservationDate: '',
    startTime: '',
    endTime: '',
    phone: '',
    website: '',
    reservationCode: '',
    address: '',
    notes: '',
  });

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.eventName.trim()) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Event name is required',
        duration: 3000,
      });
      return;
    }

    if (!formData.reservationDate.trim()) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Reservation date is required',
        duration: 3000,
      });
      return;
    }

    if (!formData.startTime.trim()) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Start time is required',
        duration: 3000,
      });
      return;
    }

    // Show success message
    showToast({
      type: 'success',
      title: 'Success',
      message: 'Activity created successfully',
      duration: 2000,
    });

    // Navigate back after a short delay
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const renderInputField = (
    label: string,
    field: string,
    placeholder: string,
    isRequired: boolean = false,
    icon?: string,
    multiline: boolean = false,
  ) => (
    <VStack space="xs">
      <Text className="text-sm font-body text-gray-700">
        {label}
        {isRequired && <Text className="text-red-500">*</Text>}
      </Text>
      <Box className="relative">
        <Input
          value={formData[field as keyof typeof formData]}
          onChangeText={value => handleInputChange(field, value)}
          placeholder={placeholder}
          className="pr-10"
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          style={[styles.input, multiline && styles.multilineInput]}
        />
        {icon && (
          <Box className="absolute right-3 top-1/2 -translate-y-1/2">
            <Ionicons name={icon as any} size={20} color={Colors.gray} />
          </Box>
        )}
      </Box>
    </VStack>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <ToastComponent />

      <Header title="Add Event" onBackPress={handleBackPress} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="flex-1"
      >
        <VStack className="px-5 py-4" space="lg">
          {renderInputField(
            'Event name',
            'eventName',
            'Enter event name',
            true,
          )}

          <HStack space="md">
            <Box className="flex-1">
              {renderInputField(
                'Reservation Date',
                'reservationDate',
                'Reservation Date',
                true,
                'calendar-outline',
              )}
            </Box>
          </HStack>

          <HStack space="md">
            <Box className="flex-1">
              {renderInputField(
                'Start Time',
                'startTime',
                'Time',
                true,
                'time-outline',
              )}
            </Box>
            <Box className="flex-1">
              {renderInputField(
                'End Time',
                'endTime',
                'Time',
                false,
                'time-outline',
              )}
            </Box>
          </HStack>

          {renderInputField('Phone', 'phone', 'Enter phone number')}

          {renderInputField('Website', 'website', 'Enter website')}

          {renderInputField(
            'Reservation Code',
            'reservationCode',
            'Enter reservation code',
          )}

          {renderInputField('Address', 'address', 'Enter Address')}

          {renderInputField(
            'Notes',
            'notes',
            'Write a note',
            false,
            undefined,
            true,
          )}

          <Box className="pt-4">
            <GradientButton title="Save Activity" onPress={handleSave} />
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default CreateActivity;
