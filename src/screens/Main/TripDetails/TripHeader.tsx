import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Trip } from '@/src/types/trip';
import { tripDetailsStrings } from './strings';
import { formatDateRange } from '@/src/utils';
import { Colors } from '@/src/configs/CustomTheme';
import { useAppSelector } from '@/src/hooks';

interface TripHeaderProps {
  trip: Trip;
  onAddMembersPress: () => void;
  isPast?: boolean;
}

const TripHeader: React.FC<TripHeaderProps> = ({
  trip,
  onAddMembersPress,
  isPast = false,
}) => {
  const { userRole } = useAppSelector(state => state?.auth);
  return (
    <VStack space="sm">
      <HStack className="justify-between items-start">
        <VStack className="flex-1">
          <Text className="text-2xl font-heading text-gray-800 mb-1">
            {trip.name}
          </Text>
          <HStack space="sm">
            <Text className="text-base font-body text-gray-500">
              {formatDateRange(trip.display_start, trip.display_end)}
            </Text>
            <Text className="text-sm font-body text-gray-500">
              {trip.duration}
            </Text>
          </HStack>
        </VStack>

        {!isPast && userRole === 'owner' && (
          <TouchableOpacity
            onPress={onAddMembersPress}
            style={styles.addMembersButton}
            activeOpacity={0.8}
          >
            <Text className="text-primary-500 font-heading text-sm">
              {tripDetailsStrings.addTripMembers}
            </Text>
          </TouchableOpacity>
        )}
      </HStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  addMembersButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

export default TripHeader;
