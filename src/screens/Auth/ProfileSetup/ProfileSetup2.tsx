import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Dropdown } from '@/src/components';
import { useGetProfileOptionsQuery } from '@/src/services';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ProfileSetup2Props {
  formData: any;
  updateFormData: (field: string, value: string | string[]) => void;
  onNext: () => void;
}

const ProfileSetup2: React.FC<ProfileSetup2Props> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  const { data: profileOptions } = useGetProfileOptionsQuery();

  // Convert API data to dropdown options format
  const racialEthnicOptions =
    profileOptions?.data?.racialEthnic?.map(option => ({
      label: option,
      value: option.toLowerCase().replace(/\s+/g, '_'),
    })) || [];

  const ageDemographicOptions =
    profileOptions?.data?.ageDemographic?.map(option => ({
      label: option,
      value: option,
    })) || [];

  const foodAllergiesOptions =
    profileOptions?.data?.foodAllergies?.map(option => ({
      label: option,
      value: option.toLowerCase().replace(/\s+/g, '_'),
    })) || [];

  const dietaryRestrictionsOptions =
    profileOptions?.data?.dietaryRestrictions?.map(option => ({
      label: option,
      value: option.toLowerCase().replace(/\s+/g, '_'),
    })) || [];

  const genderIdentityOptions =
    profileOptions?.data?.genderIdentity?.map(option => ({
      label: option,
      value: option.toLowerCase().replace(/\s+/g, '_'),
    })) || [];

  const sexualOrientationOptions =
    profileOptions?.data?.sexualOrientation?.map(option => ({
      label: option,
      value: option.toLowerCase().replace(/\s+/g, '_'),
    })) || [];

  const disabilityStatusOptions =
    profileOptions?.data?.disabilityStatus?.map(option => ({
      label: option,
      value: option.toLowerCase().replace(/\s+/g, '_'),
    })) || [];

  return (
    <VStack className="space-y-4">
      {/* Introduction Text */}
      <VStack className="mb-6">
        <Text className="text-base font-body text-black leading-6">
          Our goal is to make your travel experience as robust and personal as
          possible. The following information is optional and will assist in
          your travel experiences and inspirations.
        </Text>
      </VStack>

      {/* Racial/Ethnic Background */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          Racial/Ethnic background*
        </Text>
        <Dropdown
          label="Racial/Ethnic background"
          placeholder="Please select"
          options={racialEthnicOptions}
          value={formData.racialEthnic}
          onValueChange={value => updateFormData('racialEthnic', value)}
        />
      </VStack>

      {/* Age Demographic */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          Age demographic*
        </Text>
        <Dropdown
          label="Age demographic"
          placeholder="Please select"
          options={ageDemographicOptions}
          value={formData.ageDemographic}
          onValueChange={value => updateFormData('ageDemographic', value)}
        />
      </VStack>

      {/* Food Allergies */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          Food allergies*
        </Text>
        <Dropdown
          label="Food allergies"
          placeholder="Please select"
          options={foodAllergiesOptions}
          value={formData.foodAllergies}
          onValueChange={value => updateFormData('foodAllergies', value)}
          multiSelect={true}
        />
      </VStack>

      {/* Dietary Restrictions */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          Dietary restrictions*
        </Text>
        <Dropdown
          label="Dietary restrictions"
          placeholder="Please select"
          options={dietaryRestrictionsOptions}
          value={formData.dietaryRestrictions}
          onValueChange={value => updateFormData('dietaryRestrictions', value)}
        />
      </VStack>

      {/* Gender Identity */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          Gender identity*
        </Text>
        <Dropdown
          label="Gender identity"
          placeholder="Please select"
          options={genderIdentityOptions}
          value={formData.genderIdentity}
          onValueChange={value => updateFormData('genderIdentity', value)}
        />
      </VStack>

      {/* Sexual Orientation Toggle */}
      <VStack className="space-y-2 mb-4">
        <Box className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <HStack className="items-center justify-between">
            <Text className="text-sm font-body text-black">
              Sexual orientation
            </Text>
            <TouchableOpacity
              onPress={() => {
                const newValue = !formData.sexualOrientation;
                updateFormData('sexualOrientation', newValue);
                // Clear the selected value when toggle is turned off
                if (!newValue) {
                  updateFormData('sexualOrientationValue', '');
                }
              }}
              className={`w-12 h-6 rounded-full flex-row items-center ${
                formData.sexualOrientation ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <Box
                className={`w-5 h-5 rounded-full bg-white ${
                  formData.sexualOrientation ? 'ml-7' : 'ml-1'
                }`}
              />
            </TouchableOpacity>
          </HStack>
        </Box>

        {/* Sexual Orientation Options */}
        {formData.sexualOrientation && (
          <VStack className="space-y-2 mt-2">
            {sexualOrientationOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  updateFormData('sexualOrientationValue', option.value)
                }
                className="flex-row items-center justify-between py-2"
              >
                <Text className="text-sm font-body text-black flex-1">
                  {option.label}
                </Text>
                <Box
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    formData.sexualOrientationValue === option.value
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}
                >
                  {formData.sexualOrientationValue === option.value && (
                    <Box className="w-2 h-2 rounded-full bg-white" />
                  )}
                </Box>
              </TouchableOpacity>
            ))}
          </VStack>
        )}
      </VStack>

      {/* Disability Status Toggle */}
      <VStack className="space-y-2 mb-4">
        <Box className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <HStack className="items-center justify-between">
            <Text className="text-sm font-body text-black">
              Disability status
            </Text>
            <TouchableOpacity
              onPress={() => {
                const newValue = !formData.disabilityStatus;
                updateFormData('disabilityStatus', newValue);
                // Clear the selected value when toggle is turned off
                if (!newValue) {
                  updateFormData('disabilityStatusValue', '');
                }
              }}
              className={`w-12 h-6 rounded-full flex-row items-center ${
                formData.disabilityStatus ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <Box
                className={`w-5 h-5 rounded-full bg-white ${
                  formData.disabilityStatus ? 'ml-7' : 'ml-1'
                }`}
              />
            </TouchableOpacity>
          </HStack>
        </Box>

        {/* Disability Status Options */}
        {formData.disabilityStatus && (
          <VStack className="space-y-2 mt-2">
            {disabilityStatusOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  updateFormData('disabilityStatusValue', option.value)
                }
                className="flex-row items-center justify-between py-2"
              >
                <Text className="text-sm font-body text-black flex-1">
                  {option.label}
                </Text>
                <Box
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    formData.disabilityStatusValue === option.value
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}
                >
                  {formData.disabilityStatusValue === option.value && (
                    <Box className="w-2 h-2 rounded-full bg-white" />
                  )}
                </Box>
              </TouchableOpacity>
            ))}
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default ProfileSetup2;
