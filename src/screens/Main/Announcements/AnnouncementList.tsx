import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Announcement } from '@/src/services/announcementsApi';
import moment from 'moment';
import { GradientAvatar } from '@/src/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';

interface AnnouncementListProps {
  announcements: Announcement[];
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
}) => {
  const renderAnnouncementItem = (announcement: Announcement) => {
    const getInitials = (name: string) => {
      return name.charAt(0).toUpperCase();
    };

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

            <TouchableOpacity>
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
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {announcements.map(renderAnnouncementItem)}
    </ScrollView>
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
