import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { ANNOUNCEMENTS_STRINGS } from './strings';
import { Header, Loader, NoData, CustomAlert } from '@/src/components';
import {
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetAnnouncementsQuery,
} from '@/src/services';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import InputBox from './InputBox';
import AnnouncementList from './AnnouncementList';
import { useAppSelector } from '@/src/hooks';

const Announcements = () => {
  const { userRole } = useAppSelector(state => state?.auth);
  const navigation = useNavigation<MainNavigationProps>();
  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();
  const route = useRoute<MainRouteProps<'Announcements'>>();
  const { tripId, tripName, startDate, endDate } = route.params;
  const [message, setMessage] = useState('');
  const [isRetractAlertOpen, setIsRetractAlertOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<
    string | null
  >(null);
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

  const handleRetract = (announcementId: string) => {
    setSelectedAnnouncementId(announcementId);
    setIsRetractAlertOpen(true);
  };

  const handleRetractConfirm = async () => {
    if (!selectedAnnouncementId) return;

    try {
      await deleteAnnouncement({
        announcementId: selectedAnnouncementId,
      }).unwrap();

      showToast({
        type: 'success',
        message: ANNOUNCEMENTS_STRINGS.DELETE_SUCCESS,
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error?.data?.message || 'Failed to delete announcement',
      });
    } finally {
      setIsRetractAlertOpen(false);
      setSelectedAnnouncementId(null);
    }
  };

  const handleRetractCancel = () => {
    setIsRetractAlertOpen(false);
    setSelectedAnnouncementId(null);
  };

  if (isLoadingAnnouncements || isDeleting) {
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
            navigation={navigation}
            startDate={startDate}
            endDate={endDate}
            isDeleting={isDeleting}
            deleteAnnouncement={deleteAnnouncement}
            onRetract={handleRetract}
          />
        ) : (
          <NoData
            isIcon
            title={ANNOUNCEMENTS_STRINGS.NO_ANNOUNCEMENT_YET}
            iconName="megaphone-outline"
            description={ANNOUNCEMENTS_STRINGS.SHARE_ANNOUNCEMENTS}
          />
        )}

        {userRole !== 'traveller' && (
          <InputBox
            value={message}
            onChangeText={setMessage}
            onSend={handleSendMessage}
            placeholder={ANNOUNCEMENTS_STRINGS.MESSAGE_PLACEHOLDER}
            isLoading={isLoading}
          />
        )}
      </VStack>

      {isRetractAlertOpen && (
        <CustomAlert
          isOpen={isRetractAlertOpen}
          title={ANNOUNCEMENTS_STRINGS.RETRACT_CONFIRMATION_TITLE}
          message={ANNOUNCEMENTS_STRINGS.RETRACT_CONFIRMATION_MESSAGE}
          cancelText={ANNOUNCEMENTS_STRINGS.CANCEL}
          confirmText={ANNOUNCEMENTS_STRINGS.RETRACT}
          onCancel={handleRetractCancel}
          onConfirm={handleRetractConfirm}
          isDestructive={true}
        />
      )}
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
