import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

// imports from gluestack components
import { Box, HStack, VStack, Text } from '@/components/ui';

import { GradientAvatar, GradientButton, GradientText } from '@/src/components';
import { Poll } from '@/src/types/poll';
import { POLL_STRINGS } from '../strings';
import { Colors } from '@/src/configs/CustomTheme';
import { formatTimeRemaining } from '@/src/utils';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string) => void;
  onViewVotes: (pollId: string) => void;
  userVote?: string[] | null;
}

const PollCard: React.FC<PollCardProps> = ({ 
  poll,
  onVote, 
  onViewVotes,
  userVote
}) => {
  const isActive = poll.status === 'Active';

  const getStatusText = () => {
    if (isActive) {
      return `${POLL_STRINGS.POLL_ENDS_ON} ${poll.display_close_poll_date} at ${poll.display_close_poll_time}`;
    } else {
      return `${POLL_STRINGS.CLOSED_ON} ${poll.display_close_poll_date}`;
    }
  };

  const handleActionPress = () => {
    if (isActive && userVote === null) {
      onVote(poll._id);
    } else {
      onViewVotes(poll._id);
    }
  };

  const handlePress = () => {
    onVote(poll._id);
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <VStack space="sm">
        {/* Header with user info and time */}
        <HStack className="items-center justify-between">
          <HStack className="items-center" space="sm">
          <GradientAvatar
              userName={poll.createdBy?.preferredName  || 'User'}
              userImage={poll.createdBy?.profilePhotoURL || poll.createdBy?.preferredName}
              size="xs"
            />
           <Text className="text-medium font-heading text-gray-900">
              {poll.createdBy?.preferredName || 'User'}
           </Text>
          </HStack>
          <Text className="text-xs text-gray-500">
            {isActive ? formatTimeRemaining(poll.close_poll_date_time) : getStatusText()}
          </Text>
        </HStack>

        {/* Poll Question */}
        <Text className="text-base font-body text-gray-900 leading-5">
          {poll.question}
        </Text>

         {/* Divider */}
         <Box className="h-px w-full bg-gray-200" />

        {/* Status and Action */}
        <HStack className="items-center justify-between">
          <Box className="flex-1">
            {isActive && userVote === null ? (
              <Text className="text-sm text-red-600">
                {getStatusText()}
              </Text>
            ) : (
              <VStack space="xs">
                {userVote ? (
                  <Text className="text-sm text-gray-900">
                    {POLL_STRINGS.YOUR_VOTE} : <Text style={{ color: Colors.primary }} className="font-medium">{userVote.join(', ')}</Text>
                  </Text>
                ) : (
                  <Text className="text-sm text-red-600">
                    {POLL_STRINGS.POLL_EXPIRED}
                  </Text>
                )}
              </VStack>
            )}
          </Box>
            {isActive && userVote === null && (
           <GradientButton
             title={POLL_STRINGS.VOTE}
             onPress={handleActionPress}
             style={styles.voteButton}
             gradientStyle={styles.gradientButton}
             textStyle={styles.textButton}
           />
           )}
           {isActive && userVote !== null && (<TouchableOpacity
              className={`border border-primary-500 bg-white items-center justify-center`}
              style={styles.voteButton}
              onPress={handleActionPress}>
              <GradientText
                text={POLL_STRINGS.VOTE}
                textStyle={styles.textButton}
              />
            </TouchableOpacity>)}
            {!isActive && (
            <TouchableOpacity
            onPress={handleActionPress}
            style={styles.viewVotesButton}
            activeOpacity={0.8}
          >
            <Text className="text-primary-500 font-heading text-xs">
              {POLL_STRINGS.VIEW_VOTES}
            </Text>
          </TouchableOpacity>
           )}
        </HStack>
      </VStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gradientButton: {
    height: 28,
    width: 54,
    marginTop: 0,
    borderRadius: 4
  },
  textButton: {
    fontSize: 11,
  },
  voteButton:{
    height: 28,
    width: 54,
    marginTop: 0,
    borderRadius: 4
  },
  viewVotesButton: {
      borderWidth: 1,
      borderColor: Colors.primary,
      borderRadius: 4,
      paddingHorizontal: 12,
      paddingVertical: 6,
      paddingLeft: 12,
      paddingRight: 12,
  },
});

export default PollCard;
