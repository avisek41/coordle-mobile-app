import React from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import TripCard from '../Home/TripCard';
import { Trip } from '@/src/types/trip';
import NoData from './NoData';
import { myTripsStrings } from './strings';

interface PastTripsProps {
  trips: Trip[];
  onTripPress: (trip: Trip) => void;
}

const PastTrips: React.FC<PastTripsProps> = ({ trips, onTripPress }) => {
  if (!trips || trips.length === 0) {
    return null;
  }

  return (
    <VStack space="md">
      <Text className="text-xl font-heading text-gray-800">Past Trip</Text>
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

export default PastTrips;
