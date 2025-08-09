import React, { useState } from 'react';
import { SafeAreaView, Switch } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Header } from '@/src/components';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { globalStyles } from '@/src/styles';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { Colors } from '@/src/configs/CustomTheme';

interface NotificationToggleProps {
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  title,
  value,
  onValueChange,
}) => (
  <Box className="bg-gray-50 rounded-lg px-4 py-4 mx-6 mb-4 border border-gray-200">
    <HStack className="items-center justify-between">
      <Text className="text-base font-body text-black">{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: Colors.primary }}
        thumbColor={value ? '#ffffff' : '#ffffff'}
        ios_backgroundColor="#D1D5DB"
      />
    </HStack>
  </Box>
);

const Notifications: React.FC = () => {
  const { goBack } = useNavigation<MainNavigationProps>();
  const { showToast, ToastComponent } = useSimpleToast();

  const [notifications, setNotifications] = useState({
    activity: true,
    travel: true,
    foodOrder: false,
    poll: true,
    announcement: true,
    chat: true,
  });

  const handleBack = () => {
    goBack();
  };

  const updateNotificationSetting = (
    key: keyof typeof notifications,
    value: boolean,
  ) => {
    setNotifications(prev => ({ ...prev, [key]: value }));

    // Show toast for user feedback
    showToast({
      type: 'success',
      title: 'Settings Updated',
      message: `${key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())} ${
        value ? 'enabled' : 'disabled'
      }`,
      duration: 2000,
    });
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ToastComponent />

      <VStack className="flex-1">
        {/* Header */}
        <Header
          title="Notifications"
          onBackPress={handleBack}
          showBackButton={true}
          titleStyle={{
            color: '#000',
          }}
          iconColor="#000"
        />

        {/* Notification Settings */}
        <VStack className="flex-1 pt-6">
          <NotificationToggle
            title="Activity"
            value={notifications.activity}
            onValueChange={value =>
              updateNotificationSetting('activity', value)
            }
          />

          <NotificationToggle
            title="Travel"
            value={notifications.travel}
            onValueChange={value => updateNotificationSetting('travel', value)}
          />

          <NotificationToggle
            title="Food Order"
            value={notifications.foodOrder}
            onValueChange={value =>
              updateNotificationSetting('foodOrder', value)
            }
          />

          <NotificationToggle
            title="Poll"
            value={notifications.poll}
            onValueChange={value => updateNotificationSetting('poll', value)}
          />

          <NotificationToggle
            title="Announcement"
            value={notifications.announcement}
            onValueChange={value =>
              updateNotificationSetting('announcement', value)
            }
          />

          <NotificationToggle
            title="Chat"
            value={notifications.chat}
            onValueChange={value => updateNotificationSetting('chat', value)}
          />
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

export default Notifications;
