import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Box, Text, VStack, HStack} from '@/components/ui';

import { MainNavigationProps } from '@/src/types/allRoutes';
import { useVoteOnPollMutation, useClosePollMutation, useDeletePollMutation, useGetPollVotesQuery } from '@/src/services/pollApi';
import { GradientButton, GradientAvatar, Loader, CustomActionSheet, CustomAlert, Header, GradientText } from '@/src/components';
import { POLL_STRINGS, POLL_DETAIL_STRINGS, POLL_VOTES_STRINGS } from './strings';
import { globalStyles } from '@/src/styles';
import PollOptionCard from './components/PollOptionCard';
import { PollOptionWithVotes } from '@/src/types/poll';
import { useAppSelector } from '@/src/hooks';
import { ActionItem } from '@/src/components/CustomActionSheet';
import { images } from '@/src/assets';
import { Colors } from '@/src/configs/CustomTheme';
import { formatTimeRemaining } from '@/src/utils';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
interface PollDetailRouteParams {
  pollId: string;
  tripEndDate: string;
}

// Type guard to check if option is PollOptionWithVotes
const isPollOptionWithVotes = (option: string | PollOptionWithVotes): option is PollOptionWithVotes => {
  return typeof option === 'object' && 'text' in option;
};

const PollDetail: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute();
  const { pollId, tripEndDate } = route.params as PollDetailRouteParams;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [showEndPollAlert, setShowEndPollAlert] = useState(false);
  const [showDeletePollAlert, setShowDeletePollAlert] = useState(false);
  const { showToast, ToastComponent } = useSimpleToast();

  const {
    data: pollData,
    isLoading,
    error,
    refetch,
  } = useGetPollVotesQuery(pollId);

  const [voteOnPoll, { isLoading: isVoting }] = useVoteOnPollMutation();
  const [closePoll, { isLoading: isClosingPoll }] = useClosePollMutation();
  const [deletePoll, { isLoading: isDeletingPoll }] = useDeletePollMutation();
  const { userId, userRole } = useAppSelector(state => state.auth);  // This should come from auth context
  const isOwnerOrHost = userRole === 'owner' || userRole === 'host';

  let content;

  // Initialize selected options based on user's previous votes
  useEffect(() => {
    if (pollData?.data?.options) {
      const userSelectedOptions = pollData.data.options.filter(option => isPollOptionWithVotes(option) && option.voters.some(voter => voter._id === userId))
        .map(option => isPollOptionWithVotes(option) ? option.text : option);
      setSelectedOptions(userSelectedOptions);
    }
  }, [pollData?.data?.options, userId, pollData?.data]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (refreshError) {
      console.error('Error refreshing poll:', refreshError);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOptionSelect = (optionText: string) => {
    const isSelected = (selectedOptions.includes(optionText));
    if (!pollData?.data) return;

    if (pollData.data.allow_multi_answers) {
      // Multiple selection
      setSelectedOptions(prev => 
        isSelected ? prev.filter(text => text !== optionText) : [...prev, optionText]
      );
    } else {
      // Single selection
      setSelectedOptions([optionText]);
    }
  };

  const handleSubmit = async () => {
    if (selectedOptions.length === 0) return;
    
    try {
      if (!userId) {
        console.error('User ID not found');
        return;
      }
      await voteOnPoll({
        pollId,
        voteData: {
          userId,
          selectedOptionTexts: selectedOptions
        }
      }).unwrap();

      showToast({
        type: 'success',
        title: POLL_DETAIL_STRINGS.VOTE_SUBMITTED_SUCCESSFULLY,
        message: POLL_DETAIL_STRINGS.VOTE_SUBMITTED_SUCCESSFULLY,
        duration: 3000,
      });

      // Optionally show success message
      console.log('Vote submitted successfully');
    } catch (voteError) {
      console.error('Error submitting vote:', voteError);
      // TODO: Show error message to user
    }
  };

  const handleViewVotes = () => {
    // TODO: Navigate to votes view screen
    navigation.navigate('PollVotes', { pollId: pollId });
  };

  const handleEditPoll = () => {
    console.log('tripEndDate>>', tripEndDate);
    // TODO: Navigate to create poll screen
    navigation.navigate('CreatePoll', { tripId: poll.trip_id, tripEndDate: tripEndDate, pollId: pollId });
  };

  const handleEndPoll = () => {
    setShowEndPollAlert(true);
  };

  const handleDeletePoll = () => {
    setShowDeletePollAlert(true);
  };

  const getStatusText = () => {
    return `${POLL_STRINGS.POLL_ENDS_IN} ${formatTimeRemaining(poll.close_poll_date_time)}`;
  };

  const confirmEndPoll = () => {
    setShowEndPollAlert(false);
    closePoll(pollId)
      .unwrap()
      .then(() => {
        console.log('Poll ended successfully');
        // Optionally show success message or navigate back
        navigation.goBack();
      })
      .catch((closeError) => {
        console.error('Error ending poll:', closeError);
        // TODO: Show error message to user
      });
  };

  const confirmDeletePoll = () => {
    setShowDeletePollAlert(false);
    deletePoll(pollId)
      .unwrap()
      .then(() => {
        console.log('Poll deleted successfully');
        // Navigate back after successful deletion
        navigation.goBack();
      })
      .catch((deleteError) => {
        console.error('Error deleting poll:', deleteError);
        // TODO: Show error message to user
      });
  };

  const actionSheetItems: ActionItem[] = [
    {
      id: 'edit',
      title: 'Edit Poll',
      onPress: handleEditPoll,
      isDisabled: isClosingPoll || isDeletingPoll,
    },
    {
      id: 'end',
      title: isClosingPoll ? 'Ending Poll...' : 'End Poll',
      onPress: handleEndPoll,
      isDisabled: isClosingPoll || isDeletingPoll,
    },
    {
      id: 'delete',
      title: isDeletingPoll ? 'Deleting...' : 'Delete',
      onPress: handleDeletePoll,
      isDisabled: isClosingPoll || isDeletingPoll,
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  if (error || !pollData?.data) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Box className="flex-1 justify-center items-center px-6">
          <Text className="text-lg text-gray-600 text-center">
            {POLL_DETAIL_STRINGS.ERROR_LOADING}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  const poll = pollData.data;
  const isPollClosed = poll.status === 'Closed' as const;
  const totalVotes = poll?.options?.reduce((sum, option) => {
    // Handle both string array (from base Poll) and PollOptionWithVotes array (from API response)
    if (isPollOptionWithVotes(option)) {
      return sum + (option.vote_count || 0);
    }
    return sum;
  }, 0) || 0;

  if (userRole === 'traveller') {
    if (poll.status === 'Active') {
      content = (
        <Box className="bg-white">
          <GradientButton
            title={isVoting ? 'Submitting...' : POLL_DETAIL_STRINGS.SUBMIT}
            onPress={handleSubmit}
            loading={isVoting}
            disabled={selectedOptions.length === 0 || isVoting || isPollClosed}
            size="large"
            textStyle={styles.submitButtonText}
          />
        </Box>
      );
    } else if (poll.published && isPollClosed){
      content = (
        <Box className="bg-white">
          <TouchableOpacity
            className="p-4 border border-primary-500 rounded-lg bg-white items-center justify-center"
            onPress={handleViewVotes}>
            <GradientText
              text={POLL_DETAIL_STRINGS.VIEW_POLL_RESULTS}
              textStyle={styles.viewVotesGradientText}
            />
          </TouchableOpacity>
        </Box>
      );
    }
  } else {
    content = (
      <HStack className="space-x-3">
        <Box className="flex-1 justify-end">
          <TouchableOpacity
            className="p-4 border border-primary-500 rounded-lg bg-white items-center justify-center"
            onPress={handleViewVotes}>
            <GradientText
              text={POLL_DETAIL_STRINGS.VIEW_VOTES}
              textStyle={styles.viewVotesGradientText}
            />
          </TouchableOpacity>
        </Box>
        <Box className="flex-1 ml-3">
          <GradientButton
            onPress={handleSubmit}
            disabled={selectedOptions.length === 0 || isVoting || isPollClosed}
            title={isVoting ? 'Submitting...' : POLL_DETAIL_STRINGS.SUBMIT}
            loading={isVoting}
            textStyle={styles.submitButtonText}
          />
        </Box>
      </HStack>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.blue]}
            tintColor={Colors.blue}
          />
        }
      >
        {/* Cover Image with Curve */}
        <Box className="relative">
          <Image source={images.cover} style={styles.coverImage} />

          {/* Header Overlay */}
          <Box className="absolute top-0 left-0 right-0">
            <Header
              title={POLL_DETAIL_STRINGS.TITLE}
              onBackPress={() => navigation.goBack()}
              showBackButton={true}
              titleStyle={styles.headerTitle}
              iconColor={Colors.white}
              rightComponent={
                isOwnerOrHost && poll.status === 'Active' ? (<TouchableOpacity
                  onPress={() => setIsActionSheetOpen(true)}
                  className="p-2 border border-gray-200 rounded-lg"
                  activeOpacity={0.8}
                >
                  <Ionicons name="ellipsis-vertical-outline" size={20} color={Colors.white} />
                </TouchableOpacity>):(<></>)
              }
            />
          </Box>
        </Box>

        {/* Poll Content */}
        <VStack className="flex-1 px-6" style={styles.questionCard}>
          {/* Poll Question Card */}
          <Box style={styles.card}>
            <Text className="text-xl font-bold text-gray-900 mb-4 fontFamilyAvenir">
              {poll.question}
            </Text>
            
            {poll.status === 'Active' && (<HStack className="justify-between items-center mb-4">
              <Text className="text-red-500 text-sm font-medium fontFamilyAvenir">
                {getStatusText()}
              </Text>
              <HStack className="items-center" space="sm">
                <GradientAvatar
                    userName={poll.createdBy?.preferredName || 'User'}
                    userImage={poll.createdBy?.profilePhotoURL || poll.createdBy?.preferredName}
                    size="xs"
                  />
                <Text className="text-medium font-heading text-gray-900">
                    {poll.createdBy?.preferredName || 'User'}
                </Text>
              </HStack>
            </HStack>)}
            {poll.status !== 'Active' && (<HStack className="justify-between items-center">
              <HStack className="items-center" space="sm">
                <GradientAvatar
                    userName={poll.createdBy?.preferredName || 'User'}
                    userImage={poll.createdBy?.profilePhotoURL || poll.createdBy?.preferredName}
                    size="xs"
                  />
                <Text className="text-medium font-heading text-gray-900">
                    {poll.createdBy?.preferredName || 'User'}
                </Text>
              </HStack>
              
              <Box
                className={`px-3 py-1 rounded-full`}
                style={{ backgroundColor: Colors.mediumGray }}>
                <Text 
                  className="text-sm text-center fontFamilyAvenir text-white fontWeight900"
                >
                  {POLL_VOTES_STRINGS.CLOSED}
                </Text>
              </Box>
            </HStack>)}
          </Box>
          
          {/* Poll Type */}
          <HStack className="items-center mt-2 mb-4 font-semibold">
            {poll.allow_multi_answers ? (
              <Box style={styles.multipleIconContainer}>
              <Ionicons name="checkmark-outline" size={18} style={styles.allowMultipleIcon1} />
              <Ionicons name="checkmark-outline" size={18} style={styles.allowMultipleIcon2} />
            </Box>            
            ) : (
              <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
            )}
            <Text className="text-medium text-gray-900 ml-2 fontFamilyAvenir font-semibold">
              {poll.allow_multi_answers ? POLL_DETAIL_STRINGS.MULTIPLE_SELECT : POLL_DETAIL_STRINGS.SINGLE_SELECT}
            </Text>
          </HStack>

          {/* Poll Options */}
          <VStack className="space-y-3 mb-6">
            <PollOptionCard
              options={poll?.options || []}
              totalVotes={totalVotes}
              selectedOptions={selectedOptions}
              allowMultipleAnswers={poll.allow_multi_answers || false}
              onOptionSelect={handleOptionSelect}
              isActivePoll={poll.status === 'Active'}
            />
          </VStack>

        </VStack>
      </ScrollView>

      {/* Action Buttons */}
      {content && (<Box className="bg-white border-t border-gray-200 p-3 mb-3 px-6">
       {content}
      </Box>)}

      {/* Action Sheet for Poll Options */}
      <CustomActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        actions={actionSheetItems}
      />

      {/* End Poll Confirmation Alert */}
      <CustomAlert
        isOpen={showEndPollAlert}
        title="Are you sure?"
        message="Do you really want to end this poll? This process cannot be undone.\n\nThe trip members will no longer be able to vote in the poll."
        cancelText="Cancel"
        confirmText="End Poll"
        onCancel={() => setShowEndPollAlert(false)}
        onConfirm={confirmEndPoll}
        isCreatedAlert={true}
      />

      {/* Delete Poll Confirmation Alert */}
      <CustomAlert
        isOpen={showDeletePollAlert}
        title="Are you sure?"
        message="Do you really want to delete this poll? This process cannot be undone."
        cancelText="Cancel"
        confirmText="Delete Poll"
        onCancel={() => setShowDeletePollAlert(false)}
        onConfirm={confirmDeletePoll}
        isCreatedAlert={true}
      />
      <ToastComponent />
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    marginTop: -50
  },
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
  coverImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'AvenirLTPro-Medium',
  },
  viewVotesGradientText: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: 'AvenirLTPro-Medium',
  },
  multipleIconContainer: {
    position: 'relative',
    width: 30,
    height: 22,
    marginRight: -2,
  },
  
  allowMultipleIcon1: {
    position: 'absolute',
    left: 3,
    top: 2,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    color: Colors.white,
    zIndex: 1,
  },
  
  allowMultipleIcon2: {
    position: 'absolute',
    left: 10,
    top: 1.2,
    backgroundColor: Colors.primary,
    zIndex: 2,
    borderRadius: 20,
    color: Colors.white,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'AvenirLTPro-Medium',
  },
});

export default PollDetail;
