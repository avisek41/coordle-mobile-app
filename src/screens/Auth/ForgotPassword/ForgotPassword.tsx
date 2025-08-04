import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Header } from '@/src/components';
import { GradientButton } from '@/src/components';
import { forgotPasswordStrings } from './strings';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProps } from '@/src/types/allRoutes';

const ForgotPassword: React.FC = () => {
  const { goBack, navigate } = useNavigation<AuthNavigationProps>();
  const [email, setEmail] = useState('');

  const handleBackPress = () => {
    goBack();
  };

  const handleSubmit = () => {
    // Handle password reset logic here
    console.log('Password reset requested for:', email);
  };

  const handleSignIn = () => {
    navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <Header onBackPress={handleBackPress} showBackButton={true} />
        <VStack className="flex-1 px-6 py-8">
          {/* Title */}
          <Text className="text-2xl font-heading text-black mb-2 mt-4">
            {forgotPasswordStrings.title}
          </Text>

          {/* Subtitle */}
          <Text className="text-base font-body text-gray-600 mb-8">
            {forgotPasswordStrings.subtitle}
          </Text>

          {/* Email Input */}
          <VStack className="space-y-2 mb-8">
            <Text className="text-sm font-body text-black">
              {forgotPasswordStrings.emailLabel}
            </Text>
            <Box className="relative mt-2">
              <Input
                className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
                style={{
                  opacity: 1,
                }}
              >
                <InputField
                  placeholder={forgotPasswordStrings.emailPlaceholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="text-base font-body"
                  style={{
                    gap: 1,
                  }}
                />
              </Input>
            </Box>
          </VStack>

          {/* Submit Button */}
          <GradientButton
            title={forgotPasswordStrings.submitButton}
            onPress={handleSubmit}
          />

          {/* Sign In Link */}
          <VStack className="items-center mt-8">
            <HStack className="items-center space-x-1">
              <Text className="text-sm font-body text-gray-600">
                {forgotPasswordStrings.rememberPassword}
              </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text className="text-sm font-body text-primary-500">
                  {forgotPasswordStrings.signInLink}
                </Text>
              </TouchableOpacity>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
