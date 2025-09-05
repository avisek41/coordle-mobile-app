import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { ANNOUNCEMENTS_STRINGS } from './strings';
import { Header, Loader, NoData } from '@/src/components';
import {
  useCreateAnnouncementMutation,
  useGetAnnouncementsQuery,
} from '@/src/services';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import InputBox from './InputBox';
import AnnouncementList from './AnnouncementList';

const Announcements = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'Announcements'>>();
  const { tripId, tripName, startDate, endDate } = route.params;
  const [message, setMessage] = useState('');
  const { showToast, ToastComponent } = useSimpleToast();

  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();
  const { data: announcementsData, isLoading: isLoadingAnnouncements } =
    useGetAnnouncementsQuery({
      tripId,
      page: 1,
      limit: 10,
    });

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await createAnnouncement({
        tripId,
        announcement: {
          message: message.trim(),
        },
      }).unwrap();

      setMessage('');
      showToast({
        type: 'success',
        message: 'Announcement posted successfully',
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error?.data?.message || 'Failed to post announcement',
      });
    }
  };

  if (isLoadingAnnouncements) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ToastComponent />
      <VStack className="flex-1 bg-white">
        {/* Header */}
        <Header
          title={ANNOUNCEMENTS_STRINGS.TITLE}
          onBackPress={() => navigation.goBack()}
        />

        {/* Trip Info */}
        <HStack className="justify-between items-center px-4 pb-4">
          <Text className="text-lg font-heading text-gray-900">{tripName}</Text>
          <Text className="text-sm font-body text-gray-500">
            {startDate} - {endDate}
          </Text>
        </HStack>
        {(announcementsData?.data?.announcements?.length ?? 0) > 0 ? (
          <AnnouncementList
            announcements={announcementsData?.data?.announcements || []}
          />
        ) : (
          <NoData
            isIcon
            title={ANNOUNCEMENTS_STRINGS.NO_ANNOUNCEMENT_YET}
            iconName="megaphone-outline"
            description={ANNOUNCEMENTS_STRINGS.SHARE_ANNOUNCEMENTS}
          />
        )}

        {/* Message Input */}
        <InputBox
          value={message}
          onChangeText={setMessage}
          onSend={handleSendMessage}
          placeholder={ANNOUNCEMENTS_STRINGS.MESSAGE_PLACEHOLDER}
          isLoading={isLoading}
        />
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default Announcements;
