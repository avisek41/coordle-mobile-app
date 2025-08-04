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
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProps } from '@/src/types/allRoutes';

const PhoneVerification = () => {
  const { goBack, navigate } = useNavigation<AuthNavigationProps>();
  const [verificationCode, setVerificationCode] = useState('367660');
  const [codeDigits, setCodeDigits] = useState(['3', '6', '7', '6', '6', '0']);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const inputRefs = useRef<Array<any>>([]);

  const handleBackPress = () => {
    goBack();
  };

  const handleContinue = () => {
    navigate('CreatePassword');
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

  return (
    <SafeAreaView className="flex-1 bg-white">
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
            {phoneVerificationStrings.phoneNumber}
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
