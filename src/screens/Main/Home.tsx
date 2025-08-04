import React from 'react';
import {
  Box,
  Text,
  Button,
  ButtonText,
  HStack,
  VStack,
} from '@gluestack-ui/themed';
import { useAppContext } from '@/src/Context';
import { useSimpleToast } from '@/src/hooks';

import { Icon, EditIcon } from '@/components/ui/icon';
const Home = () => {
  const { user, setIsLoggedIn } = useAppContext();
  const { showToast, ToastComponent } = useSimpleToast();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleShowToast = (
    type: 'error' | 'success' | 'warning' | 'info',
    position: 'top' | 'bottom',
  ) => {
    showToast({
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Message`,
      message: `This is a ${type} toast message from ${position} position!`,
    });
  };

  return (
    <Box className="flex-1 bg-white px-4">
      <VStack className="flex-1 justify-center items-center space-y-4">
        {/* SVG Icons Demo Section */}
        <Icon as={EditIcon} size="md" />
        <VStack className="space-y-4 w-full max-w-sm">
          <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Toast Notification Demo
          </Text>

          {/* Success Button */}
          <Button
            className="bg-green-600 px-6 py-3 rounded-lg"
            onPress={() => handleShowToast('success', 'top')}
          >
            <ButtonText className="text-white font-medium">
              Success Toast
            </ButtonText>
          </Button>

          {/* Info Button */}
          <Button
            className="bg-blue-600 px-6 py-3 rounded-lg"
            onPress={() => handleShowToast('info', 'top')}
          >
            <ButtonText className="text-white font-medium">
              Info Toast
            </ButtonText>
          </Button>

          {/* Warning Button */}
          <Button
            className="bg-yellow-600 px-6 py-3 rounded-lg"
            onPress={() => handleShowToast('warning', 'bottom')}
          >
            <ButtonText className="text-white font-medium">
              Warning Toast
            </ButtonText>
          </Button>

          {/* Error Button */}
          <Button
            className="bg-red-600 px-6 py-3 rounded-lg"
            onPress={() => handleShowToast('error', 'bottom')}
          >
            <ButtonText className="text-white font-medium">
              Error Toast
            </ButtonText>
          </Button>

          <Button
            className="bg-gray-600 px-6 py-3 rounded-lg mt-6"
            onPress={handleLogout}
          >
            <ButtonText className="text-white font-medium">Logout</ButtonText>
          </Button>
        </VStack>
      </VStack>
      <ToastComponent />
    </Box>
  );
};

export default Home;
