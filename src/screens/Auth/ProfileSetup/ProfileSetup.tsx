import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  View,
  Image,
  Alert,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { GradientButton, Header, Dropdown } from '@/src/components';
import { Pressable } from '@/components/ui/pressable';
import CountryPicker from '@/src/components/CountryPicker/CountryPicker';
import ProfileSetup2 from './ProfileSetup2';
import { strings } from './strings';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileSetup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    preferredName: '',
    phoneNumber: '',
    pronouns: '',
    country: '',
    state: '',
    postalCode: '',
    preferredAirport: '',
    // ProfileSetup2 fields
    racialEthnic: '',
    ageDemographic: '',
    foodAllergies: [],
    dietaryRestrictions: '',
    genderIdentity: '',
    sexualOrientation: false,
    disabilityStatus: false,
  });

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'US',
    phone: '+1',
  });
  const [isSmsConsentChecked, setIsSmsConsentChecked] = useState(false);

  // Static pronouns data
  const pronounsOptions = [
    { label: 'He/Him', value: 'he_him' },
    { label: 'She/Her', value: 'she_her' },
    { label: 'They/Them', value: 'they_them' },
    { label: 'He/They', value: 'he_they' },
    { label: 'She/They', value: 'she_they' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

  // Static country data
  const countryOptions = [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Australia', value: 'au' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
  ];

  // Static state data
  const stateOptions = [
    { label: 'California', value: 'ca' },
    { label: 'New York', value: 'ny' },
    { label: 'Texas', value: 'tx' },
    { label: 'Florida', value: 'fl' },
    { label: 'Illinois', value: 'il' },
    { label: 'Pennsylvania', value: 'pa' },
  ];

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      handleProfileSetup2Next();
    }
  };

  const handleProfileSetup2Next = () => {
    Alert.alert('Success', 'Profile setup completed!');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep1 = () => (
    <VStack className="space-y-4">
      {/* First Name */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          {strings.firstName}
        </Text>
        <Box className="relative mt-2">
          <Input
            className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
            style={{ opacity: 1 }}
          >
            <InputField
              placeholder={strings.firstNamePlaceholder}
              value={formData.firstName}
              onChangeText={value => updateFormData('firstName', value)}
              className="text-base font-body"
              style={{ gap: 1 }}
            />
          </Input>
        </Box>
      </VStack>

      {/* Last Name */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          {strings.lastName}
        </Text>
        <Box className="relative mt-2">
          <Input
            className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
            style={{ opacity: 1 }}
          >
            <InputField
              placeholder={strings.lastNamePlaceholder}
              value={formData.lastName}
              onChangeText={value => updateFormData('lastName', value)}
              className="text-base font-body"
              style={{ gap: 1 }}
            />
          </Input>
        </Box>
      </VStack>

      {/* Preferred Name */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          {strings.preferredName}
        </Text>
        <Box className="relative mt-2">
          <Input
            className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
            style={{ opacity: 1 }}
          >
            <InputField
              placeholder={strings.preferredNamePlaceholder}
              value={formData.preferredName}
              onChangeText={value => updateFormData('preferredName', value)}
              className="text-base font-body"
              style={{ gap: 1 }}
            />
          </Input>
        </Box>
      </VStack>

      {/* Phone Number */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">Phone number*</Text>
        <HStack className="bg-gray-50 border border-gray-200 rounded-lg h-12 items-center">
          {/* Country Code Selector */}
          <Pressable
            onPress={() => setShowCountryPicker(true)}
            className="px-3 py-2 flex-row items-center"
          >
            <Image
              source={{
                uri: `https://flagcdn.com/w20/${selectedCountry.code
                  .slice(0, 2)
                  .toLowerCase()}.png`,
              }}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
            <Text className="text-base font-body text-black ml-2">
              {countryCode}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
          </Pressable>
          {/* Vertical Divider */}
          <Box className="w-[1px] h-6 bg-gray-400" />
          {/* Phone Number Input */}
          <Input
            className="bg-transparent border-0 flex-1 h-12"
            style={{ opacity: 1 }}
          >
            <InputField
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChangeText={value => updateFormData('phoneNumber', value)}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              className="text-base font-body"
              style={{ gap: 1 }}
            />
          </Input>
        </HStack>
      </VStack>

      {/* SMS Consent Checkbox */}
      <VStack className="space-y-2 mb-4">
        <HStack className="items-start space-x-2">
          <TouchableOpacity
            onPress={() => setIsSmsConsentChecked(!isSmsConsentChecked)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isSmsConsentChecked ? 'checkbox' : 'square-outline'}
              size={20}
              color={isSmsConsentChecked ? '#000' : '#D7D7D7'}
            />
          </TouchableOpacity>
          <Text className="flex-1 text-sm font-body text-black leading-5">
            I agree to receive verified third party SMS in my phone number
          </Text>
        </HStack>
      </VStack>

      {/* Pronouns */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          {strings.pronouns}
        </Text>
        <Dropdown
          label={strings.pronouns}
          placeholder={strings.pronounsPlaceholder}
          options={pronounsOptions}
          value={formData.pronouns}
          onValueChange={value => updateFormData('pronouns', value)}
        />
      </VStack>

      {/* Country */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          {strings.country}
        </Text>
        <Dropdown
          label={strings.country}
          placeholder={strings.countryPlaceholder}
          options={countryOptions}
          value={formData.country}
          onValueChange={value => updateFormData('country', value)}
        />
      </VStack>

      {/* State */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          {strings.state}
        </Text>
        <Dropdown
          label={strings.state}
          placeholder={strings.statePlaceholder}
          options={stateOptions}
          value={formData.state}
          onValueChange={value => updateFormData('state', value)}
        />
      </VStack>

      {/* Postal Code */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          {strings.postalCode}
        </Text>
        <Box className="relative mt-2">
          <Input
            className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
            style={{ opacity: 1 }}
          >
            <InputField
              placeholder={strings.postalCodePlaceholder}
              value={formData.postalCode}
              onChangeText={value => updateFormData('postalCode', value)}
              className="text-base font-body"
              style={{ gap: 1 }}
            />
          </Input>
        </Box>
      </VStack>

      {/* Preferred Airport */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          {strings.preferredAirport}
        </Text>
        <Box className="relative mt-2">
          <Input
            className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
            style={{ opacity: 1 }}
          >
            <InputField
              placeholder={strings.preferredAirportPlaceholder}
              value={formData.preferredAirport}
              onChangeText={value => updateFormData('preferredAirport', value)}
              className="text-base font-body"
              style={{ gap: 1 }}
            />
          </Input>
        </Box>
      </VStack>
    </VStack>
  );

  const getCurrentStepText = () => {
    switch (currentStep) {
      case 1:
        return strings.step1;
      case 2:
        return strings.step2;
      default:
        return strings.step1;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return (
          <ProfileSetup2
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleProfileSetup2Next}
          />
        );
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <VStack className="flex-1 px-6 py-8">
          {/* Header */}
          <Header onBackPress={handleBack} showBackButton={currentStep > 1} />

          {/* Title */}
          <Text className="text-2xl font-body text-black mb-2 mt-4">
            {strings.title}
          </Text>

          {/* Progress */}
          <VStack className="mb-8">
            <Text className="text-sm font-body text-teal-600 mb-2">
              {getCurrentStepText()}
            </Text>
            <Box className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <Box
                className="h-2 bg-primary-500 rounded-full"
                style={{
                  width: `${(currentStep / 2) * 100}%`,
                }}
              />
            </Box>
          </VStack>

          {/* Form Content */}
          <Box className="flex-1">{renderCurrentStep()}</Box>

          {/* Next Button */}
          <GradientButton title={strings.nextButton} onPress={handleNext} />
        </VStack>
      </ScrollView>

      <CountryPicker
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={country => {
          setCountryCode(country.phone);
          setSelectedCountry({ code: country.code, phone: country.phone });
          setShowCountryPicker(false);
        }}
      />
    </SafeAreaView>
  );
};

export default ProfileSetup;
