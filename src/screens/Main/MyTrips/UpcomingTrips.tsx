import React from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import TripCard from '../Home/TripCard';
import { Trip } from '@/src/types/trip';

interface UpcomingTripsProps {
  trips: Trip[];
  onTripPress: (trip: Trip) => void;
}

const UpcomingTrips: React.FC<UpcomingTripsProps> = ({
  trips,
  onTripPress,
}) => {
  if (!trips || trips.length === 0) {
    return null;
  }

  return (
    <VStack space="md">
      <Text className="text-xl font-heading text-gray-800">Upcoming Trip</Text>
      {trips.map((trip: Trip) => (
        <TripCard
          key={trip._id}
          trip={trip}
          showBadges={true}
          onPress={() => onTripPress(trip)}
        />
      ))}
    </VStack>
  );
};

export default UpcomingTrips;
