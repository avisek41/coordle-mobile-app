import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import { useAppSelector } from '@/src/hooks';

//gluestack components imports
import { Box, Text, VStack, HStack } from '@/components/ui';

import { Header, Loader, GradientButton } from '@/src/components';
import { PollCard } from './components';
import { pollStrings } from './strings';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { images } from '@/src/assets';
import { useGetPollsByTripQuery } from '@/src/services/pollApi';
import { Colors } from '@/src/configs/CustomTheme';
import { globalStyles } from '@/src/styles';
import { formatDateRange } from '@/src/utils';

const Poll: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'Poll'>>();
  const { tripId, tripName, tripStartDate, tripEndDate } = route.params;
  const currentUserId = useAppSelector(state => state.auth.userId);

  const [activeTab, setActiveTab] = useState<'Active' | 'Past'>('Active');
  const [refreshing, setRefreshing] = useState(false);

  const { 
    data: pollsData, 
    isLoading, 
    refetch 
  } = useGetPollsByTripQuery({ 
    tripId: tripId || '', 
    status: activeTab === 'Active' ? 'Active' : 'Closed'
  });

  const handleCreatePoll = () => {    
    navigation.navigate('CreatePoll', { tripId: tripId ?? '', tripEndDate: tripEndDate ?? '' });
  };

  const handleVote = (pollId: string) => {
    // TODO: Navigate to PollDetail when route is available
    navigation.navigate('PollDetail', { pollId: pollId, tripEndDate: tripEndDate ?? '' });
  };

  const handleViewVotes = (pollId: string) => {
    // TODO: Navigate to PollDetail when route is available
    navigation.navigate('PollVotes', { pollId: pollId });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const activePolls = pollsData?.data?.polls?.filter(poll => {
    const isActive = poll.status === 'Active';
    const isNotExpired = moment(poll.close_poll_date_time).isAfter(moment());
    return isActive && isNotExpired;
  }) || [];
  
  const pastPolls = pollsData?.data?.polls?.filter(poll => {
    const isClosed = poll.status === 'Closed';
    const isExpired = moment(poll.close_poll_date_time).isBefore(moment());
    return isClosed || isExpired;
  }) || [];
  
  const currentPolls = activeTab === 'Active' ? activePolls : pastPolls;
  
  if (isLoading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header title={pollStrings.title} />
        <Box className="flex-1 justify-center items-center">
          <Loader />
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title={pollStrings.title} />
      
      {/* Trip Info */}
      <VStack className="px-6 py-2">
        <HStack className="items-center justify-between">
          <Text className="text-lg font-bold text-gray-900">
            {tripName}
          </Text>
          <Text className="text-sm text-gray-500">
            {formatDateRange(tripStartDate, tripEndDate)}
          </Text>
        </HStack>
      </VStack>

      {/* Tab Navigation */}
      <HStack className="px-6 py-2 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab('Active')}
          style={styles.tabButton}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'Active' && styles.activeTabText
          ]}>
            {pollStrings.active}
          </Text>
          {activeTab === 'Active' && <Box style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('Past')}
          style={styles.tabButton}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'Past' && styles.activeTabText
          ]}>
            {pollStrings.past}
          </Text>
          {activeTab === 'Past' && <Box style={styles.tabIndicator} />}
        </TouchableOpacity>
      </HStack>

      {/* Polls List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {currentPolls.length === 0 ? (
          <VStack className="flex-1 justify-center items-center py-20">
            <Box className="mb-8">
              <Image
                source={images.poll}
                style={styles.img}
                resizeMode="contain"
              />
            </Box>
            <VStack className="items-center" space="md">
              <Text className="text-2xl font-heading text-gray-900 text-center">
                {activeTab === 'Active' ? 'No Active Polls' : 'No Past Polls'}
              </Text>
              <Text className="text-base font-body text-gray-500 text-center">
                {activeTab === 'Active' 
                  ? 'Create a poll to gather opinions' 
                  : 'No polls have been closed yet'
                }
              </Text>
            </VStack>
          </VStack>
        ) : (
          <VStack className="px-6 py-4">
            {currentUserId && currentPolls.map((poll) => (
              <PollCard
                key={poll._id}
                poll={poll}
                onVote={handleVote}
                onViewVotes={handleViewVotes}
                userVote={poll.votes?.find(vote => vote.userId === currentUserId)?.selectedOptionText || null} // TODO: Add user vote data when available
              />
            ))}
          </VStack>
        )}
      </ScrollView>

      {/* Create Poll Button */}
      <Box className="px-6 pb-6">
        <GradientButton
          title={pollStrings.createPoll}
          onPress={handleCreatePoll}
          size="large"
        />
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  img: {
    width: 35,
    height: 35,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textGray,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
});

export default Poll;
