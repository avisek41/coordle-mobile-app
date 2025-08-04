import React from 'react';
import { SafeAreaView, ScrollView, Image } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Header } from '@/src/components';
import { images } from '@/src/assets';
import { GradientButton } from '@/src/components';
import { accountCreatedStrings } from './strings';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProps } from '@/src/types/allRoutes';

const AccountCreated = () => {
  const { goBack } = useNavigation<AuthNavigationProps>();

  const handleBackPress = () => {
    goBack();
  };

  const handleBackToSignIn = () => {
    console.log(accountCreatedStrings.backToSignInPressed);
    // Navigate back to sign in or home screen
    goBack();
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
          {/* Success Icon */}
          <Box className="items-center mb-8">
            <Image
              source={images.account_created}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </Box>

          {/* Title */}
          <Text className="text-2xl font-heading text-black text-center mb-4">
            {accountCreatedStrings.title}
          </Text>

          {/* Message */}
          <Text className="text-base font-body text-gray-600 text-center mb-8">
            {accountCreatedStrings.message}
          </Text>
        </VStack>
      </ScrollView>

      {/* Back to Sign In Button */}
      <Box className="px-6 pb-6">
        <GradientButton
          title={accountCreatedStrings.backToSignInButton}
          onPress={handleBackToSignIn}
        />
      </Box>
    </SafeAreaView>
  );
};

export default AccountCreated;
