import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CREATE_TRIP_STRINGS } from './strings';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';

interface ShareTripSectionProps {
  tripMembers: string;
  onTripMembersChange: (value: string) => void;
  tripId?: string;
}

const ShareTripSection: React.FC<ShareTripSectionProps> = ({
  tripMembers,
  onTripMembersChange,
  tripId,
}) => {
  const navigation = useNavigation<MainNavigationProps>();

  const handleAddMembersPress = () => {
    navigation.navigate('AddTripMembers', { tripId });
  };

  return (
    <VStack space="md" className="mt-6">
      <Text className="text-lg font-heading text-gray-800">
        {CREATE_TRIP_STRINGS.shareTrip}
      </Text>

      <Box className="bg-white ">
        <VStack space="md">
          <Box>
            <TouchableOpacity onPress={handleAddMembersPress}>
              <Input className="bg-gray-50 border border-gray-200 h-16 rounded-lg">
                <InputSlot className="ml-3">
                  <Ionicons
                    name="person-add-outline"
                    size={19}
                    color="#6B7280"
                  />
                </InputSlot>

                <InputField
                  placeholder={CREATE_TRIP_STRINGS.addTripMembers}
                  value={tripMembers}
                  onChangeText={onTripMembersChange}
                  className="text-base font-body"
                  editable={false}
                />
              </Input>
            </TouchableOpacity>
          </Box>

          <Text className="text-sm font-body text-gray-600 leading-5">
            {CREATE_TRIP_STRINGS.shareTripDescription}
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default ShareTripSection;
