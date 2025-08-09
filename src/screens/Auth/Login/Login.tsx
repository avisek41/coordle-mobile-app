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
import { useLoginMutation } from '@/src/services';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { Loader } from '@/src/components';
import { setItem } from '@/src/utils';
import { setCredentials } from '@/src/features';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useBasicFunctions } from '@/src/hooks';

const Login: React.FC = () => {
  const { goBack, navigate } = useNavigation<AuthNavigationProps>();
  const [email, setEmail] = useState('avisek@york.ie');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useBasicFunctions();
  const [login, { isLoading }] = useLoginMutation();
  const { showToast, ToastComponent } = useSimpleToast();
  const dispatch = useDispatch();

  const handleBackPress = () => {
    goBack();
  };

  const handleContinue = async () => {
    // Validate inputs
    if (!email || !password) {
      showToast({
        type: 'error',
        title: loginStrings.loginErrorTitle,
        message: 'Please fill in all fields.',
        duration: 3000,
      });
      return;
    }

    try {
      const response = await login({
        email,
        password,
        loginMethod: 'email',
      }).unwrap();

      if (response.success) {
        // Store the access token
        const accessToken = response.data.token;
        if (accessToken) {
          // Store token in Redux store
          dispatch(setCredentials({ token: accessToken }));
          // Store token in local storage
          setItem('accessToken', accessToken);
          setItem('isLoggedIn', 'true');
        }

        // Check if profile setup is required
        if (response?.data?.isProfileSetup) {
          // Profile is already set up, show success message
          handleLogin();
          // TODO: Navigate to main app or handle authenticated state
        } else {
          // Profile setup is required, navigate to ProfileSetup
          showToast({
            type: 'info',
            title: loginStrings.profileSetupRequiredTitle,
            message: loginStrings.profileSetupRequiredMessage,
            duration: 3000,
          });
          navigate('ProfileSetup');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      showToast({
        type: 'error',
        title: loginStrings.loginErrorTitle,
        message: loginStrings.loginErrorMessage,
        duration: 3000,
      });
    }
  };

  const handleForgotPassword = () => {
    navigate('ForgotPassword');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loader when API is loading
  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Toast Component */}
      <ToastComponent />

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
            loading={isLoading}
          />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
