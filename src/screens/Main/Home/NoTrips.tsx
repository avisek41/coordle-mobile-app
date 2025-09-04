import React from 'react';
import { Image } from 'react-native';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { homeStrings } from './strings';
import { images } from '@/src/assets';
import { useGetPaymentHistoryQuery } from '@/src/services/paymentHistoryApi';
import GradientButton from '@/src/components/GradientButton';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';

const NoTrips: React.FC = () => {
  const { navigate } = useNavigation<MainNavigationProps>();
  const {
    data: paymentHistory,
    isLoading,
    error,
  } = useGetPaymentHistoryQuery({
    page: 1,
    limit: 10,
  });

  // Check if user has any successful payments
  const hasPaid = (paymentHistory?.data?.payments?.length ?? 0) > 0;

  const handleCreateTrip = () => {
    navigate({ name: 'CreateTrip', params: { isEditMode: false } });
  };

  return (
    <Box className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
      <VStack className="items-center" space="lg">
        <Box className="relative mb-2">
          <Image
            source={images.trip}
            resizeMode="contain"
            style={{
              width: 50,
              height: 50,
            }}
          />
        </Box>

        <VStack className="items-center" space="sm">
          <GluestackText className="text-xl font-heading text-black-800 text-center">
            {homeStrings.noTripsTitle}
          </GluestackText>
          <GluestackText className="text-md text-gray-600 text-center">
            {homeStrings.noTripsSubtitle}
          </GluestackText>
        </VStack>

        {hasPaid && (
          <Box className="w-full ">
            <GradientButton
              title={homeStrings.createTripButton}
              onPress={handleCreateTrip}
              style={{
                width: '50%',
                alignSelf: 'center',
              }}
            />
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default NoTrips;
