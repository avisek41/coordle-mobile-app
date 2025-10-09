import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { CheckIcon, ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { useGetPollByIdQuery } from '@/src/services/pollApi';
import { GradientButton, GradientAvatar, Loader } from '@/src/components';
import { pollDetailStrings } from './strings';
import { globalStyles } from '@/src/styles';
import PollOptionCard from './components/PollOptionCard';

interface PollDetailRouteParams {
  pollId: string;
}

const PollDetail: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute();
  const { pollId } = route.params as PollDetailRouteParams;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: pollData,
    isLoading,
    error,
    refetch,
  } = useGetPollByIdQuery(pollId);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing poll:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (!pollData?.data) return;

    if (pollData.data.allow_multi_answers) {
      // Multiple selection
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // Single selection
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting votes:', selectedOptions);
    // TODO: Implement vote submission API call
  };

  const handleViewVotes = () => {
    console.log('View votes');
    // TODO: Navigate to votes view screen
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !pollData?.data) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Box className="flex-1 justify-center items-center px-6">
          <Text className="text-lg text-gray-600 text-center">
            {pollDetailStrings.errorLoading}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  const poll = pollData.data;
  const totalVotes = 0; // TODO: Get actual vote counts from API

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <Box className="bg-blue-500 px-4 py-3">
        <HStack className="items-center justify-between">
          <Pressable
            className="p-2 rounded-full bg-blue-600"
            onPress={() => navigation.goBack()}
          >
            <Icon as={ArrowLeftIcon} size="xl" color="$white" />
          </Pressable>
          <Text className="text-white text-xl font-bold">
            {pollDetailStrings.title}
          </Text>
          <Pressable
            className="p-2 rounded-full bg-blue-600"
            onPress={() => console.log('More options')}
          >
            <Icon as={MoreVerticalIcon} size="xl" color="$white" />
          </Pressable>
        </HStack>
      </Box>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        <VStack className="p-4 space-y-4">
          {/* Poll Question Card */}
          <Box className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-xl font-bold text-gray-900 mb-2">
              {poll.question}
            </Text>
            
            <HStack className="justify-between items-center mb-4">
              <Text className="text-red-500 text-sm">
                {pollDetailStrings.pollEndsIn} 1 hr 12 min
              </Text>
              <HStack className="items-center space-x-2">
                <GradientAvatar 
                  userName="Kristin Watson"
                  size="small"
                />
                <Text className="text-sm text-gray-700">Kristin Watson</Text>
              </HStack>
            </HStack>

            <HStack className="items-center space-x-2">
              <Icon as={CheckIcon} size="sm" color="$blue500" />
              <Text className="text-sm text-gray-600">
                {poll.allow_multi_answers ? pollDetailStrings.multipleSelect : pollDetailStrings.singleSelect}
              </Text>
            </HStack>
          </Box>

          {/* Poll Options */}
          <VStack className="space-y-3">
            {poll.options?.map((option, index) => (
              <PollOptionCard
                key={index}
                option={{ id: index.toString(), text: option, votes: 0 }}
                totalVotes={totalVotes}
                isSelected={selectedOptions.includes(index.toString())}
                onPress={() => handleOptionSelect(index.toString())}
              />
            ))}
          </VStack>
        </VStack>
      </ScrollView>

      {/* Footer Buttons */}
      <Box className="bg-white border-t border-gray-200 p-4">
        <HStack className="space-x-3">
          <Box className="flex-1">
            <GradientButton
              onPress={handleViewVotes}
              title={pollDetailStrings.viewVotes}
            />
          </Box>
          <Box className="flex-1">
            <GradientButton
              onPress={handleSubmit}
              disabled={selectedOptions.length === 0}
              title={pollDetailStrings.submit}
            />
          </Box>
        </HStack>
      </Box>
    </SafeAreaView>
  );
};

export default PollDetail;
