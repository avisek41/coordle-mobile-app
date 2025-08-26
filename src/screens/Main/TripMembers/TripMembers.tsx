import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { TRIP_MEMBERS_STRINGS } from './strings';
import { GradientAvatar, Header } from '@/src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { useGetTripMembersQuery } from '@/src/services';
import { Loader } from '@/src/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const TripMembers = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'TripMembers'>>();
  const { tripId, duration } = route.params;

  // State variables for different member types
  const [owners, setOwners] = useState<
    Array<{
      userId: string;
      email: string;
      userRole: string;
    }>
  >([]);
  const [hosts, setHosts] = useState<
    Array<{
      userId: string;
      email: string;
      userRole: string;
    }>
  >([]);
  const [participants, setParticipants] = useState<
    Array<{
      userId: string;
      email: string;
      userRole: string;
    }>
  >([]);

  const {
    data: tripMembersData,
    isLoading,
    error,
  } = useGetTripMembersQuery(tripId);

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

  const handleAddMembers = () => {
    navigation.navigate('AddTripMembers', { tripId });
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].charAt(0).toUpperCase();
  };

  const getDisplayName = (email: string) => {
    const name = email.split('@')[0];
    return name.length > 3 ? name.substring(0, 3) : name;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = moment(startDate).format('MM/DD/YYYY');
    const end = moment(endDate).format('MM/DD/YYYY');
    return `${start} - ${end}`;
  };

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

  const { tripName, totalMembers } = tripMembersData.data;

  return (
    <SafeAreaView style={styles.container}>
      <VStack space="lg" className="flex-1 bg-white">
        {/* Header */}
        <Header title={TRIP_MEMBERS_STRINGS.TITLE} />

        <VStack space="md" className="px-4">
          <HStack className="justify-between items-center">
            <Text className="text-lg font-heading text-gray-900">
              {tripName}
            </Text>
            <Text className="text-sm font-body text-gray-500">{duration}</Text>
          </HStack>

          {owners.map(host => (
            <Box
              key={host.userId}
              className="bg-gray-100 border border-gray-200 rounded-lg p-3"
            >
              <HStack className="items-center justify-between">
                <HStack className="items-center" space="md">
                  <GradientAvatar
                    userName={getDisplayName(host.email)}
                    userImage={''}
                    size="medium"
                  />
                  <Text className="text-base font-body text-gray-900">
                    {getDisplayName(host.email)}
                  </Text>
                </HStack>
                <Box className="bg-primary-500 rounded-lg px-3 py-1">
                  <Text className="text-white font-body text-sm">
                    {TRIP_MEMBERS_STRINGS.OWNER}
                  </Text>
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>
        {/* Hosts Section */}
        <VStack space="md" className="px-4">
          <HStack className="justify-between items-center">
            <Text className="text-base font-heading text-gray-900">
              {TRIP_MEMBERS_STRINGS.HOSTS}
            </Text>
            <Text className="text-sm font-body text-red-500">
              {hosts.length}
            </Text>
          </HStack>

          {hosts.map(host => (
            <Box
              key={host.userId}
              className="bg-gray-100 border border-gray-200 rounded-lg p-3"
            >
              <HStack className="items-center justify-between">
                <HStack className="items-center" space="md">
                  <GradientAvatar
                    userName={getDisplayName(host.email)}
                    userImage={''}
                    size="medium"
                  />
                  <Text className="text-base font-body text-gray-900">
                    {getDisplayName(host.email)}
                  </Text>
                </HStack>
                <Box className="bg-primary-500 rounded-lg px-3 py-1">
                  <Text className="text-white font-body text-sm">
                    {TRIP_MEMBERS_STRINGS.OWNER}
                  </Text>
                </Box>
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
                  <GradientAvatar
                    userName={getDisplayName(participant.email)}
                    userImage={''}
                    size="medium"
                  />
                  <VStack space="xs">
                    <Text className="text-base font-body text-gray-900">
                      {participant.email}
                    </Text>
                    <Text className="text-sm font-body text-primary-500">
                      {TRIP_MEMBERS_STRINGS.INVITED}
                    </Text>
                  </VStack>
                </HStack>
                <TouchableOpacity className="w-6 h-6 justify-center items-center">
                  <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </HStack>
            </Box>
          ))}
        </VStack>
        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={handleAddMembers}
          style={styles.fab}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#14B8A6',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default TripMembers;
