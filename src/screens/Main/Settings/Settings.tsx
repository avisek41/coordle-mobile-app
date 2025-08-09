import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Header } from '@/src/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { globalStyles } from '@/src/styles';

interface SettingsItemProps {
  title: string;
  onPress: () => void;
  icon?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  onPress,
  icon,
}) => (
  <Pressable onPress={onPress} className="mb-4">
    <Box className="bg-gray-50 rounded-lg px-4 py-4 mx-6">
      <HStack className="items-center justify-between">
        <Text className="text-base font-body text-black">{title}</Text>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </HStack>
    </Box>
  </Pressable>
);

const Settings: React.FC = () => {
  const { navigate, goBack } = useNavigation<MainNavigationProps>();

  const handleBack = () => {
    goBack();
  };

  const handleChangePassword = () => {
    navigate('ChangePassword');
  };

  const handleNotifications = () => {
    navigate('Notifications');
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <VStack className="flex-1">
        {/* Header */}
        <Header
          title="Settings"
          onBackPress={handleBack}
          showBackButton={true}
          titleStyle={{
            color: '#000',
          }}
          iconColor="#000"
        />

        {/* Settings Items */}
        <VStack className="flex-1 pt-6">
          <SettingsItem
            title="Change Password"
            onPress={handleChangePassword}
          />

          <SettingsItem title="Notifications" onPress={handleNotifications} />
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default Settings;
