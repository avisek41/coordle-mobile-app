import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Header } from '@/src/components';
import { GradientButton } from '@/src/components';
import { loginStrings } from './strings';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProps } from '@/src/types/allRoutes';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Login: React.FC = () => {
  const { goBack, navigate } = useNavigation<AuthNavigationProps>();
  const [email, setEmail] = useState('kristinwatson@hotmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleBackPress = () => {
    goBack();
  };

  const handleContinue = () => {
    // Handle login logic here
    console.log('Login attempt with:', email, password);
  };

  const handleForgotPassword = () => {
    navigate('ForgotPassword');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <Header onBackPress={handleBackPress} showBackButton={true} />
        <VStack className="flex-1 px-4 py-8">
          {/* Title */}
          <Text className="text-2xl font-heading text-black mb-2 mt-4">
            {loginStrings.title}
          </Text>

          {/* Subtitle */}
          <Text className="text-base font-body text-gray-600 mb-8">
            {loginStrings.subtitle}
          </Text>

          {/* Email Input */}
          <VStack className="space-y-2 mb-6">
            <Text className="text-sm font-body text-black">
              {loginStrings.emailLabel}
            </Text>
            <Box className="relative mt-2">
              <Input
                className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
                style={{
                  opacity: 1,
                }}
              >
                <InputField
                  placeholder={loginStrings.emailPlaceholder}
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

          {/* Password Input */}
          <VStack className="space-y-2 mb-4">
            <Text className="text-sm font-body text-black">
              {loginStrings.passwordLabel}
            </Text>
            <Box className="relative mt-2">
              <Input
                className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
                style={{
                  opacity: 1,
                }}
              >
                <InputField
                  placeholder={loginStrings.passwordPlaceholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="text-base font-body"
                  style={{
                    gap: 1,
                  }}
                />
              </Input>
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                className="absolute right-3 top-0 bottom-0 justify-center"
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </Box>
          </VStack>

          {/* Forgot Password Link */}
          <VStack className="items-end mb-8">
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text className="text-sm font-body text-red-500">
                {loginStrings.forgotPassword}
              </Text>
            </TouchableOpacity>
          </VStack>

          {/* Continue Button */}
          <GradientButton
            title={loginStrings.continueButton}
            onPress={handleContinue}
          />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
