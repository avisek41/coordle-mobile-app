import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { GradientAvatar } from '@/src/components';
import { CheckIcon } from 'lucide-react-native';

interface PollOption {
  id?: string;
  text: string;
  votes?: number;
  voters?: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
  }>;
}

interface PollOptionCardProps {
  option: PollOption;
  totalVotes: number;
  isSelected: boolean;
  onPress: () => void;
}

const PollOptionCard: React.FC<PollOptionCardProps> = ({
  option,
  totalVotes,
  isSelected,
  onPress,
}) => {
  const votes = option.votes || 0;
  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  const voters = option.voters || [];

  return (
    <Pressable onPress={onPress}>
      <Box
        className={`rounded-lg p-3 border ${
          isSelected 
            ? 'bg-blue-50 border-blue-300' 
            : 'bg-white border-gray-200'
        }`}
      >
        <HStack className="items-center space-x-3 mb-2">
          {/* Selection Indicator */}
          <Box
            className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
              isSelected
                ? 'bg-blue-500 border-blue-500'
                : 'border-blue-500'
            }`}
          >
            {isSelected && (
              <Icon as={CheckIcon} size="sm" color="$white" />
            )}
          </Box>

          {/* Option Text */}
          <Text 
            className={`text-base flex-1 ${
              isSelected ? 'text-blue-600 font-medium' : 'text-gray-900'
            }`}
          >
            {option.text}
          </Text>
        </HStack>

        {/* Progress Bar and Vote Count */}
        <HStack className="justify-between items-center">
          <Box className="flex-1 mr-2">
            <Box className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <Box 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </Box>
          </Box>
          
          <HStack className="items-center space-x-1">
            {/* Voter Avatars */}
            {voters.slice(0, 2).map((voter, index) => (
              <GradientAvatar 
                key={voter.id || index} 
                userName={voter.name}
                size="small"
                userImage={voter.avatarUrl}
              />
            ))}
            
            {/* Vote Count */}
            {votes > 0 && (
              <Text className="text-sm text-gray-500 ml-1">
                {votes}
              </Text>
            )}
          </HStack>
        </HStack>
      </Box>
    </Pressable>
  );
};

export default PollOptionCard;
