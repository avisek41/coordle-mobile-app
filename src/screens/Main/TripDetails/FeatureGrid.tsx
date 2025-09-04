import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { tripDetailsStrings } from './strings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/src/configs/CustomTheme';

interface FeatureButton {
  id: string;
  title: string;
  icon: string;
  badge: number | null;
  isOwner: boolean;
}

interface FeatureGridProps {
  userCount: number;
  onFeaturePress: (feature: string) => void;
  isPast?: boolean;
  isOwner: boolean;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({
  userCount,
  onFeaturePress,
  isPast = false,
  isOwner,
}) => {
  const featureButtons: FeatureButton[] = [
    {
      id: 'announcement',
      title: tripDetailsStrings.announcement,
      icon: 'megaphone-outline',
      badge: null,
      isOwner,
    },
    {
      id: 'chat',
      title: tripDetailsStrings.chat,
      icon: 'chatbubble-outline',
      badge: null,
      isOwner,
    },
    {
      id: 'food-order',
      title: tripDetailsStrings.manageFoodOrder,
      icon: 'restaurant-outline',
      badge: null,
      isOwner,
    },
    {
      id: 'members',
      title: tripDetailsStrings.tripMembers,
      icon: 'people-outline',
      badge: userCount,
      isOwner,
    },
    {
      id: 'poll',
      title: tripDetailsStrings.poll,
      icon: 'bar-chart-outline',
      badge: null,
      isOwner,
    },
    {
      id: 'map',
      title: tripDetailsStrings.map,
      icon: 'location-outline',
      badge: null,
      isOwner,
    },
    {
      id: 'documents',
      title: 'Documents',
      icon: 'document-text-outline',
      badge: null,
      isOwner,
    },
  ];

  return (
    <VStack space="md">
      <Box className="flex-row flex-wrap justify-between">
        {featureButtons.map(feature => (
          <TouchableOpacity
            key={feature.id}
            onPress={() => onFeaturePress(feature.title)}
            style={[
              styles.featureButton,
              isPast && styles.disabledFeatureButton,
            ]}
            activeOpacity={isPast ? 1 : 0.8}
            disabled={isPast}
          >
            <VStack className="items-center" space="sm">
              <Box className="relative">
                <Ionicons name={feature.icon} size={24} color="#51B1C0" />
                {/* {feature.badge !== null && feature.badge > 0 && (
                  <Box className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 justify-center items-center">
                    <Text className="text-white text-xs font-heading">
                      {feature.badge}
                    </Text>
                  </Box>
                )} */}
              </Box>
              <HStack space="sm">
                <Text className="text-xs font-body text-gray-700 text-center">
                  {feature.title}
                </Text>
                {feature.badge !== null && feature.badge > 0 && (
                  <Text className="text-md font-heading text-red-500 text-center">
                    {feature.badge}
                  </Text>
                )}
              </HStack>
            </VStack>
          </TouchableOpacity>
        ))}
      </Box>
    </VStack>
  );
};

const styles = StyleSheet.create({
  featureButton: {
    width: '48%', // Changed from 30% to 48% for 2 per row
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  disabledFeatureButton: {
    backgroundColor: '#F3F4F6', // Light grey background
    opacity: 0.6,
  },
});

export default FeatureGrid;
