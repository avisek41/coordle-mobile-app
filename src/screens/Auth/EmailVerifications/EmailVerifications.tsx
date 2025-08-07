import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Header, Loader } from '@/src/components';
import { images } from '@/src/assets';
import { GradientButton } from '@/src/components';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthNavigationProps, AuthStackParams } from '@/src/types/allRoutes';
import { emailVerificationStrings } from './strings';
import {
  useSendEmailVerificationMutation,
  useCheckEmailStatusMutation,
} from '@/src/services';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';

const EmailVerifications = () => {
  const route = useRoute<RouteProp<AuthStackParams, 'EmailVerifications'>>();
  const { goBack, navigate } = useNavigation<AuthNavigationProps>();
  const { email } = route.params;

  const [sendEmailVerification, { isLoading, error, reset }] =
    useSendEmailVerificationMutation();

  const [checkEmailStatus, { isLoading: isCheckingEmail }] =
    useCheckEmailStatusMutation();

  const { showToast, ToastComponent } = useSimpleToast();

  // Automatically send email verification when component mounts
  useEffect(() => {
    const sendVerificationEmail = async () => {
      try {
        await sendEmailVerification({ email }).unwrap();
        console.log('Email verification sent successfully');
      } catch (error) {
        console.error('Failed to send email verification:', error);
      }
    };

    sendVerificationEmail();
    return () => {
      reset();
    };
  }, [email]); // Empty dependency array to always reset and call on mount

  const handleBackPress = () => {
    // Handle back navigation
    goBack();
  };

  const handleResendEmail = async () => {
    // Handle resend email
    try {
      await sendEmailVerification({ email }).unwrap();
      console.log('Email verification resent successfully');
      showToast({
        type: 'success',
        title: emailVerificationStrings.resendSuccessTitle,
        message: emailVerificationStrings.resendSuccessMessage,
        duration: 3000,
      });
    } catch (error) {
      console.log('Failed to resend email verification:', error);
      showToast({
        type: 'error',
        title: emailVerificationStrings.resendErrorTitle,
        message: emailVerificationStrings.resendErrorMessage,
        duration: 3000,
      });
    } finally {
      reset();
    }
  };

  const handleContinue = async () => {
    // Handle continue action
    try {
      const response = await checkEmailStatus(email).unwrap();

      if (response.data.action === 'login') {
        // Email is verified, navigate to login
        navigate('Login');
      } else {
        // Email is not verified, show toast
        showToast({
          type: 'error',
          title: emailVerificationStrings.emailNotVerifiedTitle,
          message: emailVerificationStrings.emailNotVerifiedMessage,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to check email status:', error);
      showToast({
        type: 'error',
        title: emailVerificationStrings.resendErrorTitle,
        message: emailVerificationStrings.resendErrorMessage,
        duration: 3000,
      });
    }
  };

  // Show loader when API is loading
  if (isLoading) {
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
            {emailVerificationStrings.title}
          </Text>

          {/* Email Message */}
          <VStack className="items-center mb-8">
            <Text className="text-base font-body text-gray-600 text-center mb-2">
              {emailVerificationStrings.emailSentMessage}
            </Text>
            <Text className="text-base font-body text-blue-500 text-center mb-6">
              {email}
            </Text>

            {/* Instructions */}
            <VStack className="items-center space-y-2">
              <Text className="text-sm font-body text-gray-500 text-center">
                {emailVerificationStrings.clickLinkInstruction}
              </Text>
              <Text className="text-sm font-body text-gray-500 text-center">
                {emailVerificationStrings.spamFolderInstruction}
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
        <GradientButton
          title={emailVerificationStrings.continueButton}
          onPress={handleContinue}
          loading={isCheckingEmail}
        />
      </Box>
    </SafeAreaView>
  );
};

export default EmailVerifications;
