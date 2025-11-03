import React from 'react';
import { Modal, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Text, VStack, Box, HStack } from '@/components/ui';

import GradientButton from './GradientButton';
import GradientText from './GradientText';
import { Colors } from '../configs/CustomTheme';

export interface CustomAlertProps {
  isOpen: boolean;
  icon?: ImageSourcePropType;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm: () => void;
  isCreatedAlert?: boolean;
  isDestructive?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  title,
  message,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
  isCreatedAlert = false,
  icon = '',
  isDestructive = false,
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Box className="flex-1 justify-center items-center bg-black/50">
        {isCreatedAlert ? (
        <Box className="bg-white rounded-2xl mx-6 p-6 w-full max-w-sm">
          {/* Title and Message */}
          <VStack className="mb-6">
            {title && <Text className="text-xl font-heading text-gray-900  mb-2 fontFamilyAvenir font-bold" >
              {title}
            </Text>}
            {message && <Text className={`text-sm font-body text-gray-500 leading-5 ${Colors.darkGray}`}>
              {message.replace(/\\n/g, '\n')}
            </Text>}
          </VStack>

          {/* Action Buttons */}
          <HStack className="flex-row gap-3 justify-between">

            {/* Cancel Button */}
            <TouchableOpacity
              className={`border border-primary-500 rounded-md bg-white items-center justify-center font-semibold`}
              style ={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.8}>
              <GradientText
                text= {cancelText}
                textStyle={styles.cancelButtonText}
            />
            </TouchableOpacity>

            {/* Confirm Button */}
            <GradientButton
              title={confirmText}
              onPress={handleConfirm}
              style={styles.confirmButton}
              gradientStyle={styles.gradientStyle}
              textStyle={styles.confirmButtonText}
            />
          </HStack>
        </Box>) : (
        <Box className="bg-white px-6 py-8 rounded-2xl mx-6 w-full max-w-sm shadow-lg">
         
         {/* Close Button */}
         <TouchableOpacity
           onPress={handleCancel}
           style={styles.closeButton}
           activeOpacity={0.7}
         >
           <Ionicons name="close" size={20} color="#6B7280" />
         </TouchableOpacity>

         {/* Content */}
         <VStack className="items-center">
           
           {/* Icon */}
           {icon && <Image
             source={icon as ImageSourcePropType}
             style={{
               width: 44,
               height: 38.13,
             }}
             className='fontFamilyAvenir mb-3'
             resizeMode='contain'
           />}

           {/* Title */}
           {title && <Text className="text-xl font-bold text-black leading-5 text-center mb-4 fontFamilyAvenir">
             {title}
           </Text>}

           {/* Subtitle */}
           {message && <Text className="text-sm text-gray-600 text-center leading-5 fontFamilyAvenir">
             {message}
           </Text>}
         </VStack>
       </Box>)}
      </Box>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    height: 40,
    width: '40%',
    flex: 0.5,
  },
  confirmButton: {
    marginTop: 0,
    height: 40,
    width: '40%',
    flex: 0.5,
  },
  gradientStyle: {
    height: 40,
    borderRadius: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'AvenirLTPro-Medium',
  },
  confirmButtonText: {
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  fontFamilyBold: {
    fontFamily: 'AvenirLTPro-Bold',
  },
  fontFamilyAvenir: {
    fontFamily: 'AvenirLTProRoman',
  },
});

export default CustomAlert;
