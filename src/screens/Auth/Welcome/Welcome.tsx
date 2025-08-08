import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CountryPicker from '@/src/components/CountryPicker/CountryPicker';
import AppleLogo from '@/src/assets/svg/AppleLogo';
import { images } from '@/src/assets';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { welcomeStrings } from './strings';
import { Pressable } from '@/components/ui/pressable';
import { GradientButton } from '@/src/components';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProps } from '@/src/types/allRoutes';
import { useCheckEmailStatusMutation } from '@/src/services/emailCheckApi';
import {
  useSendPhoneCodeMutation,
  useCheckUserByPhoneMutation,
  useSendLoginCodeMutation,
} from '@/src/services';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';

const Welcome = () => {
  const { navigate } = useNavigation<AuthNavigationProps>();
  const [email, setEmail] = useState('');
  const [emailValidation, setEmailValidation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneValidation, setPhoneValidation] = useState('');

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'IN',
    phone: '+91',
  });
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false); // Track if user is existing

  // Email check mutation and toast
  const [
    checkEmailStatus,
    { isLoading: isCheckingEmail, data: emailData, isSuccess, error, reset },
  ] = useCheckEmailStatusMutation();
  const [sendPhoneCode, { isLoading: isSendingPhoneCode }] =
    useSendPhoneCodeMutation();
  const [checkUserByPhone, { isLoading: isCheckingPhone }] =
    useCheckUserByPhoneMutation();
  const [sendLoginCode, { isLoading: isSendingLoginCode }] =
    useSendLoginCodeMutation();
  const { showToast, ToastComponent } = useSimpleToast();

  const handleGoogleSignIn = () => {
    // Handle Google sign in
    console.log(welcomeStrings.googleSignInPressed);
  };

  const handleAppleSignIn = () => {
    // Handle Apple sign in
    console.log(welcomeStrings.appleSignInPressed);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailValidation('');
    setPhoneValidation('');
  };

  const handleEmailCheck = async () => {
    // Reset previous state

    if (!email.trim()) {
      showToast({
        type: 'error',
        title: welcomeStrings.emailRequired,
        message: welcomeStrings.emailRequiredMessage,
      });
      return;
    }

    if (!validateEmail(email)) {
      showToast({
        type: 'error',
        title: welcomeStrings.invalidEmail,
        message: welcomeStrings.invalidEmailMessage,
      });
      return;
    }

    try {
      await checkEmailStatus(email).unwrap();
    } catch (error: any) {
      // Let the useEffect handle the error
      console.error('Email check error:', error);
    } finally {
      reset();
    }
  };

  // Handle success and data changes
  useEffect(() => {
    if (isSuccess && emailData?.data?.action?.length > 0) {
      console.log('emailData', emailData.data);
      if (emailData.data.action === 'login') {
        setIsExistingUser(true);
        showToast({
          type: 'success',
          title: welcomeStrings.userFound,
          message: welcomeStrings.welcomeBackMessage,
        });
        // Navigate to login screen
        navigate('Login');
      } else if (emailData.data.action === 'register') {
        setIsExistingUser(false);
        showToast({
          type: 'error',
          title: 'Error',
          message: emailData.message || welcomeStrings.pleaseRegisterMessage,
        });
        // Don't navigate, just show the message
      } else if (emailData.data.action === 'verify_email') {
        showToast({
          type: 'error',
          title: 'Error',
          message: emailData.message || welcomeStrings.pleaseRegisterMessage,
        });
        navigate('EmailVerifications', {
          email: email,
        });
      }
    }
  }, [isSuccess, emailData?.data?.action]);

  const handlePhoneChange = (val: string) => {
    // Only allow digits
    const numericValue = val.replace(/[^0-9]/g, '');
    setPhoneNumber(numericValue);
    setPhoneValidation('Number');
    setEmailValidation('');
    if (numericValue === '') {
      setPhoneValidation('');
    }
  };

  const handleSignInPress = async () => {
    if (email.trim()) {
      // If email is provided, do email check
      handleEmailCheck();
    } else if (phoneNumber.trim()) {
      // If phone number is provided, check user by phone first
      try {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;
        const phoneCheckResponse = await checkUserByPhone({
          phoneNumber: fullPhoneNumber,
        }).unwrap();

        console.log('phoneCheckResponse', phoneCheckResponse);

        if (phoneCheckResponse.success) {
          if (phoneCheckResponse.data.action === 'login') {
            // User exists, check if profile is set up
            if (phoneCheckResponse?.data?.user?.isProfileSetup) {
              // Profile is set up, send login code for existing user
              await sendLoginCode({ phoneNumber: fullPhoneNumber }).unwrap();
              showToast({
                type: 'success',
                title: 'Success',
                message: 'Login code sent to your phone number',
                duration: 3000,
              });
              navigate('PhoneVerification', {
                phoneNumber: fullPhoneNumber,
                isExistingUser: true, // Flag to indicate this is an existing user
              });
            } else {
              // Profile not set up, send verification code
              await sendPhoneCode({ phoneNumber: fullPhoneNumber }).unwrap();
              showToast({
                type: 'success',
                title: 'Success',
                message: 'Verification code sent to your phone number',
                duration: 3000,
              });
              navigate('PhoneVerification', {
                phoneNumber: fullPhoneNumber,
              });
            }
          } else if (phoneCheckResponse.data.action === 'register') {
            // New user, send verification code
            await sendPhoneCode({ phoneNumber: fullPhoneNumber }).unwrap();
            showToast({
              type: 'success',
              title: 'Success',
              message: 'Verification code sent to your phone number',
              duration: 3000,
            });
            navigate('PhoneVerification', {
              phoneNumber: fullPhoneNumber,
            });
          }
        }
      } catch (error) {
        console.error('Phone check or verification error:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to process phone number. Please try again.',
          duration: 3000,
        });
      }
    } else {
      // Neither email nor phone provided
      showToast({
        type: 'error',
        title: welcomeStrings.emailRequired,
        message: 'Please enter either email or phone number to continue.',
        duration: 3000,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Coordle Logo */}
        <VStack className="space-y-2">
          <Image
            source={images.appLogo}
            style={{ width: 150, height: 150, alignSelf: 'center' }}
            resizeMode="contain"
          />
        </VStack>

        <VStack className="space-y-2 ml-4">
          <Text className="text-3xl font-body text-black-500">
            {welcomeStrings.welcomeTitle}
          </Text>
          <Text className="text-base text-md text-black-600 mt-2">
            {welcomeStrings.welcomeSubtitle}
          </Text>
        </VStack>

        <VStack className="items-center mt-10 px-4">
          {/* Sign-in Buttons */}
          <VStack className="w-full ">
            {/* Google Sign-in Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
            >
              <HStack className="items-center justify-center space-x-3">
                <Image
                  source={images.googleLogo}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
                <Text className="font-body text-black text-center ml-2 mt-1">
                  {welcomeStrings.signInWithGoogle}
                </Text>
              </HStack>
            </TouchableOpacity>

            {/* Apple Sign-in Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleAppleSignIn}
              activeOpacity={0.8}
            >
              <HStack className="items-center justify-center space-x-3">
                <AppleLogo width={24} height={24} />
                <Text className="text-base font-body text-black text-center  ml-2 mt-1">
                  {welcomeStrings.signInWithApple}
                </Text>
              </HStack>
            </TouchableOpacity>
          </VStack>
          <Image
            source={images.or_sign_banner}
            style={{ width: '70%', height: 50, alignSelf: 'center' }}
            resizeMode="contain"
          />
        </VStack>

        {/* Email Input Section */}
        <VStack className="px-4 space-y-2 mt-2">
          <Text className="text-sm font-body text-black">
            {welcomeStrings.emailPhoneLabel}
          </Text>
          <Box className="h-2" />
          <Box className="relative">
            <Input
              className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
              style={{
                opacity: 1,
              }}
            >
              <InputField
                placeholder={welcomeStrings.emailPhonePlaceholder}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="text-base font-body"
                style={{
                  gap: 1,
                }}
              />
            </Input>
            {emailValidation && (
              <Text className="text-red-500 text-xs mt-1 font-body">
                {emailValidation}
              </Text>
            )}
          </Box>
        </VStack>

        {/* Or Separator */}
        <VStack className="px-4 space-y-2">
          <Box className="h-3" />
          <Box className="items-center">
            <Text className="text-base font-body text-gray-500">
              {welcomeStrings.orText}
            </Text>
          </Box>
        </VStack>

        {/* Phone Number Input Section */}
        <VStack className="px-4 space-y-1">
          <Box className="h-2" />
          <Box className="relative">
            <HStack
              className="items-center bg-gray-50 border rounded-lg px-3"
              style={{ borderColor: '#E8ECF4' }}
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
              {/* Country Code Picker Placeholder */}
              <Pressable onPress={() => setShow(true)} className="px-3 py-2">
                <Text className="text-base font-body text-black">
                  {countryCode}
                </Text>
              </Pressable>
              {/* Vertical Divider */}
              <Box className="w-[1px] h-6 bg-gray-400" />
              {/* Phone Number Input */}
              <Input
                className="bg-gray-50 border-0 w-1/2 h-12"
                style={{
                  opacity: 1,
                }}
              >
                <InputField
                  placeholder={welcomeStrings.phoneNumberLabel}
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="text-base font-body"
                  style={{
                    gap: 1,
                  }}
                />
              </Input>
            </HStack>
          </Box>
        </VStack>

        {/* Agreement Checkbox */}
        <VStack className="px-4 space-y-2 mt-4">
          <HStack space="sm" className="items-start ">
            <TouchableOpacity
              onPress={() => setIsAgreementChecked(!isAgreementChecked)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isAgreementChecked ? 'checkbox' : 'square-outline'}
                size={20}
                color={isAgreementChecked ? '#000' : '#D7D7D7'}
              />
            </TouchableOpacity>

            <Text className="flex-1 mt-1  text-sm font-body text-black leading-5">
              {welcomeStrings.agreementText}
            </Text>
          </HStack>
        </VStack>
        <GradientButton
          title={welcomeStrings.signIn}
          disabled={!isAgreementChecked}
          loading={
            isCheckingEmail ||
            isSendingPhoneCode ||
            isCheckingPhone ||
            isSendingLoginCode
          }
          style={{ marginTop: 20, width: '90%', alignSelf: 'center' }}
          onPress={handleSignInPress}
        />

        {/* Gradient Bar Image */}
      </ScrollView>

      <CountryPicker
        visible={show}
        onClose={() => setShow(false)}
        onSelect={country => {
          setCountryCode(country.phone);
          setSelectedCountry({
            code: country.code,
            phone: country.phone,
          });
          setShow(false);
        }}
      />
      <ToastComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  signInButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: '#E5E5E5',
    marginBottom: 15,
  },
});

export default Welcome;
