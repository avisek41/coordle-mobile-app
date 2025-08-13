import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Trip } from '@/src/types/trip';
import { tripDetailsStrings } from './strings';
import { Colors } from '@/src/configs/CustomTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface CoverImageProps {
  trip: Trip;
  userCount: number;
  onBackPress: () => void;
  onEditPress: () => void;

  isPast: boolean;
}

const CoverImage: React.FC<CoverImageProps> = ({
  trip,
  userCount,
  onBackPress,
  onEditPress,

  isPast,
}) => {
  return (
    <Box>
      <Box className="w-full h-64">
        {trip.cover_image?.url ? (
          <Image
            source={{ uri: trip.cover_image.url }}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <Box className="w-full h-64 bg-gray-300 justify-center items-center">
            <Ionicons name="image-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 font-body mt-2">
              {tripDetailsStrings.noCoverImage}
            </Text>
          </Box>
        )}
      </Box>

      {/* Navigation Buttons */}
      <Box className="absolute top-0 left-0 right-0 p-4 flex-row justify-between items-start">
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        {!isPast && (
          <TouchableOpacity
            onPress={onEditPress}
            style={styles.editButton}
            activeOpacity={0.8}
          >
            <MaterialIcons name="edit" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </Box>

      {/* Group Trip Badge */}
      {userCount > 0 && (
        <Box className="absolute bottom-10 right-4">
          <Box className="bg-white px-3 py-1 rounded-full">
            <Text className="text-red-500 text-xs font-heading">
              {tripDetailsStrings.groupTrip}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: Colors.darkGray,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  editButton: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default CoverImage;
