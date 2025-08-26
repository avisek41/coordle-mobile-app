import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import GradientAvatar from './GradientAvatar';

const GradientAvatarExample: React.FC = () => {
  return (
    <Box className="p-4">
      <VStack space="lg">
        <GluestackText className="text-xl font-heading">
          GradientAvatar Examples
        </GluestackText>

        {/* Different sizes */}
        <VStack space="md">
          <GluestackText className="text-lg font-heading">
            Different Sizes:
          </GluestackText>
          <HStack space="md" className="items-center">
            <GradientAvatar userName="John Doe" size="small" />
            <GradientAvatar userName="John Doe" size="medium" />
            <GradientAvatar userName="John Doe" size="large" />
            <GradientAvatar userName="John Doe" size="xlarge" />
          </HStack>
        </VStack>

        {/* With user image */}
        <VStack space="md">
          <GluestackText className="text-lg font-heading">
            With User Image:
          </GluestackText>
          <HStack space="md" className="items-center">
            <GradientAvatar
              userName="John Doe"
              userImage="https://example.com/avatar.jpg"
              size="medium"
            />
            <GradientAvatar
              userName="Jane Smith"
              userImage="https://example.com/avatar2.jpg"
              size="large"
            />
          </HStack>
        </VStack>

        {/* Custom colors */}
        <VStack space="md">
          <GluestackText className="text-lg font-heading">
            Custom Colors:
          </GluestackText>
          <HStack space="md" className="items-center">
            <GradientAvatar
              userName="Alice"
              colors={['#FF6B6B', '#4ECDC4']}
              size="medium"
            />
            <GradientAvatar
              userName="Bob"
              colors={['#A8E6CF', '#DCEDC1']}
              size="medium"
            />
            <GradientAvatar
              userName="Charlie"
              colors={['#FFD93D', '#FF6B6B']}
              size="medium"
            />
          </HStack>
        </VStack>

        {/* With onPress handler */}
        <VStack space="md">
          <GluestackText className="text-lg font-heading">
            Clickable Avatar:
          </GluestackText>
          <GradientAvatar
            userName="Click Me"
            size="large"
            onPress={() => console.log('Avatar clicked!')}
          />
        </VStack>
      </VStack>
    </Box>
  );
};

export default GradientAvatarExample;
