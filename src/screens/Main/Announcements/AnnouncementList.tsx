import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
} from '@/src/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';
import { MainNavigationProps } from '@/src/types/allRoutes';

interface AnnouncementListProps {
  announcements: Announcement[];
  navigation: MainNavigationProps;
  startDate: string;
  endDate: string;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  navigation,
  startDate,
  endDate,
}) => {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isRetractAlertOpen, setIsRetractAlertOpen] = useState(false);

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
    setIsRetractAlertOpen(true);
  };

  const handleRetractConfirm = () => {
    // TODO: Implement retract functionality
    setIsRetractAlertOpen(false);
    setIsActionSheetOpen(false);
    setSelectedAnnouncement(null);
    // Show success message
    Alert.alert('Success', ANNOUNCEMENTS_STRINGS.RETRACT_SUCCESS);
  };

  const handleRetractCancel = () => {
    setIsRetractAlertOpen(false);
  };

  const handleCopy = () => {
    // TODO: Implement copy functionality
    Alert.alert(
      ANNOUNCEMENTS_STRINGS.COPY,
      ANNOUNCEMENTS_STRINGS.COPY_PLACEHOLDER,
    );
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
