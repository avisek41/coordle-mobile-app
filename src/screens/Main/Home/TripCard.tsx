import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Trip } from '@/src/types/trip';

interface TripCardProps {
  trip: Trip;
  onPress?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    return `${startDate} - ${endDate}`;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Box className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Image
          source={
            trip.cover_image?.url
              ? { uri: trip.cover_image.url }
              : require('@/src/assets/Images/trip.png')
          }
          style={{
            width: '100%',
            height: 120,
            resizeMode: 'cover',
          }}
        />
        <Box className="p-4">
          <Text className="text-lg font-heading text-gray-800 mb-1">
            {trip.name}
          </Text>
          <Box className="flex-row justify-between items-center">
            <Text className="text-sm font-body text-gray-500">
              {formatDateRange(trip.display_start, trip.display_end)}
            </Text>
            <Text className="text-sm font-body text-gray-500">
              {trip.duration}
            </Text>
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default TripCard;
