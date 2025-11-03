import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity } from 'react-native';

// imports from gluestack components
import { Box, Text, HStack, VStack } from '@/components/ui';

import { GradientAvatar, GradientText, GradientProgressBar } from '@/src/components';
import { Colors } from '@/src/configs/CustomTheme';
import { PollOptionWithVotes } from '@/src/types/poll';

interface PollOptionCardProps {
  options: (string | PollOptionWithVotes)[];
  totalVotes: number;
  selectedOptions: string[];
  allowMultipleAnswers: boolean;
  onOptionSelect: (optionText: string) => void;
}

const PollOptionCard: React.FC<PollOptionCardProps> = ({
  options,
  totalVotes,
  selectedOptions,
  allowMultipleAnswers: _allowMultipleAnswers,
  onOptionSelect,
}) => {
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

        return (
          <TouchableOpacity
            key={optionText} 
            onPress={() => onOptionSelect(optionText)} 
            activeOpacity={0.7}
          >
            <Box
              className={`rounded-lg p-4 border mb-3 ${
                isSelected 
                  ? `border-primary-300` 
                  : 'border-gray-200'
              }`}
              style={{ backgroundColor: isSelected ? `#${Colors.primaryLight}` : `#${Colors.white}`, }}
            >
              <HStack className="items-center space-x-3 mb-1">
                {/* Radio Selection Indicator */}
                <Box
                  className="w-6 h-6 rounded-full border-2 items-center justify-center mr-2"
                  style={{
                    backgroundColor: isSelected ? Colors.primary : Colors.white,
                    borderColor: isSelected ? Colors.primary : Colors.gray
                  }}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={13} color={Colors.white} />
                  )}
                </Box>

                {/* Option Text */}         
                {isSelected ? (
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
                {optionVotes > 0 && (<HStack className={`justify-between items-center ${isSelected ? '' : 'mt-3'}`}>
                  <Box className="flex-1 mr-3">
                      <GradientProgressBar
                        percentage={percentage}
                        colors={isSelected ? ['#2E6F9E', Colors.primary] : ['#E5E7EB', '#E5E7EB']}
                        height={4}
                        backgroundColor="#E5E7EB"
                      />
                  </Box>
                  
                  
                  <HStack className="justify-between items-center space-x-1">
                   
                    {/* Voter Avatars */}
                    {optionVoters.slice(0, 2).map((voter, voterIndex) => (
                      <Box key={voter._id || voterIndex} className="ml-[-8px] first:ml-0">
                        <GradientAvatar 
                          userName={voter.preferredName}
                          size="xs"
                          userImage={voter.profilePhotoURL}
                        />
                      </Box>
                    ))}
                    
                    {/* Vote Count */}
                    <Box className="ml-3">
                    { isSelected ?  (
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
})

export default PollOptionCard;
