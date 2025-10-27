import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

// imports from gluestack components
import { Box, Text, HStack, Pressable, Radio, RadioIndicator, RadioGroup } from '@/components/ui';

import { GradientAvatar, GradientText, GradientProgressBar } from '@/src/components';
import { Colors } from '@/src/configs/CustomTheme';

interface PollOption {
  id?: string;
  text: string;
  votes?: number;
  voters?: Array<{
    id: string;
    name: string;
    profilePhotoURL?: string;
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
        className={`rounded-lg p-4 border mb-3 ${
          isSelected 
            ? `border-primary-300 shadow-sm` 
            : 'border-gray-200'
        }`}
        style={{ backgroundColor: isSelected ? `#${Colors.primaryLight}` : `#${Colors.white}` }}
      >
        <HStack className="items-center space-x-3 mb-1">
          {/* Radio Selection Indicator */}
          <RadioGroup>
            <Radio
              value={option.id || option.text}
              onPress={onPress}
              size="md"
            >
              <RadioIndicator
                className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-2`}
                style={{ backgroundColor:isSelected ? Colors.primary : Colors.white, borderColor:isSelected ? Colors.primary : Colors.gray }}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={13} color={Colors.white} />
                )}
              </RadioIndicator>
            </Radio>
          </RadioGroup>

          {/* Option Text */}         
          {isSelected ? (
          <GradientText
            text={option.text}
            textStyle={{ fontSize: 16, fontWeight: '800', textAlign: 'center', fontFamily: 'AvenirLTPro-Medium' }}
          />):(
            <Text className={`text-lg font-medium`} style={{ color: Colors.black, fontWeight: '500', textAlign: 'center', fontFamily: 'AvenirLTPro-Medium' }}>
              {option.text}
            </Text>
          )}
        </HStack>

        {/* Progress Bar and Vote Count */}
        {votes > 0 && (<HStack className={`justify-between items-center ${isSelected ? '' : 'mt-3'}`}>
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
            {voters.slice(0, 2).map((voter, index) => (
              <Box key={voter.id || index} className="ml-[-8px] first:ml-0">
                <GradientAvatar 
                  userName={voter.name}
                  size="small"
                  userImage={voter.profilePhotoURL}
                />
              </Box>
            ))}
            
            {/* Vote Count */}
            <Box className="ml-3">
            { isSelected ?  (
            <GradientText
              text={votes > 0 ? votes.toString() : ''}
              textStyle={{ fontSize: 16, fontWeight: '800', textAlign: 'center', fontFamily: 'AvenirLTPro-Medium' }}
            />) : (
              <Text className={`text-lg font-medium`} style={{ color: Colors.black, fontWeight: '500', textAlign: 'center', fontFamily: 'AvenirLTPro-Medium' }}>
                {votes}
              </Text>
            )}
            </Box>
          </HStack>
        </HStack>)}
      </Box>
    </Pressable>
  );
};

export default PollOptionCard;
