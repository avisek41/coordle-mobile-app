import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Announcement } from '@/src/services/announcementsApi';
import moment from 'moment';
import { ANNOUNCEMENTS_STRINGS } from './strings';
import {
  GradientAvatar,
  CustomActionSheet,
  ActionItem,
  CustomAlert,
  Loader,
} from '@/src/components';
import { useDeleteAnnouncementMutation } from '@/src/services';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';
import { MainNavigationProps } from '@/src/types/allRoutes';
import Clipboard from '@react-native-clipboard/clipboard';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';

interface AnnouncementListProps {
  announcements: Announcement[];
  navigation: MainNavigationProps;
  startDate: string;
  endDate: string;
  deleteAnnouncement: (args: { announcementId: string }) => any;
  isDeleting: boolean;
  onRetract: (announcementId: string) => void;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  navigation,
  startDate,
  endDate,
  deleteAnnouncement,
  isDeleting,
  onRetract,
}) => {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const { showToast, ToastComponent } = useSimpleToast();

  const handleMenuPress = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsActionSheetOpen(true);
  };

  const handleActionSheetClose = () => {
    setIsActionSheetOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleEdit = () => {
    if (selectedAnnouncement) {
      navigation.navigate('EditAnnouncement', {
        announcementId: selectedAnnouncement._id,
        message: selectedAnnouncement.message,
        startDate,
        endDate,
      });
    }
  };

  const handleRetract = () => {
    if (selectedAnnouncement) {
      onRetract(selectedAnnouncement._id);
      setIsActionSheetOpen(false);
      setSelectedAnnouncement(null);
    }
  };

  const handleCopy = () => {
    if (selectedAnnouncement) {
      Clipboard.setString(selectedAnnouncement.message);
      showToast({
        type: 'success',
        title: ANNOUNCEMENTS_STRINGS.COPY,
        message: ANNOUNCEMENTS_STRINGS.COPY_PLACEHOLDER,
        duration: 2000,
      });
      setIsActionSheetOpen(false);
      setSelectedAnnouncement(null);
    }
  };

  const getActionItems = (): ActionItem[] => [
    {
      id: 'edit',
      title: ANNOUNCEMENTS_STRINGS.EDIT,
      onPress: handleEdit,
    },

    {
      id: 'retract',
      title: ANNOUNCEMENTS_STRINGS.RETRACT,
      onPress: handleRetract,
      isDestructive: true,
    },
    {
      id: 'copy',
      title: ANNOUNCEMENTS_STRINGS.COPY,
      onPress: handleCopy,
    },
  ];

  const renderAnnouncementItem = (announcement: Announcement) => {
    return (
      <Box
        key={announcement._id}
        className="bg-gray-50 rounded-xl p-4 mb-3 mx-4 border border-gray-200"
        style={styles.card}
      >
        <VStack className="space-y-3">
          {/* Main message */}
          <Text className="text-lg font-heading text-gray-900">
            {announcement.message}
          </Text>

          <Box className="h-px bg-gray-200 my-2" />

          {/* User info row */}
          <HStack className="justify-between items-center">
            <HStack space="sm" className="items-center">
              {/* Avatar */}
              <GradientAvatar
                userName={announcement.createdBy.preferredName}
                size="small"
              />

              {/* Name and date */}
              <Text className="text-sm  font-body text-gray-600">
                {announcement.createdBy.preferredName}{' '}
                {moment(announcement.createdAt).format('MM/DD/YYYY')}
              </Text>
            </HStack>

            <TouchableOpacity onPress={() => handleMenuPress(announcement)}>
              <Ionicons
                name="ellipsis-vertical"
                size={24}
                color={Colors.black}
              />
            </TouchableOpacity>
          </HStack>
        </VStack>
      </Box>
    );
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {announcements.map(renderAnnouncementItem)}
      </ScrollView>

      {/* Action Sheet */}
      <CustomActionSheet
        isOpen={isActionSheetOpen}
        onClose={handleActionSheetClose}
        title={
          selectedAnnouncement
            ? moment(selectedAnnouncement.createdAt).format('MM/DD/YYYY')
            : ''
        }
        actions={getActionItems()}
      />

      {/* Toast Component */}
      <ToastComponent />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    backgroundColor: '#14B8A6', // teal color similar to the image
  },
  menuButton: {
    padding: 4,
  },
});

export default AnnouncementList;
