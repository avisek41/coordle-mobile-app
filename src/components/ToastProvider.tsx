import React, { createContext, useContext, useState, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import ToastMessage from './ToastMessage';

type ToastType = 'error' | 'success' | 'warning' | 'info';
type ToastPosition = 'top' | 'bottom';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  position: ToastPosition;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };

    setToasts(prev => [...prev, newToast]);

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

    // Auto dismiss after 2 seconds
    setTimeout(() => {
      hideToast(id);
    }, 2000);
  };

  const hideToast = (id: string) => {
    // Animate out
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
      setToasts(prev => prev.filter(toast => toast.id !== id));
      fadeAnim.setValue(0);
      slideAnim.setValue(100);
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toasts.map(toast => (
        <Animated.View
          key={toast.id}
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            [toast.position]: 50,
            zIndex: 1000,
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: toast.position === 'top' ? [0, -100] : [0, 100],
                }),
              },
            ],
          }}
        >
          <ToastMessage
            type={toast.type}
            title={toast.title}
            message={toast.message}
            className="shadow-lg"
          />
        </Animated.View>
      ))}
    </ToastContext.Provider>
  );
};
