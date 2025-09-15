import React from 'react';
import { Image, SafeAreaView, StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Header } from '@/src/components';
import { GradientButton } from '@/src/components';
import { POLL_STRINGS } from './strings';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { images } from '@/src/assets';

const Poll: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();

  const handleCreatePoll = () => {
    console.log('Create Poll pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={POLL_STRINGS.TITLE} />

      <VStack className="flex-1 px-6">
        <VStack className="flex-1 justify-center items-center">
          <Box className="mb-8">
            <Image
              source={images.poll}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </Box>

          <VStack className="items-center" space="md">
            <Text className="text-2xl font-heading text-gray-900 text-center">
              {POLL_STRINGS.NO_POLL_CREATED}
            </Text>
            <Text className="text-base font-body text-gray-500 text-center">
              {POLL_STRINGS.START_GATHERING}
            </Text>
          </VStack>
        </VStack>

        <Box className="w-full px-4 pb-6">
          <GradientButton
            title={POLL_STRINGS.CREATE_POLL}
            onPress={handleCreatePoll}
            colors={['#2E6F9E', '#51B1C0']}
            size="large"
          />
        </Box>
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default Poll;
