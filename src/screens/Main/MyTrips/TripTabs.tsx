import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text as GluestackText } from '@/components/ui/text';
import { Colors } from '@/src/configs/CustomTheme';
import { myTripsStrings } from './strings';

interface TripTabsProps {
  activeTab: 'upcoming' | 'past';
  onTabChange: (tab: 'upcoming' | 'past') => void;
}

const TripTabs: React.FC<TripTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Box className="mb-6">
      <HStack space="sm">
        <TouchableOpacity
          onPress={() => onTabChange('upcoming')}
          style={{ flex: 1 }}
        >
          <VStack space="xs">
            <GluestackText
              className={`font-heading ${
                activeTab === 'upcoming' ? 'font-heading' : 'text-gray-600'
              }`}
              style={{
                color: activeTab === 'upcoming' ? Colors.primary : undefined,
              }}
            >
              {myTripsStrings.upcomingTrip}
            </GluestackText>
            {activeTab === 'upcoming' && (
              <Box
                className="h-0.5"
                style={{
                  backgroundColor: Colors.primary,
                  width: '20%',
                }}
              />
            )}
          </VStack>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onTabChange('past')}
          style={{ flex: 1 }}
        >
          <VStack space="xs">
            <GluestackText
              className={`font-heading ${
                activeTab === 'past' ? 'font-heading' : 'text-gray-600'
              }`}
              style={{
                color: activeTab === 'past' ? Colors.primary : undefined,
              }}
            >
              {myTripsStrings.pastTrip}
            </GluestackText>
            {activeTab === 'past' && (
              <Box
                className="h-0.5"
                style={{
                  backgroundColor: Colors.primary,
                  width: '20%',
                }}
              />
            )}
          </VStack>
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

export default TripTabs;
