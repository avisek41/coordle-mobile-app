import React from 'react';
import { Box, Text, VStack } from '@gluestack-ui/themed';

type MessageType = 'error' | 'success' | 'warning' | 'info';

interface ToastMessageProps {
  type: MessageType;
  title?: string;
  message: string;
  className?: string;
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  type,
  title,
  message,
  className = '',
}) => {
  const getStyles = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border border-red-300 rounded-lg p-4 my-2',
          title: 'text-red-700 text-base font-bold mb-1',
          message: 'text-red-700 text-sm leading-5',
          defaultTitle: 'Error',
        };
      case 'success':
        return {
          container: 'bg-green-50 border border-green-300 rounded-lg p-4 my-2',
          title: 'text-green-700 text-base font-bold mb-1',
          message: 'text-green-700 text-sm leading-5',
          defaultTitle: 'Success',
        };
      case 'warning':
        return {
          container:
            'bg-yellow-50 border border-yellow-300 rounded-lg p-4 my-2',
          title: 'text-yellow-700 text-base font-bold mb-1',
          message: 'text-yellow-700 text-sm leading-5',
          defaultTitle: 'Warning',
        };
      case 'info':
        return {
          container: 'bg-blue-50 border border-blue-300 rounded-lg p-4 my-2',
          title: 'text-blue-700 text-base font-bold mb-1',
          message: 'text-blue-700 text-sm leading-5',
          defaultTitle: 'Info',
        };
      default:
        return {
          container: 'bg-red-50 border border-red-300 rounded-lg p-4 my-2',
          title: 'text-red-700 text-base font-bold mb-1',
          message: 'text-red-700 text-sm leading-5',
          defaultTitle: 'Error',
        };
    }
  };

  const stylesConfig = getStyles();

  return (
    <Box
      className={`w-full max-w-sm mx-auto ${stylesConfig.container} ${className}`}
    >
      <VStack space="xs">
        <Text className={stylesConfig.title}>
          {title || stylesConfig.defaultTitle}
        </Text>
        <Text className={stylesConfig.message}>{message}</Text>
      </VStack>
    </Box>
  );
};

export default ToastMessage;
