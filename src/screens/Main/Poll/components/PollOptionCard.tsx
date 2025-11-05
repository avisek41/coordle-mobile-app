import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity } from 'react-native';

// imports from gluestack components
import { Box, Text, HStack, VStack } from '@/components/ui';

import { GradientAvatar, GradientText, GradientProgressBar } from '@/src/components';
import { Colors } from '@/src/configs/CustomTheme';
import { PollOptionWithVotes } from '@/src/types/poll';
import { useAppSelector } from '@/src/hooks';

interface PollOptionCardProps {
  options: (string | PollOptionWithVotes)[];
  totalVotes: number;
  selectedOptions: string[];
  allowMultipleAnswers: boolean;
  onOptionSelect: (optionText: string) => void;
  isActivePoll: boolean;
}

const PollOptionCard: React.FC<PollOptionCardProps> = ({
  options,
  totalVotes,
  selectedOptions,
  allowMultipleAnswers: _allowMultipleAnswers,
  onOptionSelect,
  isActivePoll = false,
}) => {

  const { userId, userRole } = useAppSelector(state => state.auth); 
  const isOwnerOrHost = userRole === 'owner' || userRole === 'host';
  
  // Type guard to check if option is PollOptionWithVotes
  const isPollOptionWithVotes = (option: string | PollOptionWithVotes): option is PollOptionWithVotes => {
    return typeof option === 'object' && 'text' in option;
  };
  return (
    <VStack space="md">
      {options.map((option) => {
        const optionText = isPollOptionWithVotes(option) ? option.text : option;
        const optionVotes = isPollOptionWithVotes(option) ? (option.vote_count || 0) : 0;
        const optionVoters = isPollOptionWithVotes(option) ? (option.voters || []) : [];
        const isSelected = selectedOptions.includes(optionText);
        const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
        const isSelectedByUser = isOwnerOrHost || isActivePoll ? isSelected : isSelected && optionVoters.find(voter => voter._id === userId);

        return (
          <TouchableOpacity
            key={optionText} 
            onPress={() => isActivePoll && onOptionSelect(optionText)} 
            activeOpacity={0.7}
          >
            <Box
              className={`rounded-lg p-4 border mb-3 ${
                isSelectedByUser
                  ? `border-primary-300` 
                  : 'border-gray-200'
              }`}
              style={{ backgroundColor: isSelectedByUser ? `${Colors.primaryLight}` : `${Colors.lightGray}` }}
            >
              <HStack className="items-center space-x-3 mb-1 mt-1">
                {/* Radio Selection Indicator */}
                <Box
                  className="w-6 h-6 rounded-full border-2 items-center justify-center mr-2"
                  style={{
                    backgroundColor: isSelectedByUser ? Colors.primary : Colors.white,
                    borderColor: isSelectedByUser ? Colors.primary : Colors.gray
                  }}
                >
                  {isSelectedByUser && (
                    <Ionicons name="checkmark" className="checkmarkIcon" size={17} color={Colors.white} />
                  )}
                </Box>

                {/* Option Text */}         
                {isSelectedByUser ? (
                <GradientText
                  text={optionText}
                  textStyle={styles.optionGradientText}
                />):(
                  <Text className={`text-lg font-medium ${styles.optionText}`}>
                    {optionText}
                  </Text>
                )}
              </HStack>

                {/* Progress Bar and Vote Count */}
                {isOwnerOrHost && optionVotes > 0 && (<HStack className={`justify-between items-center ${isSelectedByUser ? '' : 'mt-3'}`}>
                  <Box className="flex-1 mr-5">
                      <GradientProgressBar
                        percentage={percentage}
                        colors={percentage ? [Colors.progressBarColor, Colors.primary] : [Colors.lightProgressBg, Colors.lightProgressBg]}
                        height={4}
                        backgroundColor={Colors.lightProgressBg}
                      />
                  </Box>
                  
                  
                  <HStack className="justify-between items-center space-x-1">
                   
                    {/* Voter Avatars */}
                    {optionVoters.slice(0, 2).map((voter, voterIndex) => (
                      <Box key={voter._id || voterIndex} className="first:ml-0 last:ml-[-4px] first:mr-[-4px]">
                        <GradientAvatar 
                          userName={voter.preferredName}
                          size="xs"
                          userImage={voter.profilePhotoURL}
                        />
                      </Box>
                    ))}
                    
                    {/* Vote Count */}
                    <Box className="ml-3">
                    { isSelectedByUser ?  (
                    <GradientText
                      text={optionVotes > 0 ? optionVotes.toString() : ''}
                      textStyle={styles.optionGradientText}
                    />) : (
                      <Text className={`text-lg font-medium ${styles.optionText}`}>
                        {optionVotes}
                      </Text>
                    )}
                    </Box>
                  </HStack>
                </HStack>)}
              </Box>
            </TouchableOpacity>
          );
        })}
    </VStack>
  );
};

const styles = StyleSheet.create({
  optionText: {
    color: Colors.black,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'AvenirLTPro-Medium'
  },
  optionGradientText: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: 'AvenirLTPro-Medium',
  },
  checkmarkIcon: {
    fontWeight: 900,
  },
})

export default PollOptionCard;