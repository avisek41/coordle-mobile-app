import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Header } from '@/src/components';
import { GradientButton } from '@/src/components';
import { createPasswordStrings } from './strings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProps } from '@/src/types/allRoutes';

const CreatePassword = () => {
  const { goBack, navigate } = useNavigation<AuthNavigationProps>();
  const [createPassword, setCreatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(true); // Track if user is existing

  const handleBackPress = () => {
    goBack();
  };

  const handleContinue = () => {
    navigate('AccountCreated');
  };

  const toggleCreatePasswordVisibility = () => {
    setShowCreatePassword(!showCreatePassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            {createPasswordStrings.title}
          </Text>

          {/* Instructions */}
          <Text className="text-sm font-body text-gray-500 mb-8">
            {createPasswordStrings.passwordInstructions}
          </Text>

          {/* Create Password Input */}
          <VStack className="space-y-2 mb-6">
            <Text className="text-sm font-body text-black">
              {createPasswordStrings.createPasswordLabel}
            </Text>
            <Box className="relative mt-2">
              <Input
                className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
                style={{
                  opacity: 1,
                }}
              >
                <InputField
                  placeholder={createPasswordStrings.createPasswordPlaceholder}
                  value={createPassword}
                  onChangeText={setCreatePassword}
                  secureTextEntry={!showCreatePassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="text-base font-body"
                  style={{
                    gap: 1,
                  }}
                />
              </Input>
              <TouchableOpacity
                onPress={toggleCreatePasswordVisibility}
                className="absolute right-3 top-3"
              >
                <Ionicons
                  name={showCreatePassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </Box>
          </VStack>

          {/* Confirm Password Input */}
          <VStack className="space-y-2 mb-8">
            <Text className="text-sm font-body text-black">
              {createPasswordStrings.confirmPasswordLabel}
            </Text>
            <Box className="relative mt-2">
              <Input
                className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
                style={{
                  opacity: 1,
                }}
              >
                <InputField
                  placeholder={createPasswordStrings.confirmPasswordPlaceholder}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="text-base font-body"
                  style={{
                    gap: 1,
                  }}
                />
              </Input>
              <TouchableOpacity
                onPress={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3"
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </Box>
          </VStack>

          {/* Forgot Password Link - Only show for existing users */}
          {isExistingUser && (
            <Box className="items-end mb-6">
              <TouchableOpacity
                onPress={() => {
                  navigate('ForgotPassword');
                }}
              >
                <Text className="text-red-500 text-sm font-body">
                  {createPasswordStrings.forgotPassword}
                </Text>
              </TouchableOpacity>
            </Box>
          )}

          {/* Terms and Privacy Checkbox */}
          <HStack space="sm" className="items-start mb-8">
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

            <Text className="flex-1 mt-1 text-sm font-body text-black leading-5">
              {createPasswordStrings.termsAgreement}
              <Text className="text-primary-500 underline">
                {createPasswordStrings.termsOfService}
              </Text>
              {createPasswordStrings.andText}
              <Text className="text-primary-500 underline">
                {createPasswordStrings.privacyPolicy}
              </Text>
            </Text>
          </HStack>
        </VStack>
      </ScrollView>

      {/* Continue Button */}
      <Box className="px-6 pb-6">
        <GradientButton
          title={createPasswordStrings.continueButton}
          onPress={handleContinue}
          disabled={!isAgreementChecked}
        />
      </Box>
    </SafeAreaView>
  );
};

export default CreatePassword;
