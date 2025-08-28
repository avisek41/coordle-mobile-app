import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { TRIP_MEMBERS_STRINGS } from './strings';
import {
  CustomActionSheet,
  ExpandableFab,
  GradientAvatar,
  GradientFabButton,
  Header,
} from '@/src/components';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import {
  useGetTripMembersQuery,
  useRemoveParticipantMutation,
} from '@/src/services';
import { Loader } from '@/src/components';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { useAppSelector } from '@/src/hooks';

const TripMembers = () => {
  const { userRole } = useAppSelector(state => state?.auth);
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'TripMembers'>>();
  const { tripId, start, end } = route.params;
  const { showToast, ToastComponent } = useSimpleToast();

  // State variables for different member types
  const [owners, setOwners] = useState<
    Array<{
      userId: string;
      email?: string;
      phoneNumber?: string | null;
      userRole: string;
    }>
  >([]);
  const [hosts, setHosts] = useState<
    Array<{
      userId: string;
      email?: string;
      phoneNumber?: string | null;
      userRole: string;
    }>
  >([]);
  const [participants, setParticipants] = useState<
    Array<{
      userId: string;
      email?: string;
      phoneNumber?: string | null;
      userRole: string;
    }>
  >([]);

  // Action sheet state
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<{
    userId: string;
    email?: string;
    phoneNumber?: string | null;
    userRole: string;
  } | null>(null);

  const {
    data: tripMembersData,
    isLoading,
    error,
    refetch,
  } = useGetTripMembersQuery(tripId);

  const [
    removeParticipant,
    { isLoading: isRemoving, reset: resetRemoveParticipant },
  ] = useRemoveParticipantMutation();

  // useEffect to separate members by role
  useEffect(() => {
    if (tripMembersData?.data?.members) {
      const members = tripMembersData.data.members;

      const ownersList = members.filter(member => member.userRole === 'owner');
      const hostsList = members.filter(member => member.userRole === 'hosts');
      const participantsList = members.filter(
        member => member.userRole === 'traveller',
      );

      setOwners(ownersList);
      setHosts(hostsList);
      setParticipants(participantsList);
    }
  }, [tripMembersData]);

  const handleAddMembers = () => {};

  const handleParticipantMenuPress = (participant: {
    userId: string;
    email?: string;
    phoneNumber?: string | null;
    userRole: string;
  }) => {
    setSelectedParticipant(participant);
    setIsActionSheetOpen(true);
  };

  const handleRemindParticipant = () => {
    // TODO: Implement remind functionality
    console.log('Remind participant:', selectedParticipant?.email);
  };

  const handleRemoveParticipant = async () => {
    if (!selectedParticipant) return;

    try {
      await removeParticipant({
        tripId,
        body: { userId: selectedParticipant.userId },
      }).unwrap();

      handleCloseActionSheet();

      // Show success toast
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Participant removed successfully',
        duration: 2000,
      });

      // Navigate to trip details after a short delay
      setTimeout(() => {
        navigation.navigate('TripDetails', { tripId });
      }, 1000);
    } catch (error) {
      // Show error toast
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to remove participant. Please try again.',
        duration: 3000,
      });
      console.error('Failed to remove participant:', error);
    } finally {
      resetRemoveParticipant();
    }
  };

  const handleCloseActionSheet = () => {
    setIsActionSheetOpen(false);
    setSelectedParticipant(null);
  };

  const getDisplayName = (email?: string, phoneNumber?: string) => {
    if (email) {
      const name = email.split('@')[0];
      return name?.length > 3 ? name.substring(0, 3) : name;
    }
    if (phoneNumber) {
      return phoneNumber.length > 3 ? phoneNumber.substring(0, 3) : phoneNumber;
    }
    return 'User';
  };

  useFocusEffect(
    React.useCallback(() => {
      if (tripId) {
        refetch();
      }
    }, [tripId]),
  );

  if (isLoading) {
    return <Loader />;
  }

  if (error || !tripMembersData?.data) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={TRIP_MEMBERS_STRINGS.TITLE} />
        <Box className="flex-1 justify-center items-center px-4">
          <Text className="text-base font-body text-gray-600 text-center">
            Failed to load trip members. Please try again.
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  const { tripName } = tripMembersData.data;

  console.log('participants', participants);

  return (
    <SafeAreaView style={styles.container}>
      <ToastComponent />
      <VStack space="lg" className="flex-1 bg-white">
        {/* Header */}
        <Header title={TRIP_MEMBERS_STRINGS.TITLE} />

        <VStack space="md" className="px-4">
          <HStack className="justify-between items-center">
            <Text className="text-lg font-heading text-gray-900">
              {tripName}
            </Text>
            <Text className="text-sm font-body text-gray-500">
              {start} - {end}
            </Text>
          </HStack>

          {owners.map(owner => (
            <Box
              key={owner.userId}
              className="bg-gray-100 border border-gray-200 rounded-lg p-3"
            >
              <HStack className="items-center justify-between">
                <HStack className="items-center" space="md">
                  <GradientAvatar
                    userName={getDisplayName(
                      owner?.email,
                      owner?.phoneNumber || undefined,
                    )}
                    userImage={''}
                    size="medium"
                  />
                  <Text className="text-base font-body text-gray-900">
                    {getDisplayName(
                      owner?.email,
                      owner?.phoneNumber || undefined,
                    )}
                  </Text>
                </HStack>
                <Box className="bg-primary-500 rounded-lg px-3 py-1">
                  <Text className="text-white font-heading text-sm">
                    {TRIP_MEMBERS_STRINGS.OWNER}
                  </Text>
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>

        <VStack space="md" className="px-4">
          <HStack className="justify-between items-center">
            <Text className="text-base font-heading text-gray-900">
              {TRIP_MEMBERS_STRINGS.HOSTS}
            </Text>
            <Text className="text-sm font-body text-red-500">
              {hosts.length}
            </Text>
          </HStack>

          {hosts?.map(host => (
            <Box
              key={host.userId}
              className="bg-gray-100 border border-gray-200 rounded-lg p-3"
            >
              <HStack className="items-center justify-between">
                <HStack className="items-center" space="md">
                  <GradientAvatar
                    userName={getDisplayName(host?.email)}
                    userImage={''}
                    size="medium"
                  />
                  <Text className="text-base font-body text-gray-900">
                    {getDisplayName(host?.email)}
                  </Text>
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
        {/* Participants Section */}
        <VStack space="md" className="px-4 flex-1">
          <HStack className="justify-between items-center">
            <Text className="text-base font-heading text-gray-900">
              {TRIP_MEMBERS_STRINGS.PARTICIPANTS}
            </Text>
            <Text className="text-sm font-body text-red-500">
              {participants.length}
            </Text>
          </HStack>

          {participants.map(participant => (
            <Box
              key={participant.userId}
              className="bg-gray-100 border border-gray-200 rounded-lg p-3"
            >
              <HStack className="items-center justify-between">
                <HStack className="items-center flex-1" space="md">
                  {participant?.email ? (
                    <>
                      <GradientAvatar
                        userName={getDisplayName(participant?.email)}
                        userImage={''}
                        size="medium"
                      />
                      <VStack space="xs">
                        <Text className="text-base font-body text-gray-900">
                          {participant?.email}
                        </Text>
                        <Text className="text-sm font-body text-primary-500">
                          {TRIP_MEMBERS_STRINGS.INVITED}
                        </Text>
                      </VStack>
                    </>
                  ) : (
                    <VStack space="xs">
                      <Text className="text-base font-body text-gray-900">
                        {participant?.phoneNumber}
                      </Text>
                      <Text className="text-sm font-body text-primary-500">
                        {TRIP_MEMBERS_STRINGS.INVITED}
                      </Text>
                    </VStack>
                  )}
                </HStack>
                {userRole === 'owner' && (
                  <TouchableOpacity
                    className="w-6 h-6 justify-center items-center"
                    onPress={() => handleParticipantMenuPress(participant)}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                )}
              </HStack>
            </Box>
          ))}
        </VStack>

        {userRole === 'owner' && (
          <ExpandableFab
            actions={[
              {
                id: 'export',
                title: 'Export Itinerary',
                icon: 'arrow-up-outline',
                color: '#4A90E2',
                onPress: () => {},
              },
              {
                id: 'travel',
                title: 'Travel',
                icon: 'airplane-outline',
                color: '#50C878',
                onPress: () => {},
              },
            ]}
          />
        )}

        <CustomActionSheet
          isOpen={isActionSheetOpen}
          onClose={handleCloseActionSheet}
          title=""
          subtitle={selectedParticipant?.email}
          actions={[
            {
              id: 'remind',
              title: 'Remind',
              onPress: handleRemindParticipant,
              icon: (
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#6B7280"
                />
              ),
            },
            {
              id: 'remove',
              title: isRemoving ? 'Removing...' : 'Remove from Trip',
              onPress: handleRemoveParticipant,
              isDestructive: true,
              isDisabled: isRemoving,
              icon: (
                <Ionicons
                  name="person-remove-outline"
                  size={20}
                  color="#EF4444"
                />
              ),
            },
          ]}
          showCancelButton={true}
          cancelButtonText="Cancel"
          onCancelPress={handleCloseActionSheet}
        />
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default TripMembers;
