import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CREATE_TRIP_STRINGS } from './strings';

interface ShareTripSectionProps {
  tripMembers: string;
  onTripMembersChange: (value: string) => void;
}

const ShareTripSection: React.FC<ShareTripSectionProps> = ({
  tripMembers,
  onTripMembersChange,
}) => {
  return (
    <VStack space="md" className="mt-6">
      <Text className="text-lg font-heading text-gray-800">
        {CREATE_TRIP_STRINGS.shareTrip}
      </Text>

      <Box className="bg-white ">
        <VStack space="md">
          <Box>
            <Input className="bg-gray-50 border border-gray-200 h-16 rounded-lg">
              <InputSlot className="ml-3">
                <Ionicons name="person-add-outline" size={19} color="#6B7280" />
              </InputSlot>

              <InputField
                placeholder={CREATE_TRIP_STRINGS.addTripMembers}
                value={tripMembers}
                onChangeText={onTripMembersChange}
                className="text-base font-body"
              />
            </Input>
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
