import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { TRIP_MEMBERS_STRINGS } from './strings';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
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
  useMakeHostMutation,
  useRemoveHostMutation,
  useLazyGetBulkUsersQuery,
  type BulkUserData,
} from '@/src/services';
import { Loader } from '@/src/components';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';

interface TripMember {
  userId: string;
  email: string;
  phoneNumber: string | null;
  tripRole: string;
  inviteType: string;
  preferredName: string;
  // Additional properties for export
  pronoun?: string;
  photoUrl?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  ageDemographic?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  dietaryRestriction?: string;
  disabilityStatus?: string;
  ethnicBackground?: string;
  foodAllergy?: string;
  preferredAirport?: string;
  userType?: string;
}

// 🔹 Convert ArrayBuffer → Base64
const bufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // process in chunks
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return global.btoa(binary); // encode to base64
};

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
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: tripMembersData,
    isLoading,
    error,
    refetch,
  } = useGetTripMembersQuery(tripId);

  console.log('tripMembersData', tripMembersData);

  const [
    removeParticipant,
    { isLoading: isRemoving, reset: resetRemoveParticipant },
  ] = useRemoveParticipantMutation();

  const [makeHost, { isLoading: isMakingHost, reset: resetMakeHost }] =
    useMakeHostMutation();

  const [removeHost, { isLoading: isRemovingHost, reset: resetRemoveHost }] =
    useRemoveHostMutation();

  const [getBulkUsers, { isLoading: isFetchingBulkUsers }] =
    useLazyGetBulkUsersQuery();

  useEffect(() => {
    if (tripMembersData?.data?.members) {
      const members = tripMembersData.data.members;

      // API response now uses tripRole, so no mapping needed
      const mappedMembers: TripMember[] = members;

      const ownersList = mappedMembers.filter(
        member => member.tripRole === 'owner',
      );
      const hostsList = mappedMembers.filter(
        member => member.tripRole === 'host',
      );
      const participantsList = mappedMembers.filter(
        member => member.tripRole === 'traveller',
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

  const handleMakeAsHost = async () => {
    if (!selectedParticipant) return;

    try {
      await makeHost({
        tripId,
        body: { userId: selectedParticipant.userId },
      }).unwrap();

      handleCloseActionSheet();

      refetch();
    } catch (error: any) {
      console.error('Failed to make user host:', error);

      showToast({
        type: 'error',
        message: error?.data?.message || 'Failed to promote user to host',
      });
    } finally {
      resetMakeHost();
    }
  };

  const handleDemoteToTraveller = async () => {
    if (!selectedParticipant) return;

    try {
      await removeHost({
        tripId,
        body: { userId: selectedParticipant.userId },
      }).unwrap();

      handleCloseActionSheet();

      refetch();
    } catch (error: any) {
      console.error('Failed to remove host:', error);
    } finally {
      resetRemoveHost();
    }
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

  if (isLoading || isRemovingHost || isMakingHost || isFetchingBulkUsers) {
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
  const allMembers = [...owners, ...hosts, ...participants];

  const exportTripMembers = async (
    tripMembersData: TripMember[],
    tripName: string,
    showToast: (params: {
      type: 'success' | 'error';
      title: string;
      message: string;
      duration?: number;
    }) => void,
  ) => {
    try {
      // 1. Get user IDs from trip members
      const userIds = tripMembersData.map(member => member.userId);

      // 2. Fetch detailed user data from API
      const bulkUsersResponse = await getBulkUsers({ userIds }).unwrap();

      if (!bulkUsersResponse.success || !bulkUsersResponse.data?.users) {
        throw new Error('Failed to fetch user details');
      }

      const detailedUsers: BulkUserData[] = bulkUsersResponse.data.users;

      // 3. Create a map for quick lookup using _id from API
      const userDataMap = new Map(detailedUsers.map(user => [user._id, user]));

      const exportData = detailedUsers.map(member => {
        return {
          // Basic identity
          'Display Name': member.displayName || member.preferredName || 'N/A',
          'First Name': member.firstName || 'N/A',
          'Last Name': member.lastName || 'N/A',
          Email: member.email || 'N/A',
          'Phone Number': member.phoneNumber || 'N/A',

          // Personal details
          Pronouns: member.pronouns || 'N/A', // ✅ correct key
          Gender: member.genderIdentity || 'N/A', // ✅ genderIdentity
          'Age Demographic': member.ageDemographic || 'N/A',
          'Ethnic Background': member.racialEthnic || 'N/A', // ✅ racialEthnic
          'Sexual Orientation': member.sexualOrientation || 'N/A',
          'Disability Status': member.disabilityStatus || 'N/A',

          // Dietary info
          'Dietary Restriction': member.dietaryRestrictions || 'N/A', // ✅ dietaryRestrictions
          'Food Allergies': member.foodAllergies?.join(', ') || 'N/A',

          // Location
          'Postal Code': member.postalCode || 'N/A',
          State: member.state || 'N/A',
          Country: member.country || 'N/A',
          'Country Code': member.country_code || 'N/A',
          'Preferred Airport': member.preferredAirport || 'N/A',

          // Profile photo
          'Photo URL': member.profilePhoto?.url || 'N/A',

          // Membership / role
          Role: member.tripRole
            ? member.tripRole.charAt(0).toUpperCase() + member.tripRole.slice(1)
            : 'N/A',
        };
      });

      // 5. Convert to worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // 6. Set column widths for better formatting
      const colWidths = [
        { wch: 30 }, // Email
        { wch: 12 }, // Pronoun
        { wch: 40 }, // Photo URL
        { wch: 20 }, // Display Name
        { wch: 15 }, // First Name
        { wch: 15 }, // Last Name
        { wch: 10 }, // Gender
        { wch: 15 }, // Phone Number
        { wch: 15 }, // Age Demographic
        { wch: 12 }, // Postal Code
        { wch: 15 }, // State
        { wch: 15 }, // Country
        { wch: 20 }, // Dietary Restriction
        { wch: 18 }, // Disability Status
        { wch: 18 }, // Ethnic Background
        { wch: 15 }, // Food Allergy
        { wch: 18 }, // Preferred Airport
        { wch: 12 }, // User Type
      ];
      ws['!cols'] = colWidths;

      // 7. Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'TripMembers');

      // 8. Write workbook to ArrayBuffer
      const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

      // 9. Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${tripName.replace(
        /[^a-zA-Z0-9]/g,
        '_',
      )}_members_${timestamp}.xlsx`;

      // 10. File path - use accessible directory for each platform
      let filePath: string;

      if (Platform.OS === 'android') {
        // Android: Use Downloads folder
        filePath = `${RNFS.DownloadDirectoryPath}/${filename}`;
      } else {
        // iOS: Use Documents directory (will be accessible via Files app with proper Info.plist)
        const documentsPath = RNFS.DocumentDirectoryPath;
        if (!documentsPath) {
          throw new Error('Unable to determine iOS Documents directory path');
        }
        filePath = `${documentsPath}/${filename}`;
      }

      // 11. Ensure directory exists
      const dirPath =
        Platform.OS === 'android'
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath;

      if (dirPath) {
        const dirExists = await RNFS.exists(dirPath);
        if (!dirExists) {
          await RNFS.mkdir(dirPath);
        }
      }

      // 12. Write file
      await RNFS.writeFile(filePath, bufferToBase64(wbout), 'base64');

      // 13. Show success toast
      const locationMessage =
        Platform.OS === 'android'
          ? 'Saved to Downloads folder'
          : 'Saved to Files app';

      showToast({
        type: 'success',
        title: TRIP_MEMBERS_STRINGS.SUCCESS,
        message: `${TRIP_MEMBERS_STRINGS.EXPORT_SUCCESS}\n${locationMessage}`,
        duration: 3000,
      });
    } catch (error: unknown) {
      showToast({
        type: 'error',
        title: TRIP_MEMBERS_STRINGS.ERROR,
        message: TRIP_MEMBERS_STRINGS.EXPORT_ERROR,
        duration: 3000,
      });
    }
  };

  const handleExportMembers = async () => {
    if (isExporting || isFetchingBulkUsers) return;

    setIsExporting(true);
    try {
      await exportTripMembers(allMembers, tripName, showToast);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ToastComponent />
      <VStack space="lg" className="flex-1 bg-white">
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
                <HStack className="items-center flex-1" space="md">
                  {host?.inviteType === 'phone' ? (
                    <>
                      <GradientAvatar
                        userName={getDisplayName(host?.preferredName || 'N')}
                        userImage={''}
                        size="medium"
                      />
                      <VStack space="xs">
                        {host?.preferredName && (
                          <Text className="text-base font-body text-gray-900">
                            {host?.preferredName}
                          </Text>
                        )}
                        <Text className="text-base font-body text-gray-900">
                          {host?.phoneNumber}
                        </Text>
                        {host.preferredName?.length === 0 && (
                          <Text className="text-sm font-body text-primary-500">
                            {TRIP_MEMBERS_STRINGS.INVITED}
                          </Text>
                        )}
                      </VStack>
                    </>
                  ) : host?.inviteType === 'email' ? (
                    <>
                      <GradientAvatar
                        userName={getDisplayName(
                          host?.preferredName || host?.email,
                        )}
                        userImage={''}
                        size="medium"
                      />
                      <VStack space="xs">
                        {host?.preferredName && (
                          <Text className="text-base font-body text-gray-900">
                            {host?.preferredName}
                          </Text>
                        )}
                        <Text className="text-base font-body text-gray-900">
                          {host?.email}
                        </Text>
                        {host.preferredName?.length === 0 && (
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
                    onPress={() => handleParticipantMenuPress(host)}
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
                  ...(selectedParticipant?.tripRole === 'traveller'
                    ? [
                        {
                          id: 'makeAsHost',
                          title: isMakingHost
                            ? 'Promoting...'
                            : TRIP_MEMBERS_STRINGS.MAKE_AS_HOST,
                          onPress: handleMakeAsHost,
                          isDisabled: isMakingHost,
                        },
                      ]
                    : selectedParticipant?.tripRole === 'host'
                    ? [
                        {
                          id: 'demoteToTraveller',
                          title: isRemovingHost
                            ? 'Removing...'
                            : 'Remove from Hosts',
                          onPress: handleDemoteToTraveller,
                          isDisabled: isRemovingHost,
                        },
                      ]
                    : []),
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
      {isOwner && (
        <ExpandableFab
          actions={[
            {
              id: 'export',
              title:
                isExporting || isFetchingBulkUsers
                  ? TRIP_MEMBERS_STRINGS.EXPORTING
                  : TRIP_MEMBERS_STRINGS.EXPORT_MEMBER,
              icon: 'arrow-up-outline',
              color: Colors.dogerBlue,
              onPress: handleExportMembers,
            },
            {
              id: 'travel',
              title: TRIP_MEMBERS_STRINGS.ADD_MEMBER,
              icon: 'person-add-outline',
              color: Colors.purple,
              onPress: () => {},
            },
            {
              id: 'import',
              title: TRIP_MEMBERS_STRINGS.IMPORT_MEMBER,
              icon: 'arrow-down-outline',
              color: Colors.orange,
              onPress: () => {},
            },
          ]}
        />
      )}
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
