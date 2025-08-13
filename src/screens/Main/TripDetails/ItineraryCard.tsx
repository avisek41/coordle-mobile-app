import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { GradientButton } from '@/src/components';
import { Trip } from '@/src/types/trip';
import { tripDetailsStrings } from './strings';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ItineraryCardProps {
  trip: Trip;
  isOwner: boolean;
  onImportPress: () => void;
  isPast?: boolean;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({
  trip,
  isOwner,
  onImportPress,
  isPast = false,
}) => {
  return (
    <Box className="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <HStack className="justify-between items-center mb-4">
        <HStack className="items-center" space="sm">
          <Ionicons name="map-outline" size={20} color="#EF4444" />
          <Text className="text-lg font-body text-gray-800">
            {tripDetailsStrings.itinerary}
          </Text>
        </HStack>

        {isOwner && (
          <HStack className="items-center">
            <Text className="text-red-500 font-heading text-sm">
              {tripDetailsStrings.youAreOwner}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </HStack>
        )}
      </HStack>

      <HStack space="xl" className="mb-4 justify-between">
        <HStack className="items-center" space="sm">
          <Ionicons name="airplane-outline" size={16} color="#51B1C0" />
          <HStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              {tripDetailsStrings.travel} :
            </Text>
            <Text className="text-sm font-heading text-gray-600">
              {trip.travel_count || 0}
            </Text>
          </HStack>
        </HStack>

        <HStack className="items-center" space="sm">
          <Ionicons name="bed-outline" size={16} color="#51B1C0" />
          <HStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              {tripDetailsStrings.lodging} :
            </Text>
            <Text className="text-sm font-heading text-gray-600">
              {trip.lodging_count || 0}
            </Text>
          </HStack>
        </HStack>

        <HStack className="items-center" space="sm">
          <Ionicons name="trending-up-outline" size={16} color="#51B1C0" />
          <HStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              {tripDetailsStrings.activity} :
            </Text>
            <Text className="text-sm font-heading text-gray-600">
              {trip.activity_count || 0}
            </Text>
          </HStack>
        </HStack>
      </HStack>

      {!isPast && (
        <GradientButton
          onPress={onImportPress}
          title={tripDetailsStrings.importItinerary}
        />
      )}
    </Box>
  );
};

export default ItineraryCard;
