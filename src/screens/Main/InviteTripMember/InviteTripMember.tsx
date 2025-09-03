import React, { useState, useEffect, useCallback } from 'react';
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
import { Header, PlanUsers } from '@/src/components';
import { GradientButton } from '@/src/components';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';
import {
  useGetSamePlanUsersQuery,
  useInviteUsersToTripMutation,
} from '@/src/services';
import CountryPicker from '@/src/components/CountryPicker/CountryPicker';
import countries from '@/src/constant/countries';
import { User } from '@/src/types/user';

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
  const { tripId, inviteType, ownerId } = route.params || {};
  const { data, isLoading, error, refetch } = useGetSamePlanUsersQuery(ownerId);
  const { showToast, ToastComponent } = useSimpleToast();

  const [inputValue, setInputValue] = useState('');
  const [memberTags, setMemberTags] = useState<MemberTag[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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

  const handleUserSelect = (user: User, isSelected: boolean) => {
    if (isSelected && isEmailType) {
      setSelectedUsers(prev => [...prev, user.email]);
    } else if (isSelected && !isEmailType) {
      setSelectedUsers(prev => [...prev, user.phoneNumber]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== user.email));
      setSelectedUsers(prev => prev.filter(id => id !== user.phoneNumber));
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
    if (activeInputId && country && country.phone) {
      // Validate country data
      if (!country.code || !country.name || !country.phone) {
        console.error('Invalid country data:', country);
        return;
      }

      // Update both country and countryCode to ensure consistency
      setPhoneInputs(prevInputs => {
        const updatedInputs = prevInputs.map(input =>
          input.id === activeInputId
            ? {
                ...input,
                country: country,
                countryCode: country.phone,
              }
            : input,
        );

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
    let users: any[] = [];

    if (isEmailType) {
      // Handle email invites
      if (memberTags.length === 0 && selectedUsers.length === 0) {
        showToast({
          type: 'error',
          title: 'No Members',
          message: 'Please add at least one member to invite.',
          duration: 2000,
        });
        return;
      }

      // Email invite format
      const memberEmails = memberTags.map(member => ({
        email: member.value,
        userRole: 'traveller',
        isInvited: true,
      }));

      const selectedUserEmails = selectedUsers.map(userId => ({
        email: userId,
        userRole: 'traveller',
        isInvited: true,
      }));

      users = [...memberEmails, ...selectedUserEmails];
    } else {
      // Handle phone invites
      // Check for selected users from PlanUsers component
      if (
        selectedUsers.length === 0 &&
        phoneInputs.filter(input => input.phoneNumber.trim().length > 0)
          .length === 0
      ) {
        showToast({
          type: 'error',
          title: 'No Members',
          message: 'Please add at least one member to invite.',
          duration: 2000,
        });
        return;
      }

      const validPhoneInputs = phoneInputs.filter(
        input => input.phoneNumber.trim().length > 0,
      );

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

      // Convert phone inputs to member tags and prepare users array
      const phoneTags: MemberTag[] = validPhoneInputs.map(input => {
        const fullPhoneNumber = `${input.countryCode}${input.phoneNumber}`;

        return {
          id: input.id,
          value: fullPhoneNumber,
          type: 'phone' as const,
        };
      });

      // Update memberTags state for UI consistency
      setMemberTags(phoneTags);

      // Phone invite format - include both manually entered phone numbers and selected users
      const phoneInputUsers = phoneTags.map(member => ({
        phoneNumber: member.value,
        userRole: 'traveller',
      }));

      const selectedPhoneUsers = selectedUsers.map(userId => ({
        phoneNumber: userId,
        userRole: 'traveller',
      }));

      users = [...phoneInputUsers, ...selectedPhoneUsers];
    }

    try {
      const requestBody = {
        tripId,
        users,
      };

      const response = await inviteUsersToTrip(requestBody).unwrap();

      if (!response.success) {
        throw new Error('Failed to invite users to trip');
      }

      showToast({
        type: 'success',
        title: 'Invitation Sent',
        message: `Successfully invited ${memberTags.length} member(s)!`,
        duration: 2000,
      });

      navigation.reset({
        index: 1,
        routes: [
          { name: 'BottomTabs' },
          { name: 'TripDetails', params: { tripId } },
        ],
      });
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

  useFocusEffect(
    useCallback(() => {
      if (ownerId) {
        refetch();
      }
    }, [ownerId]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ToastComponent />
      <VStack space="lg" className="flex-1 bg-white">
        {/* Header */}
        <Header title={INVITE_TRIP_MEMBER_STRINGS.TITLE} />
        {/* Content */}
        <VStack space="lg" className="px-4">
          {/* Input Section */}
          <VStack space="sm">
            {isEmailType && (
              <>
                <Text className="text-base font-body text-gray-800">
                  {INVITE_TRIP_MEMBER_STRINGS.EMAIL_INSTRUCTION}
                </Text>
                <Text className="text-base mt-2 font-body text-gray-800">
                  {label}
                </Text>
              </>
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
                  multiline={true}
                  numberOfLines={4}
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

                <TouchableOpacity onPress={addPhoneInput} className="self-end">
                  <Text className="text-primary-500 text-sm font-heading">
                    + Add another
                  </Text>
                </TouchableOpacity>
              </VStack>
            )}
          </VStack>
        </VStack>
        {/* Conditional rendering based on invite type */}

        <PlanUsers
          ownerId={ownerId}
          selectedUsers={selectedUsers}
          onUserSelect={handleUserSelect}
          isEmailType={isEmailType}
        />
        {/* Invite Button */}
        <Box className="px-4 pb-6">
          <GradientButton
            title={INVITE_TRIP_MEMBER_STRINGS.INVITE_BUTTON}
            onPress={handleInvite}
            disabled={
              isEmailType
                ? memberTags.length === 0 && selectedUsers.length === 0
                : (selectedUsers.length === 0 &&
                    phoneInputs.filter(
                      input => input.phoneNumber.trim().length > 0,
                    ).length === 0) ||
                  isInviting
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
    height: 100,
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
