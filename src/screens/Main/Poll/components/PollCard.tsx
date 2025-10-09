import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';

// imports from gluestack components
import { Box, HStack, VStack, Text } from '@/components/ui';

import { GradientAvatar, GradientButton } from '@/src/components';
import { Poll } from '@/src/types/poll';
import { POLL_STRINGS } from '../strings';
import { Colors } from '@/src/configs/CustomTheme';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string) => void;
  onViewVotes: (pollId: string) => void;
  userVote?: string;
}

const PollCard: React.FC<PollCardProps> = ({ 
  poll,
  onVote, 
  onViewVotes, 
  userVote
}) => {
  const isActive = poll.status === 'Active';
  
  const formatTimeRemaining = (closeDateTime: string) => {
    const now = moment();
    const closeDate = moment(closeDateTime);
    const diffMinutes = closeDate.diff(now, 'minutes');
    const diffHours = closeDate.diff(now, 'hours');
    const diffDays = closeDate.diff(now, 'days');
    
    if (diffMinutes <= 0) {
      return 'Expired';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `${diffHours} hr`;
    } else {
      return `${diffDays} day`;
    }
  };

  const getStatusText = () => {
    if (isActive) {
      return `${POLL_STRINGS.POLL_ENDS_ON} ${moment(poll.close_poll_date_time).format('MM/DD/YYYY [at] h:mm A')}`;
    } else {
      return `${POLL_STRINGS.CLOSED_ON} ${moment(poll.close_poll_date_time).add(7, 'days').format('MM/DD/YYYY')}`;
    }
  };

  const getButtonText = () => {
    if (isActive) {
      return POLL_STRINGS.VOTE;
    } else {
      return POLL_STRINGS.VIEW_VOTES;
    }
  };

  // Button style configurations
  const buttonStyles = {
    vote: {
      style: { height: 30, width: 50, marginTop: 0 },
      gradientStyle: { width: '100%' as const, height: '100%' as const, borderRadius: 5 },
      textStyle: { fontSize: 12 },
    },
    viewVotes: {
      style: { height: 35, marginTop: 0 },
      gradientStyle: { width: '100%' as const, height: '100%' as const },
      textStyle: { fontSize: 14 },
    },
  };

  const buttonConfig = isActive ? buttonStyles.vote : buttonStyles.viewVotes;

  const handlePress = () => {
    if (isActive) {
      onVote(poll._id);
    } else {
      onViewVotes(poll._id);
    }
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
              userName={poll.createdBy?.preferredName || poll.createdBy?.firstName || 'User'}
              userImage={poll.createdBy?.profilePhotoURL || poll.createdBy?.preferredName}
              size="xs"
            />
           <Text className="text-medium font-heading text-gray-900">
              {poll.createdBy?.preferredName || poll.createdBy?.firstName || 'User'}
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
            {isActive ? (
              <Text className="text-sm text-red-600">
                {getStatusText()}
              </Text>
            ) : (
              <VStack space="xs">
                {userVote ? (
                  <Text className="text-sm text-gray-900">
                    {POLL_STRINGS.YOUR_VOTE} : <Text className="text-blue-600">{userVote}</Text>
                  </Text>
                ) : (
                  <Text className="text-sm text-red-600">
                    {POLL_STRINGS.POLL_EXPIRED}
                  </Text>
                )}
              </VStack>
            )}
          </Box>
          
           <GradientButton
             title={getButtonText()}
             onPress={handlePress}
             style={buttonConfig.style}
             gradientStyle={buttonConfig.gradientStyle}
             textStyle={buttonConfig.textStyle}
           />
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
});

export default PollCard;
