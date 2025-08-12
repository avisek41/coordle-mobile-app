import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Trip } from '@/src/types/trip';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from '@/src/hooks';

interface TripCardProps {
  trip: Trip;
  onPress?: () => void;

  showBadges?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  onPress,
  showBadges = false,
}) => {
  const { userId } = useAppSelector(state => state?.auth);

  const formatDateRange = (startDate: string, endDate: string) => {
    return `${startDate} - ${endDate}`;
  };

  const isOwner = trip.owner_id === userId;
  const userCount = trip.users?.length || 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Box className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">
        <Box>
          <Image
            source={
              trip.cover_image?.url
                ? { uri: trip.cover_image.url }
                : require('@/src/assets/Images/trip.png')
            }
            style={styles.image}
          />

          {/* Badges - Only show if showBadges is true */}
          {showBadges && (
            <Box className="absolute top-8 left-5 right-7 flex-row justify-between z-10">
              {/* Owner Badge */}
              {isOwner && (
                <Box className="bg-white px-3 py-1 rounded-full">
                  <Text className="text-primary-500 text-xs font-heading">
                    Owner
                  </Text>
                </Box>
              )}

              {/* Group Trip Badge */}
              {userCount > 0 && (
                <Box className="bg-white px-3 py-1 rounded-full">
                  <Text className="text-red-5000 text-xs font-heading">
                    Group Trip
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Box className="p-4">
          <Text className="text-lg font-heading text-gray-800 mb-1">
            {trip.name}
          </Text>
          <Box
            className={`flex-row ${
              !showBadges ? 'justify-between' : null
            } items-center`}
          >
            <Text className="text-sm font-body text-gray-500">
              {formatDateRange(trip.display_start, trip.display_end)}
            </Text>
            <Text
              className={`text-sm font-body ${
                showBadges ? 'ml-2' : null
              } text-gray-500 ${showBadges ? 'flex-1' : null}`}
            >
              {trip.duration}
            </Text>

            {/* People Count - Only show if showBadges is true */}
            {showBadges && (
              <Box className="mt-2 flex-row justify-end items-center">
                <Ionicons name="people" size={16} color="#51B1C0" />
                <Text className="text-sm font-body text-blue-400 ml-1">
                  {userCount} {userCount === 1 ? 'Person' : 'People'}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    padding: 10,
  },
});
