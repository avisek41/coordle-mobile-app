import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import GradientFabButton from './GradientFabButton';

const GradientFabButtonExample: React.FC = () => {
  return (
    <Box className="p-4">
      <VStack space="lg">
        <GluestackText className="text-xl font-heading">
          GradientFabButton Examples
        </GluestackText>

        {/* Different sizes */}
        <VStack space="md">
          <GluestackText className="text-lg font-heading">
            Different Sizes:
          </GluestackText>
          <HStack space="md" className="items-center">
            <GradientFabButton
              onPress={() => console.log('Small FAB clicked!')}
              iconName="add"
              size="small"
              position="bottom-right"
            />
            <GradientFabButton
              onPress={() => console.log('Medium FAB clicked!')}
              iconName="add"
              size="medium"
              position="bottom-right"
            />
            <GradientFabButton
              onPress={() => console.log('Large FAB clicked!')}
              iconName="add"
              size="large"
              position="bottom-right"
            />
          </HStack>
        </VStack>

        {/* Different icons */}
        <VStack space="md">
          <GluestackText className="text-lg font-heading">
            Different Icons:
          </GluestackText>
          <HStack space="md" className="items-center">
            <GradientFabButton
              onPress={() => console.log('Add FAB clicked!')}
              iconName="add"
              size="medium"
            />
            <GradientFabButton
              onPress={() => console.log('Camera FAB clicked!')}
              iconName="camera"
              size="medium"
            />
            <GradientFabButton
              onPress={() => console.log('Chat FAB clicked!')}
              iconName="chatbubble"
              size="medium"
            />
            <GradientFabButton
              onPress={() => console.log('Share FAB clicked!')}
              iconName="share"
              size="medium"
            />
          </HStack>
        </VStack>

        {/* Different colors */}
        <VStack space="md">
          <GluestackText className="text-lg font-heading">
            Different Colors:
          </GluestackText>
          <HStack space="md" className="items-center">
            <GradientFabButton
              onPress={() => console.log('Teal FAB clicked!')}
              iconName="add"
              colors={['#14B8A6', '#0EA5E9']}
              size="medium"
            />
            <GradientFabButton
              onPress={() => console.log('Purple FAB clicked!')}
              iconName="add"
              colors={['#8B5CF6', '#EC4899']}
              size="medium"
            />
            <GradientFabButton
              onPress={() => console.log('Orange FAB clicked!')}
              iconName="add"
              colors={['#F59E0B', '#EF4444']}
              size="medium"
            />
            <GradientFabButton
              onPress={() => console.log('Green FAB clicked!')}
              iconName="add"
              colors={['#10B981', '#059669']}
              size="medium"
            />
          </HStack>
        </VStack>

        {/* Different positions */}
        <VStack space="md">
          <GluestackText className="text-lg font-heading">
            Different Positions:
          </GluestackText>
          <Box className="h-32 bg-gray-100 rounded-lg relative">
            <GradientFabButton
              onPress={() => console.log('Top-left FAB clicked!')}
              iconName="add"
              position="top-left"
              size="small"
            />
            <GradientFabButton
              onPress={() => console.log('Top-right FAB clicked!')}
              iconName="add"
              position="top-right"
              size="small"
            />
            <GradientFabButton
              onPress={() => console.log('Bottom-left FAB clicked!')}
              iconName="add"
              position="bottom-left"
              size="small"
            />
            <GradientFabButton
              onPress={() => console.log('Bottom-right FAB clicked!')}
              iconName="add"
              position="bottom-right"
              size="small"
            />
          </Box>
        </VStack>

        {/* Disabled state */}
        <VStack space="md">
          <GluestackText className="text-lg font-heading">
            Disabled State:
          </GluestackText>
          <GradientFabButton
            onPress={() => console.log('This should not trigger')}
            iconName="add"
            disabled={true}
            size="medium"
          />
        </VStack>
      </VStack>
    </Box>
  );
};

export default GradientFabButtonExample;
