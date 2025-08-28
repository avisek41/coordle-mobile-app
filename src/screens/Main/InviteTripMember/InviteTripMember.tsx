import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { INVITE_TRIP_MEMBER_STRINGS } from './strings';
import { Header } from '@/src/components';
import { GradientButton } from '@/src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';
import { useInviteUsersToTripMutation } from '@/src/services';
import CountryPicker from '@/src/components/CountryPicker/CountryPicker';
import countries from '@/src/constant/countries';

interface MemberTag {
  id: string;
  value: string;
  type: 'email' | 'phone';
}

interface PhoneInput {
  id: string;
  countryCode: string;
  phoneNumber: string;
  country: {
    code: string;
    phone: string;
  };
}

const InviteTripMember = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'InviteTripMember'>>();
  const { tripId, inviteType } = route.params || {};
  const { showToast, ToastComponent } = useSimpleToast();

  const [inputValue, setInputValue] = useState('');
  const [memberTags, setMemberTags] = useState<MemberTag[]>([]);

  // Phone-specific state
  const defaultCountry = countries.find(c => c.phone === '+1') || countries[0];
  const [phoneInputs, setPhoneInputs] = useState<PhoneInput[]>([
    {
      id: '1',
      countryCode: defaultCountry.phone,
      phoneNumber: '',
      country: defaultCountry,
    },
  ]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [activeInputId, setActiveInputId] = useState<string>('');

  // Debug: Log phone inputs whenever they change
  useEffect(() => {
    console.log('Phone inputs updated:', phoneInputs);
  }, [phoneInputs]);

  const [inviteUsersToTrip, { isLoading: isInviting }] =
    useInviteUsersToTripMutation();

  const isEmailType = inviteType === 'email';
  const instruction = isEmailType
    ? INVITE_TRIP_MEMBER_STRINGS.EMAIL_INSTRUCTION
    : INVITE_TRIP_MEMBER_STRINGS.PHONE_INSTRUCTION;
  const label = isEmailType
    ? INVITE_TRIP_MEMBER_STRINGS.EMAIL_LABEL
    : INVITE_TRIP_MEMBER_STRINGS.PHONE_LABEL;
  const placeholder = isEmailType
    ? INVITE_TRIP_MEMBER_STRINGS.EMAIL_PLACEHOLDER
    : INVITE_TRIP_MEMBER_STRINGS.PHONE_PLACEHOLDER;

  // Phone input functions
  const addPhoneInput = () => {
    const newId = Date.now().toString();
    const newInput: PhoneInput = {
      id: newId,
      countryCode: defaultCountry.phone,
      phoneNumber: '',
      country: defaultCountry,
    };
    setPhoneInputs([...phoneInputs, newInput]);
  };

  const removePhoneInput = (id: string) => {
    if (phoneInputs.length > 1) {
      setPhoneInputs(phoneInputs.filter(input => input.id !== id));
    }
  };

  const updatePhoneInput = (
    id: string,
    field: 'countryCode' | 'phoneNumber' | 'country',
    value: any,
  ) => {
    setPhoneInputs(
      phoneInputs.map(input =>
        input.id === id ? { ...input, [field]: value } : input,
      ),
    );
  };

  const handleCountrySelect = (country: any) => {
    console.log('Country selected:', country);
    console.log('Active input ID:', activeInputId);

    if (activeInputId && country && country.phone) {
      // Validate country data
      if (!country.code || !country.name || !country.phone) {
        console.error('Invalid country data:', country);
        return;
      }

      // Update both country and countryCode to ensure consistency
      setPhoneInputs(prevInputs => {
        console.log('Previous inputs:', prevInputs);
        const updatedInputs = prevInputs.map(input =>
          input.id === activeInputId
            ? {
                ...input,
                country: country,
                countryCode: country.phone,
              }
            : input,
        );
        console.log('Updated inputs:', updatedInputs);
        return updatedInputs;
      });
    } else {
      console.log('No active input ID found or invalid country data');
    }
    setShowCountryPicker(false);
    setActiveInputId(''); // Reset active input ID
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      const cleanValue = inputValue.trim();

      // Validate the input based on type
      const isValid = isEmailType
        ? validateEmail(cleanValue)
        : validatePhone(cleanValue);

      if (!isValid) {
        showToast({
          type: 'error',
          title: 'Invalid Format',
          message: isEmailType
            ? 'Please enter a valid email address'
            : 'Please enter a valid phone number',
          duration: 2000,
        });
        return;
      }

      // Check for duplicates
      const isDuplicate = memberTags.some(
        tag => tag.value.toLowerCase() === cleanValue.toLowerCase(),
      );
      if (isDuplicate) {
        showToast({
          type: 'error',
          title: 'Duplicate Entry',
          message: 'This contact is already in the list',
          duration: 2000,
        });
        return;
      }

      const newTag: MemberTag = {
        id: Date.now().toString(),
        value: cleanValue,
        type: inviteType as 'email' | 'phone',
      };
      setMemberTags([...memberTags, newTag]);
      setInputValue('');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);

    // Check if the last character is space or comma
    if (text.endsWith(' ') || text.endsWith(',')) {
      const cleanValue = text.slice(0, -1).trim();
      if (cleanValue) {
        // Validate the input based on type
        const isValid = isEmailType
          ? validateEmail(cleanValue)
          : validatePhone(cleanValue);

        if (!isValid) {
          showToast({
            type: 'error',
            title: 'Invalid Format',
            message: isEmailType
              ? 'Please enter a valid email address'
              : 'Please enter a valid phone number',
            duration: 2000,
          });
          setInputValue('');
          return;
        }

        // Check for duplicates
        const isDuplicate = memberTags.some(
          tag => tag.value.toLowerCase() === cleanValue.toLowerCase(),
        );
        if (isDuplicate) {
          showToast({
            type: 'error',
            title: 'Duplicate Entry',
            message: 'This contact is already in the list',
            duration: 2000,
          });
          setInputValue('');
          return;
        }

        const newTag: MemberTag = {
          id: Date.now().toString(),
          value: cleanValue,
          type: inviteType as 'email' | 'phone',
        };
        setMemberTags([...memberTags, newTag]);
        setInputValue('');
      }
    }
  };

  const removeTag = (id: string) => {
    setMemberTags(memberTags.filter(tag => tag.id !== id));
  };

  const handleInvite = async () => {
    // Validate tripId is present
    if (!tripId) {
      showToast({
        type: 'error',
        title: 'Trip ID Required',
        message:
          'Trip ID is missing. Cannot invite members without a trip. Please save the trip first.',
        duration: 3000,
      });
      return;
    }

    if (isEmailType) {
      // Handle email invites
      if (memberTags.length === 0) {
        showToast({
          type: 'error',
          title: 'No Members',
          message: 'Please add at least one member to invite.',
          duration: 2000,
        });
        return;
      }
    } else {
      // Handle phone invites
      const validPhoneInputs = phoneInputs.filter(
        input => input.phoneNumber.trim().length > 0,
      );
      if (validPhoneInputs.length === 0) {
        showToast({
          type: 'error',
          title: 'No Phone Numbers',
          message: 'Please add at least one phone number to invite.',
          duration: 2000,
        });
        return;
      }

      // Check for incomplete phone numbers
      const incompleteInputs = validPhoneInputs.filter(
        input => input.phoneNumber.trim().length < 10,
      );
      if (incompleteInputs.length > 0) {
        showToast({
          type: 'error',
          title: 'Incomplete Phone Numbers',
          message: 'Please ensure all phone numbers are complete.',
          duration: 2000,
        });
        return;
      }

      // Convert phone inputs to member tags
      const phoneTags: MemberTag[] = validPhoneInputs.map(input => ({
        id: input.id,
        value: `${input.countryCode}${input.phoneNumber}`,
        type: 'phone' as const,
      }));
      setMemberTags(phoneTags);
    }

    try {
      // Prepare users array for the API
      const users = memberTags.map(member => ({
        email: member.value,
        userRole: 'traveller',
        isInvited: true,
      }));

      // Call the invite users API
      const response = await inviteUsersToTrip({
        tripId,
        users,
      }).unwrap();

      // Validate response
      if (!response.success) {
        throw new Error('Failed to invite users to trip');
      }

      showToast({
        type: 'success',
        title: 'Invitation Sent',
        message: `Successfully invited ${memberTags.length} member(s)!`,
        duration: 2000,
      });

      // Navigate to TripDetails after successful invitation
      if (tripId) {
        navigation.navigate('TripDetails', { tripId });
      } else {
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Error inviting members:', error);
      showToast({
        type: 'error',
        title: 'Invitation Failed',
        message:
          error?.data?.message ||
          'Failed to send invitations. Please try again.',
        duration: 3000,
      });
    }
  };

  const getInitials = (value: string) => {
    if (isEmailType) {
      return value.split('@')[0].charAt(0).toUpperCase();
    }
    return value.charAt(0).toUpperCase();
  };

  console.log('phoneInputs', phoneInputs);

  return (
    <SafeAreaView style={styles.container}>
      <ToastComponent />
      <VStack space="lg" className="flex-1 bg-white">
        {/* Header */}
        <Header title={INVITE_TRIP_MEMBER_STRINGS.TITLE} />

        {/* Content */}
        <VStack space="lg" className="flex-1 px-4">
          {/* Input Section */}
          <VStack space="sm">
            {isEmailType && (
              <Text className="text-base font-body text-gray-800">{label}</Text>
            )}

            {isEmailType ? (
              // Email Input Section
              <Box className="bg-white border border-primary-500 rounded-md p-3">
                {/* Email Chips */}
                {memberTags.length > 0 && (
                  <HStack className="items-center flex-wrap mb-2" space="sm">
                    {memberTags.map(tag => (
                      <HStack
                        key={tag.id}
                        className="items-center bg-primary-50 rounded-full px-3 py-1"
                        style={styles.chipContainer}
                      >
                        <Text className="text-sm font-body text-gray-800 mr-2">
                          {tag.value}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeTag(tag.id)}
                          className="w-4 h-4 justify-center items-center"
                        >
                          <Ionicons name="close" size={12} color="#6B7280" />
                        </TouchableOpacity>
                      </HStack>
                    ))}
                  </HStack>
                )}

                {/* Input field at bottom */}
                <TextInput
                  placeholder={placeholder}
                  value={inputValue}
                  onChangeText={handleInputChange}
                  onSubmitEditing={handleInputSubmit}
                  style={styles.textInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Box>
            ) : (
              // Phone Input Section
              <VStack space="md">
                {phoneInputs.map((input, index) => (
                  <VStack key={input.id} space="sm">
                    <HStack className="bg-gray-50 border border-gray-200 rounded-lg h-12 items-center px-3">
                      {/* Country Flag and Code Picker */}
                      <Image
                        source={{
                          uri: `https://flagcdn.com/w20/${input.country.code
                            .slice(0, 2)
                            .toLowerCase()}.png`,
                        }}
                        style={{
                          width: 20,
                          height: 20,
                        }}
                        resizeMode="contain"
                      />
                      <Pressable
                        onPress={() => {
                          console.log('Setting active input ID:', input.id);
                          setActiveInputId(input.id);
                          setShowCountryPicker(true);
                        }}
                        className="px-3 py-2"
                      >
                        <Text className="text-base font-body text-black">
                          {input.countryCode}
                        </Text>
                      </Pressable>

                      {/* Vertical Divider */}
                      <Box className="w-[1px] h-9 bg-gray-400 mx-2" />

                      {/* Phone Number Input */}
                      <TextInput
                        placeholder="Phone Number"
                        value={input.phoneNumber}
                        onChangeText={value =>
                          updatePhoneInput(input.id, 'phoneNumber', value)
                        }
                        keyboardType="number-pad"
                        className="flex-1 h-12 text-base font-body text-black"
                        style={styles.phoneInput}
                      />

                      {/* Remove Button */}
                      {phoneInputs.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removePhoneInput(input.id)}
                          className="w-6 h-6 justify-center items-center ml-2"
                        >
                          <Ionicons
                            name="remove-circle"
                            size={20}
                            color={Colors.gray}
                          />
                        </TouchableOpacity>
                      )}
                    </HStack>
                  </VStack>
                ))}

                {/* Add Another Button */}
                <TouchableOpacity onPress={addPhoneInput} className="self-end">
                  <Text className="text-primary-500 text-sm font-heading">
                    + Add another
                  </Text>
                </TouchableOpacity>
              </VStack>
            )}
          </VStack>
        </VStack>

        {/* Invite Button */}
        <Box className="px-4 pb-6">
          <GradientButton
            title={INVITE_TRIP_MEMBER_STRINGS.INVITE_BUTTON}
            onPress={handleInvite}
            colors={['#2E6F9E', '#51B1C0']}
            disabled={
              isEmailType
                ? memberTags.length === 0
                : phoneInputs.filter(
                    input => input.phoneNumber.trim().length > 0,
                  ).length === 0 || isInviting
            }
            loading={isInviting}
          />
        </Box>
      </VStack>

      {/* Country Picker Modal */}
      {!isEmailType && (
        <CountryPicker
          visible={showCountryPicker}
          onClose={() => setShowCountryPicker(false)}
          onSelect={handleCountrySelect}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'AvenirLTProRoman',
    color: '#374151',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  phoneInput: {
    fontFamily: 'AvenirLTProRoman',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  chipContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  closeButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
});

export default InviteTripMember;
