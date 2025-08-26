import React from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { ADD_TRIP_MEMBERS_STRINGS } from './strings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { Header } from '@/src/components';

const AddTripMembers = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'AddTripMembers'>>();
  const { tripId } = route.params || {};
  const { showToast, ToastComponent } = useSimpleToast();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEmailInvite = () => {
    if (!tripId) {
      showToast({
        type: 'error',
        title: 'Trip ID Required',
        message: 'Trip ID is missing. Please try again.',
        duration: 2000,
      });
      return;
    }

    navigation.navigate('InviteTripMember', {
      tripId,
      inviteType: 'email',
    });
  };

  const handlePhoneInvite = () => {
    if (!tripId) {
      showToast({
        type: 'error',
        title: 'Trip ID Required',
        message: 'Trip ID is missing. Please try again.',
        duration: 2000,
      });
      return;
    }

    navigation.navigate('InviteTripMember', {
      tripId,
      inviteType: 'phone',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ToastComponent />
      <VStack space="lg" className="flex-1 bg-white">
        {/* Header */}
        <Header title={ADD_TRIP_MEMBERS_STRINGS.TITLE} />

        {/* Invitation Options */}
        <VStack space="md" className="px-4">
          {/* Email Invite Option */}
          <TouchableOpacity
            onPress={handleEmailInvite}
            style={styles.optionContainer}
          >
            <HStack className="items-center" space="md">
              <Box className="w-10 h-10 rounded-full bg-primary-500 justify-center items-center">
                <Ionicons name="mail-outline" size={19} color="#FFFFFF" />
              </Box>
              <Text className="text-base font-body text-gray-900">
                {ADD_TRIP_MEMBERS_STRINGS.INVITE_VIA_EMAIL}
              </Text>
            </HStack>
          </TouchableOpacity>

          {/* Phone Invite Option */}
          <TouchableOpacity
            onPress={handlePhoneInvite}
            style={styles.optionContainer}
          >
            <HStack className="items-center" space="md">
              <Box className="w-10 h-10 rounded-full bg-primary-500 justify-center items-center">
                <Ionicons name="call-outline" size={19} color="#FFFFFF" />
              </Box>
              <Text className="text-base font-body text-gray-900">
                {ADD_TRIP_MEMBERS_STRINGS.INVITE_VIA_PHONE}
              </Text>
            </HStack>
          </TouchableOpacity>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#14B8A6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddTripMembers;
