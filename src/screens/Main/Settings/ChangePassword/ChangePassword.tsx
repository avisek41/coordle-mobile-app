import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { GradientButton, Header } from '@/src/components';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { globalStyles } from '@/src/styles';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable } from '@/components/ui/pressable';
import { useChangePasswordMutation } from '@/src/services';
import { changePasswordStrings } from './strings';

const ChangePassword: React.FC = () => {
  const { goBack } = useNavigation<MainNavigationProps>();
  const { showToast, ToastComponent } = useSimpleToast();
  const [changePassword, { isLoading: isChangingPassword, error }] =
    useChangePasswordMutation();
  console.log('error', error);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleBack = () => {
    goBack();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      showToast({
        type: 'error',
        title: changePasswordStrings.errorTitle,
        message: changePasswordStrings.allFieldsRequired,
        duration: 3000,
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast({
        type: 'error',
        title: changePasswordStrings.errorTitle,
        message: changePasswordStrings.passwordsDoNotMatch,
        duration: 3000,
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      showToast({
        type: 'error',
        title: changePasswordStrings.errorTitle,
        message: changePasswordStrings.passwordTooShort,
        duration: 3000,
      });
      return;
    }

    try {
      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }).unwrap();

      showToast({
        type: 'success',
        title: changePasswordStrings.successTitle,
        message:
          response.message || changePasswordStrings.passwordChangedSuccessfully,
        duration: 3000,
      });

      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Navigate back after successful password change
      setTimeout(() => {
        goBack();
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        changePasswordStrings.changePasswordFailed;

      showToast({
        type: 'error',
        title: changePasswordStrings.errorTitle,
        message: errorMessage,
        duration: 3000,
      });
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ToastComponent />

      <VStack className="flex-1">
        {/* Header */}
        <Header
          title={changePasswordStrings.title}
          onBackPress={handleBack}
          showBackButton={true}
          titleStyle={{
            color: '#000',
          }}
          iconColor="#000"
        />

        {/* Form Content */}
        <VStack className="flex-1 px-6 py-8">
          {/* Current Password */}
          <VStack className="space-y-2 mb-6">
            <Text className="text-sm font-body text-black mb-1">
              {changePasswordStrings.currentPassword}
            </Text>
            <Box className="relative">
              <Input
                className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
                style={{ opacity: 1 }}
              >
                <InputField
                  placeholder={changePasswordStrings.currentPasswordPlaceholder}
                  value={formData.currentPassword}
                  onChangeText={value =>
                    updateFormData('currentPassword', value)
                  }
                  secureTextEntry={!showPasswords.current}
                  className="text-base font-body pr-12"
                  style={{ gap: 1 }}
                />
              </Input>
              <Pressable
                onPress={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-3"
              >
                <Ionicons
                  name={showPasswords.current ? 'eye-off' : 'eye'}
                  size={20}
                  color="#9CA3AF"
                />
              </Pressable>
            </Box>
          </VStack>

          {/* New Password */}
          <VStack className="space-y-2 mb-6">
            <Text className="text-sm font-body text-black mb-1">
              {changePasswordStrings.newPassword}
            </Text>
            <Box className="relative">
              <Input
                className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
                style={{ opacity: 1 }}
              >
                <InputField
                  placeholder={changePasswordStrings.newPasswordPlaceholder}
                  value={formData.newPassword}
                  onChangeText={value => updateFormData('newPassword', value)}
                  secureTextEntry={!showPasswords.new}
                  className="text-base font-body pr-12"
                  style={{ gap: 1 }}
                />
              </Input>
              <Pressable
                onPress={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-3"
              >
                <Ionicons
                  name={showPasswords.new ? 'eye-off' : 'eye'}
                  size={20}
                  color="#9CA3AF"
                />
              </Pressable>
            </Box>
          </VStack>

          {/* Confirm Password */}
          <VStack className="space-y-2 mb-8">
            <Text className="text-sm font-body text-black mb-1">
              {changePasswordStrings.confirmPassword}
            </Text>
            <Box className="relative">
              <Input
                className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
                style={{ opacity: 1 }}
              >
                <InputField
                  placeholder={changePasswordStrings.confirmPasswordPlaceholder}
                  value={formData.confirmPassword}
                  onChangeText={value =>
                    updateFormData('confirmPassword', value)
                  }
                  secureTextEntry={!showPasswords.confirm}
                  className="text-base font-body pr-12"
                  style={{ gap: 1 }}
                />
              </Input>
              <Pressable
                onPress={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-3"
              >
                <Ionicons
                  name={showPasswords.confirm ? 'eye-off' : 'eye'}
                  size={20}
                  color="#9CA3AF"
                />
              </Pressable>
            </Box>
          </VStack>

          <Box className="flex-1" />

          {/* Save Button */}
          <GradientButton
            title={changePasswordStrings.save}
            onPress={handleChangePassword}
            loading={isChangingPassword}
          />
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default ChangePassword;
