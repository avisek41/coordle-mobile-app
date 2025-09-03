import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';

import { GradientAvatar } from '@/src/components';
import { useGetSamePlanUsersQuery } from '@/src/services/samePlanUsersApi';
import { User, Plan } from '@/src/types/user';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';

interface PlanUsersProps {
  ownerId: string;
  onUserSelect?: (user: User, isSelected: boolean) => void;
  selectedUsers?: string[];
  isEmailType: boolean;
}

const PlanUsers: React.FC<PlanUsersProps> = ({
  ownerId,
  onUserSelect,
  selectedUsers = [],
  isEmailType,
}) => {
  const { data, isLoading, error } = useGetSamePlanUsersQuery(ownerId);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  console.log('data', data);
  // Filter users based on inviteType when data or isEmailType changes
  useEffect(() => {
    if (data?.success && data?.data?.users) {
      const filtered = data?.data?.users?.filter(user => {
        if (isEmailType) {
          return user.inviteType === 'email';
        } else {
          return user.inviteType === 'phone';
        }
      });

      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [data, isEmailType]);

  if (isLoading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </Box>
    );
  }

  if (error || !data?.success) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Text className="font-body text-red-600">
          Failed to load users. Please try again.
        </Text>
      </Box>
    );
  }

  const handleUserToggle = (user: User) => {
    const isSelected = selectedUsers.includes(user?.email || user?.phoneNumber);
    onUserSelect?.(user, !isSelected);
  };

  const renderUserItem = (user: User) => {
    const isSelected = selectedUsers.includes(user?.email || user?.phoneNumber);

    return (
      <React.Fragment key={user._id}>
        {isEmailType ? (
          <Box className="flex-row items-center">
            <HStack className="flex-1 items-center" space="md">
              <GradientAvatar userName={user?.email} size="medium" />

              <VStack className="flex-1">
                <Text className="font-body text-gray-800 text-base">
                  {user?.email}
                </Text>
              </VStack>
            </HStack>

            {onUserSelect && (
              <TouchableOpacity
                onPress={() => handleUserToggle(user)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isSelected ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={!isSelected ? '#000' : Colors.primary}
                />
              </TouchableOpacity>
            )}
          </Box>
        ) : (
          <Box className="flex-row items-center">
            <HStack className="flex-1 items-center" space="md">
              <VStack className="flex-1">
                <Text className="font-body text-gray-800 text-base">
                  {user?.phoneNumber}
                </Text>
              </VStack>
            </HStack>

            {onUserSelect && (
              <TouchableOpacity
                onPress={() => handleUserToggle(user)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isSelected ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={!isSelected ? '#000' : Colors.primary}
                />
              </TouchableOpacity>
            )}
          </Box>
        )}
      </React.Fragment>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <VStack space="lg" className="p-4">
        <Box>
          {filteredUsers.length > 0 ? (
            <Box className="bg-white ">{filteredUsers.map(renderUserItem)}</Box>
          ) : null}
        </Box>
      </VStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PlanUsers;
