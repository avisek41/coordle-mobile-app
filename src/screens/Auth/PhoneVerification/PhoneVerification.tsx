import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Header } from '@/src/components';
import { GradientButton } from '@/src/components';
import { phoneVerificationStrings } from './strings';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthNavigationProps, RootRouteProps } from '@/src/types/allRoutes';
import { useVerifyPhoneCodeMutation, useLoginMutation } from '@/src/services';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { Loader } from '@/src/components';
import { setItem } from '@/src/utils';
import { setCredentials } from '@/src/features';
import { useDispatch } from 'react-redux';

const PhoneVerification = () => {
  const { goBack, navigate } = useNavigation<AuthNavigationProps>();
  const { phoneNumber, isExistingUser } =
    useRoute<RootRouteProps<'PhoneVerification'>>().params;
  const [verificationCode, setVerificationCode] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);

  const inputRefs = useRef<Array<any>>([]);

  const [verifyPhoneCode, { isLoading: isVerifying }] =
    useVerifyPhoneCodeMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const { showToast, ToastComponent } = useSimpleToast();
  const dispatch = useDispatch();

  const handleBackPress = () => {
    goBack();
  };

  const handleContinue = async () => {
    // Check if verification code is complete
    if (verificationCode.length !== 6) {
      showToast({
        type: 'error',
        title: phoneVerificationStrings.incompleteCodeTitle,
        message: phoneVerificationStrings.incompleteCodeMessage,
        duration: 3000,
      });
      return;
    }

    try {
      if (isExistingUser) {
        // For existing users, directly call login API
        const loginResponse = await login({
          phoneNumber,
          verificationCode,
          loginMethod: 'phone',
        }).unwrap();

        if (loginResponse.success) {
          // Store the token
          const token = loginResponse.data.token;
          if (token) {
            dispatch(setCredentials({ token }));
            setItem('accessToken', token);
            setItem('isLoggedIn', 'true');
          }

          showToast({
            type: 'success',
            title: phoneVerificationStrings.verificationSuccessTitle,
            message: 'Login successful! Welcome back.',
            duration: 3000,
          });
          // TODO: Navigate to main app/home screen
          // navigate('MainApp');
        }
      } else {
        // For new users, verify the phone code first
        const verifyResponse = await verifyPhoneCode({
          phoneNumber,
          code: verificationCode,
        }).unwrap();
        console.log('verifyResponse', verifyResponse);

        if (verifyResponse.success) {
          // Store the token
          const token = verifyResponse.data.token;
          if (token) {
            // Store token in Redux store
            dispatch(setCredentials({ token }));
            // Store token in local storage
            setItem('accessToken', token);
          }

          // Check if profile setup is required based on verify response
          if (verifyResponse.data.isProfileSetup) {
            // New user with profile set up, navigate to login
            showToast({
              type: 'success',
              title: phoneVerificationStrings.verificationSuccessTitle,
              message: phoneVerificationStrings.loginSuccessMessage,
              duration: 3000,
            });
            setItem('isLoggedIn', 'true');
          } else {
            // Profile setup is required, navigate to ProfileSetup
            showToast({
              type: 'success',
              title: phoneVerificationStrings.verificationSuccessTitle,
              message: phoneVerificationStrings.verificationSuccessMessage,
              duration: 3000,
            });
            navigate('ProfileSetup');
          }
        }
      }
    } catch (error) {
      console.error('Operation failed:', error);
      showToast({
        type: 'error',
        title: phoneVerificationStrings.verificationErrorTitle,
        message: phoneVerificationStrings.verificationErrorMessage,
        duration: 3000,
      });
    }
  };

  const handleResendCode = () => {
    console.log('Resend code pressed');
  };

  const handleCodeDigitChange = (index: number, value: string) => {
    const newDigits = [...codeDigits];

    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    newDigits[index] = value;
    setCodeDigits(newDigits);
    setVerificationCode(newDigits.join(''));

    // Auto-focus to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !codeDigits[index] && index > 0) {
      // If current field is empty and backspace is pressed, go to previous field
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Show loader when API is loading
  if (isVerifying || isLoggingIn) {
    return <Loader />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Toast Component */}
      <ToastComponent />

      {/* Header */}
      <Header onBackPress={handleBackPress} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Content */}
        <VStack className="flex-1 px-6 py-8">
          {/* Title */}
          <Text className="text-2xl font-body text-black mb-2">
            {phoneVerificationStrings.title}
          </Text>

          {/* Instructions */}
          <Text className="text-sm font-body text-gray-500 mb-4">
            {phoneVerificationStrings.instructions}
          </Text>

          {/* Phone Number Display */}
          <Text className="text-base font-body text-black mb-6">
            {phoneNumber}
          </Text>

          {/* Verification Code Input */}
          <VStack className="space-y-2 mb-8">
            <Text className="text-sm font-body text-black">
              {phoneVerificationStrings.verificationCodeLabel}
            </Text>
            <HStack space="md" className="space-x-2 mt-2">
              {codeDigits.map((digit, index) => (
                <Input
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-lg w-12 h-12"
                  style={{
                    opacity: 1,
                  }}
                >
                  <InputField
                    ref={ref => {
                      if (ref) {
                        inputRefs.current[index] = ref;
                      }
                    }}
                    value={digit}
                    onChangeText={value => handleCodeDigitChange(index, value)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(index, nativeEvent.key)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="text-lg font-body text-center"
                    style={{
                      gap: 1,
                    }}
                  />
                </Input>
              ))}
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>

      {/* Continue Button */}
      <Box className="px-6 pb-6">
        <GradientButton
          title={phoneVerificationStrings.continueButton}
          onPress={handleContinue}
          loading={isVerifying || isLoggingIn}
        />

        {/* Resend Code Link */}
      </Box>
      <HStack className="justify-center mb-8 ">
        <Text className="text-sm font-body text-black">
          {phoneVerificationStrings.didntGetCode}
        </Text>
        <TouchableOpacity onPress={handleResendCode}>
          <Text className="text-primary-500 text-sm font-heading">
            {phoneVerificationStrings.resendCode}
          </Text>
        </TouchableOpacity>
      </HStack>
    </SafeAreaView>
  );
};

export default PhoneVerification;
