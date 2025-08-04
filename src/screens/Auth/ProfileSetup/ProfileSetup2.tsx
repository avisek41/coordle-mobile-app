import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Dropdown } from '@/src/components';
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
  // Static options data
  const racialEthnicOptions = [
    { label: 'Asian', value: 'asian' },
    { label: 'Black or African American', value: 'black' },
    { label: 'Hispanic or Latino', value: 'hispanic' },
    { label: 'Native American', value: 'native_american' },
    { label: 'Pacific Islander', value: 'pacific_islander' },
    { label: 'White', value: 'white' },
    { label: 'Multiracial', value: 'multiracial' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

  const ageDemographicOptions = [
    { label: '18-24', value: '18-24' },
    { label: '25-34', value: '25-34' },
    { label: '35-44', value: '35-44' },
    { label: '45-54', value: '45-54' },
    { label: '55-64', value: '55-64' },
    { label: '65+', value: '65+' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

  const foodAllergiesOptions = [
    { label: 'All seafood (including shellfish)', value: 'seafood' },
    { label: 'Dairy', value: 'dairy' },
    { label: 'Gluten', value: 'gluten' },
    { label: 'Tree Nuts', value: 'tree_nuts' },
    { label: 'Peanuts', value: 'peanuts' },
    { label: 'No Allergy', value: 'no_allergy' },
    { label: 'Other', value: 'other' },
  ];

  const dietaryRestrictionsOptions = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Kosher', value: 'kosher' },
    { label: 'Halal', value: 'halal' },
    { label: 'No Restrictions', value: 'no_restrictions' },
    { label: 'Other', value: 'other' },
  ];

  const genderIdentityOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'non_binary' },
    { label: 'Gender fluid', value: 'gender_fluid' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

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
              onPress={() =>
                updateFormData(
                  'sexualOrientation',
                  !formData.sexualOrientation ? 'true' : 'false',
                )
              }
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
      </VStack>

      {/* Disability Status Toggle */}
      <VStack className="space-y-2 mb-4">
        <Box className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <HStack className="items-center justify-between">
            <Text className="text-sm font-body text-black">
              Disability status
            </Text>
            <TouchableOpacity
              onPress={() =>
                updateFormData(
                  'disabilityStatus',
                  !formData.disabilityStatus ? 'true' : 'false',
                )
              }
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
      </VStack>
    </VStack>
  );
};

export default ProfileSetup2;
