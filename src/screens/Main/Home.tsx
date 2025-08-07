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
import { useBasicFunctions, useSimpleToast } from '@/src/hooks';

import { Icon, EditIcon } from '@/components/ui/icon';
const Home = () => {
  const { user, setIsLoggedIn } = useAppContext();
  const { handleLogout } = useBasicFunctions();
  const { showToast, ToastComponent } = useSimpleToast();

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

        <VStack className="space-y-4 w-full max-w-sm">
          <Button
            className="bg-gray-600 px-6 py-3 rounded-lg mt-6"
            onPress={() => {
              handleLogout();
            }}
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
