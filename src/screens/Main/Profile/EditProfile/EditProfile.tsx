import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  View,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import {
  GradientButton,
  Header,
  Dropdown,
  CountryStatePicker,
  ProfileAvatar,
} from '@/src/components';
import { Pressable } from '@/components/ui/pressable';
import CountryPicker from '@/src/components/CountryPicker/CountryPicker';
import { strings } from './strings';
import {
  useGetCurrentUserProfileQuery,
  useGetProfileOptionsQuery,
  useSetupProfileMutation,
} from '@/src/services';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { Loader } from '@/src/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '@/src/styles';
import { images } from '@/src/assets';

const EditProfile: React.FC = () => {
  const { navigate } = useNavigation<MainNavigationProps>();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    preferredName: '',
    phoneNumber: '',
    email: '',
    pronouns: '',
    country: '',
    state: '',
    postalCode: '',
    preferredAirport: '',
  });

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCountryStatePicker, setShowCountryStatePicker] = useState(false);
  const [pickerType, setPickerType] = useState<'country' | 'state'>('country');
  const [countryCode, setCountryCode] = useState('+1');
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'US',
    phone: '+1',
  });
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [selectedStateName, setSelectedStateName] = useState('');
  const [isSmsConsentChecked, setIsSmsConsentChecked] = useState(false);

  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    refetch,
  } = useGetCurrentUserProfileQuery();
  const { data: profileOptions, isLoading: isLoadingOptions } =
    useGetProfileOptionsQuery();
  const [updateProfile, { isLoading: isUpdating }] = useSetupProfileMutation();
  const { showToast, ToastComponent } = useSimpleToast();

  // Load user data when profile is fetched
  React.useEffect(() => {
    if (userProfile?.data) {
      const userData = userProfile.data;
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        preferredName: userData.preferredName || '',
        phoneNumber: userData.phoneNumber || '',
        email: userData.email || '',
        pronouns: userData.pronouns || '',
        country: userData.country || '',
        state: userData.state || '',
        postalCode: userData.postalCode || '',
        preferredAirport: userData.preferredAirport || '',
      });

      // Set country code and name
      if (userData.country) {
        setSelectedCountryName(userData.country);
      }
      if (userData.state) {
        setSelectedStateName(userData.state);
      }
    }
  }, [userProfile]);

  // Convert API data to dropdown options format
  const pronounsOptions =
    profileOptions?.data?.pronouns?.map(pronoun => ({
      label: pronoun,
      value: pronoun.toLowerCase().replace(/\s+/g, '_'),
    })) || [];

  const handleCountryStateSelect = (
    type: 'country' | 'state',
    value: string,
    label: string,
  ) => {
    if (type === 'country') {
      updateFormData('country', value);
      setSelectedCountryName(label);
      // Reset state when country changes
      updateFormData('state', '');
      setSelectedStateName('');
    } else if (type === 'state') {
      updateFormData('state', value);
      setSelectedStateName(label);
    }
    setShowCountryStatePicker(false);
  };

  const openCountryStatePicker = (type: 'country' | 'state') => {
    setPickerType(type);
    setShowCountryStatePicker(true);
  };

  const handleSave = async () => {
    try {
      // Prepare the data for the API
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        preferredName: formData.preferredName,
        phoneNumber: formData.phoneNumber,
        pronouns: formData.pronouns,
        country: formData.country,
        state: formData.state,
        postalCode: formData.postalCode,
        preferredAirport: formData.preferredAirport,
        // Keep existing other info fields that we don't want to change
        racialEthnic: userProfile?.data?.racialEthnic || '',
        ageDemographic: userProfile?.data?.ageDemographic || '',
        foodAllergies: userProfile?.data?.foodAllergies || [],
        dietaryRestrictions: userProfile?.data?.dietaryRestrictions || '',
        genderIdentity: userProfile?.data?.genderIdentity || '',
        sexualOrientation: userProfile?.data?.sexualOrientation || '',
        disabilityStatus: userProfile?.data?.disabilityStatus || '',
      };

      const response = await updateProfile(updateData).unwrap();

      if (response.success) {
        showToast({
          type: 'success',
          title: strings.profileUpdateSuccessTitle,
          message: strings.profileUpdateSuccessMessage,
          duration: 3000,
        });
      } else {
        showToast({
          type: 'error',
          title: strings.profileUpdateErrorTitle,
          message: strings.profileUpdateErrorMessage,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      showToast({
        type: 'error',
        title: strings.profileUpdateErrorTitle,
        message: strings.profileUpdateErrorMessage,
        duration: 3000,
      });
    }
  };

  const handleBack = () => {
    navigate('BottomTabs');
  };

  const updateFormData = (
    field: string,
    value: string | string[] | boolean,
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderForm = () => (
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

      {/* Email */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">Email*</Text>
        <Box className="relative mt-2">
          <Input
            className="bg-gray-100 border border-gray-200 rounded-lg w-full h-12"
            style={{ opacity: 1 }}
          >
            <InputField
              placeholder="Enter your email"
              value={formData.email}
              editable={false}
              className="text-base font-body text-gray-600"
              style={{ gap: 1 }}
            />
          </Input>
          {/* Email Verification Icon */}
          {userProfile?.data?.isEmailVerified && (
            <Box className="absolute right-3 top-3">
              <Box className="w-6 h-6 rounded-full bg-green-500 justify-center items-center">
                <Ionicons name="checkmark" size={16} color="white" />
              </Box>
            </Box>
          )}
        </Box>
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
        <Pressable
          onPress={() => openCountryStatePicker('country')}
          className="bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 justify-center"
        >
          <HStack className="items-center justify-between">
            <Text className="text-base font-body text-black">
              {selectedCountryName || strings.countryPlaceholder}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
          </HStack>
        </Pressable>
      </VStack>

      {/* State */}
      <VStack className="space-y-2 mb-4">
        <Text className="text-sm font-body text-black mb-1">
          {strings.state}
        </Text>
        <Pressable
          onPress={() => openCountryStatePicker('state')}
          disabled={!formData.country}
          className={`border border-gray-200 rounded-lg h-12 px-4 justify-center ${
            formData.country ? 'bg-gray-50' : 'bg-gray-100'
          }`}
        >
          <HStack className="items-center justify-between">
            <Text
              className={`text-base font-body ${
                formData.country ? 'text-black' : 'text-gray-400'
              }`}
            >
              {selectedStateName || strings.statePlaceholder}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={formData.country ? '#9CA3AF' : '#D1D5DB'}
            />
          </HStack>
        </Pressable>
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

  // Show loader when API is loading
  if (isLoadingProfile || isLoadingOptions) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Toast Component */}
      <ToastComponent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Cover Image with Curve */}
        <Box className="relative">
          <Image source={images.cover} style={styles.coverImage} />

          {/* Header Overlay */}
          <Box className="absolute top-0 left-0 right-0">
            <Header
              title={strings.title}
              onBackPress={handleBack}
              showBackButton={true}
              titleStyle={{
                color: '#fff',
              }}
              iconColor="#fff"
            />
          </Box>
        </Box>

        {/* Avatar Section */}
        <Box className="items-center -mt-16 mb-6">
          <ProfileAvatar
            size="medium"
            showEditButton={true}
            onUploadSuccess={profilePhotoUrl => {
              showToast({
                type: 'success',
                message: 'Profile photo updated successfully!',
              });
            }}
            onUploadError={error => {
              showToast({
                type: 'error',
                message: error,
              });
            }}
          />
        </Box>

        {/* Form Content */}
        <VStack className="flex-1 px-6 py-8">
          <Box className="flex-1">{renderForm()}</Box>

          {/* Save Button */}
          <GradientButton
            title={strings.saveButton}
            onPress={handleSave}
            loading={isUpdating}
          />
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

      <CountryStatePicker
        visible={showCountryStatePicker}
        onClose={() => setShowCountryStatePicker(false)}
        onSelect={handleCountryStateSelect}
        type={pickerType}
        selectedCountry={formData.country}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
});

export default EditProfile;
