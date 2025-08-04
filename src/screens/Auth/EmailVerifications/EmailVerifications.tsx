import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Header } from '@/src/components';
import { images } from '@/src/assets';
import { GradientButton } from '@/src/components';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProps } from '@/src/types/allRoutes';

const EmailVerifications = () => {
  const { goBack } = useNavigation<AuthNavigationProps>();
  const email = 'kristinwatson@hotmail.com';

  const handleBackPress = () => {
    // Handle back navigation
    goBack();
  };

  const handleResendEmail = () => {
    // Handle resend email
    console.log('Resend email pressed');
  };

  const handleContinue = () => {
    // Handle continue action
    console.log('Continue pressed');
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
        <VStack className="flex-1 px-6 py-8 items-center justify-center">
          {/* Email Verification Icon */}
          <Box className="items-center mb-8">
            <Image
              source={images.email_verification_banner}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </Box>

          {/* Title */}
          <Text className="text-2xl font-heading text-black text-center mb-4">
            Check Your Inbox
          </Text>

          {/* Email Message */}
          <VStack className="items-center mb-8">
            <Text className="text-base font-body text-gray-600 text-center mb-2">
              We've sent a verification email to
            </Text>
            <Text className="text-base font-body text-blue-500 text-center mb-6">
              {email}
            </Text>

            {/* Instructions */}
            <VStack className="items-center space-y-2">
              <Text className="text-sm font-body text-gray-500 text-center">
                Click link in your email to verify account.
              </Text>
              <Text className="text-sm font-body text-gray-500 text-center">
                if you can't find the email check your spam folder.
              </Text>
            </VStack>
          </VStack>

          {/* Resend Email Button */}
          <TouchableOpacity onPress={handleResendEmail}>
            <Image
              source={images.resendEmail}
              style={{ width: 150, height: 100 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </VStack>
      </ScrollView>

      {/* Continue Button */}
      <Box className="px-6 pb-6">
        <GradientButton title="Continue" onPress={handleContinue} />
      </Box>
    </SafeAreaView>
  );
};

export default EmailVerifications;
