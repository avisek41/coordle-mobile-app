import React, { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { Box, Text, VStack } from '@gluestack-ui/themed';

type ToastType = 'error' | 'success' | 'warning' | 'info';
type ToastPosition = 'top' | 'bottom';

interface ToastData {
  type: ToastType;
  title?: string;
  message: string;

  duration?: number;
}

export const useSimpleToast = () => {
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  const showToast = (data: ToastData) => {
    setToastData(data);
    setIsVisible(true);

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    setTimeout(() => {
      hideToast();
    }, data.duration || 2000);
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      setToastData(null);
      fadeAnim.setValue(0);
      slideAnim.setValue(100);
    });
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border border-red-300 rounded-lg p-4',
          title: 'text-red-700 text-base font-bold mb-1',
          message: 'text-red-700 text-sm leading-5',
          defaultTitle: 'Error',
        };
      case 'success':
        return {
          container: 'bg-green-50 border border-green-300 rounded-lg p-4',
          title: 'text-green-700 text-base font-bold mb-1',
          message: 'text-green-700 text-sm leading-5',
          defaultTitle: 'Success',
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border border-yellow-300 rounded-lg p-4',
          title: 'text-yellow-700 text-base font-bold mb-1',
          message: 'text-yellow-700 text-sm leading-5',
          defaultTitle: 'Warning',
        };
      case 'info':
        return {
          container: 'bg-blue-50 border border-blue-300 rounded-lg p-4',
          title: 'text-blue-700 text-base font-bold mb-1',
          message: 'text-blue-700 text-sm leading-5',
          defaultTitle: 'Info',
        };
      default:
        return {
          container: 'bg-red-50 border border-red-300 rounded-lg p-4',
          title: 'text-red-700 text-base font-bold mb-1',
          message: 'text-red-700 text-sm leading-5',
          defaultTitle: 'Error',
        };
    }
  };

  const ToastComponent = () => {
    if (!isVisible || !toastData) {
      return null;
    }

    const stylesConfig = getStyles(toastData.type);
    const position = 'bottom';

    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          [position]: 50,
          zIndex: 1000,
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 100],
              }),
            },
          ],
        }}
      >
        <Box className={`w-full max-w-sm mx-auto ${stylesConfig.container}`}>
          <VStack>
            <Text className={stylesConfig.title}>
              {toastData.title || stylesConfig.defaultTitle}
            </Text>
            <Text className={stylesConfig.message}>{toastData.message}</Text>
          </VStack>
        </Box>
      </Animated.View>
    );
  };

  return {
    showToast,
    hideToast,
    ToastComponent,
  };
};
