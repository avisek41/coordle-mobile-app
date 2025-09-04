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
import { useAppSelector } from '@/src/hooks';

interface TripMember {
  userId: string;
  email: string;
  phoneNumber: string | null;
  userRole: string;
  inviteType: string;
  preferredName: string;
}

const TripMembers = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'TripMembers'>>();
  const { tripId, start, end, isOwner } = route.params;
  const { showToast, ToastComponent } = useSimpleToast();
  const [owners, setOwners] = useState<TripMember[]>([]);
  const [hosts, setHosts] = useState<TripMember[]>([]);
  const [participants, setParticipants] = useState<TripMember[]>([]);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<TripMember | null>(null);

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

  const handleParticipantMenuPress = (participant: TripMember) => {
    setSelectedParticipant(participant);
    setIsActionSheetOpen(true);
  };

  const handleRemindParticipant = () => {
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

      showToast({
        type: 'success',
        title: TRIP_MEMBERS_STRINGS.SUCCESS,
        message: TRIP_MEMBERS_STRINGS.PARTICIPANT_REMOVED_SUCCESS,
        duration: 2000,
      });

      setTimeout(() => {
        navigation.reset({
          index: 1,
          routes: [
            { name: 'BottomTabs' },
            { name: 'TripDetails', params: { tripId } },
          ],
        });
      }, 1000);
    } catch (error) {
      showToast({
        type: 'error',
        title: TRIP_MEMBERS_STRINGS.ERROR,
        message: TRIP_MEMBERS_STRINGS.PARTICIPANT_REMOVE_ERROR,
        duration: 3000,
      });
      console.error('Failed to remove participant:', error);
    } finally {
      resetRemoveParticipant();
    }
  };

  const handleMakeAsHost = () => {
    // TODO: Implement make as host functionality
    console.log('Make as host:', selectedParticipant?.email);
    handleCloseActionSheet();
  };

  const handleViewProfile = () => {
    if (selectedParticipant?.userId) {
      navigation.navigate('MemberProfile', {
        userId: selectedParticipant.userId,
      });
    }
    handleCloseActionSheet();
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
            {TRIP_MEMBERS_STRINGS.FAILED_TO_LOAD}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  const { tripName } = tripMembersData.data;

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
                  {participant?.inviteType === 'phone' ? (
                    <>
                      <GradientAvatar
                        userName={getDisplayName(
                          participant?.preferredName || 'N',
                        )}
                        userImage={''}
                        size="medium"
                      />
                      <VStack space="xs">
                        {participant?.preferredName && (
                          <Text className="text-base font-body text-gray-900">
                            {participant?.preferredName}
                          </Text>
                        )}
                        <Text className="text-base font-body text-gray-900">
                          {participant?.phoneNumber}
                        </Text>
                        {participant.preferredName?.length === 0 && (
                          <Text className="text-sm font-body text-primary-500">
                            {TRIP_MEMBERS_STRINGS.INVITED}
                          </Text>
                        )}
                      </VStack>
                    </>
                  ) : participant?.inviteType === 'email' ? (
                    <>
                      <GradientAvatar
                        userName={getDisplayName(
                          participant?.preferredName || participant?.email,
                        )}
                        userImage={''}
                        size="medium"
                      />
                      <VStack space="xs">
                        {participant?.preferredName && (
                          <Text className="text-base font-body text-gray-900">
                            {participant?.preferredName}
                          </Text>
                        )}
                        <Text className="text-base font-body text-gray-900">
                          {participant?.email}
                        </Text>
                        {participant.preferredName?.length === 0 && (
                          <Text className="text-sm font-body text-primary-500">
                            {TRIP_MEMBERS_STRINGS.INVITED}
                          </Text>
                        )}
                      </VStack>
                    </>
                  ) : null}
                </HStack>
                {isOwner && (
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

        {isOwner && (
          <ExpandableFab
            actions={[
              {
                id: 'export',
                title: TRIP_MEMBERS_STRINGS.EXPORT_ITINERARY,
                icon: 'arrow-up-outline',
                color: '#4A90E2',
                onPress: () => {},
              },
              {
                id: 'travel',
                title: TRIP_MEMBERS_STRINGS.TRAVEL,
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
          subtitle={
            selectedParticipant?.preferredName
              ? selectedParticipant?.preferredName
              : selectedParticipant?.email
          }
          actions={[
            ...(selectedParticipant?.preferredName
              ? [
                  {
                    id: 'viewProfile',
                    title: TRIP_MEMBERS_STRINGS.VIEW_PROFILE,
                    onPress: handleViewProfile,
                  },
                  {
                    id: 'makeAsHost',
                    title: TRIP_MEMBERS_STRINGS.MAKE_AS_HOST,
                    onPress: handleMakeAsHost,
                  },
                ]
              : [
                  {
                    id: 'remind',
                    title: TRIP_MEMBERS_STRINGS.REMIND,
                    onPress: handleRemindParticipant,
                  },
                ]),

            {
              id: 'remove',
              title: isRemoving
                ? TRIP_MEMBERS_STRINGS.REMOVING
                : TRIP_MEMBERS_STRINGS.REMOVE_FROM_TRIP,
              onPress: handleRemoveParticipant,
              isDestructive: true,
              isDisabled: isRemoving,
            },
          ]}
          showCancelButton={true}
          cancelButtonText={TRIP_MEMBERS_STRINGS.CANCEL}
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
