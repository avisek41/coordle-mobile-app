import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { Box, Text, HStack, VStack } from '@/components/ui';
import { Header, GradientButton, GradientAvatar, Loader, GradientText } from '@/src/components';
import { useGetPollVotesQuery, usePublishPollMutation } from '@/src/services/pollApi';
import { POLL_VOTES_STRINGS } from './strings';
import { globalStyles } from '@/src/styles';
import { Colors } from '@/src/configs/CustomTheme';
import { images } from '@/src/assets';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { PollOptionWithVotes } from '@/src/types/poll';
import { useAppSelector, useSimpleToast } from '@/src/hooks';

interface PollVotesRouteParams {
  pollId: string;
}

// Type guard to check if option is PollOptionWithVotes
const isPollOptionWithVotes = (option: string | PollOptionWithVotes): option is PollOptionWithVotes => {
  return typeof option === 'object' && 'text' in option;
};

const PollVotes: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute();
  const { pollId } = route.params as PollVotesRouteParams;
  const { userId } = useAppSelector(state => state.auth);
  const [refreshing, setRefreshing] = React.useState(false);
  const { showToast, ToastComponent } = useSimpleToast();

  const {
    data: pollData,
    isLoading,
    error,
    refetch,
  } = useGetPollVotesQuery(pollId);

  const [publishPoll, { isLoading: isPublishing }] = usePublishPollMutation();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (refreshError) {
      console.error('Error refreshing poll votes:', refreshError);
    } finally {
      setRefreshing(false);
    }
  };

  const handleShareResult = async () => {
    try {
      await publishPoll(pollId).unwrap();
      showToast({
        type: 'success',
        title: POLL_VOTES_STRINGS.POLL_PUBLISHED_SUCCESSFULLY,
        message: POLL_VOTES_STRINGS.POLL_PUBLISHED_SUCCESSFULLY,
        duration: 3000,
      });
      navigation.goBack();
    } catch (publishError) {
      console.error('Error sharing poll result:', publishError);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !pollData?.data) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header title={POLL_VOTES_STRINGS.TITLE} />
        <Box className="flex-1 justify-center items-center px-6">
          <Text className="text-lg text-gray-600 text-center">
            {POLL_VOTES_STRINGS.ERROR_LOADING}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  const poll = pollData.data;
  const totalVoters = poll.total_voters || 0;
  const tripMembersCount = poll.trip_members_count || 0;
  const isActive = poll.status === 'Active';

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
        {/* Cover Image */}
        <Box className="relative">
          <Image source={images.cover} style={styles.coverImage} />

          {/* Header Overlay */}
          <Box className="absolute top-0 left-0 right-0">
            <Header
              title={POLL_VOTES_STRINGS.TITLE}
              onBackPress={() => navigation.goBack()}
              showBackButton={true}
              titleStyle={styles.headerTitle}
              iconColor="#fff"
            />
          </Box>
        </Box>

        {/* Poll Content */}
        <VStack className="flex-1 px-6" style={styles.questionCard}>
          {/* Poll Question Card */}
          <Box style={styles.card}>
            <Text className="text-xl font-bold text-gray-900 mb-3 fontFamilyAvenir">
              {poll.question}
            </Text>
            
            <HStack className="justify-between items-center">
              <GradientText  text={`${totalVoters} ${POLL_VOTES_STRINGS.TRIP_MEMBERS_VOTED} ${tripMembersCount} trip members voted`}
                textStyle={styles.totalVotersGradientText} />
              
              {/* Status Badge */}
              {isActive ? (<Box
                className="px-3 py-1 rounded-full"><GradientButton
                  title={POLL_VOTES_STRINGS.ACTIVE}
                  gradientStyle={styles.gradientButton}
                  textStyle={styles.textButton}
                  onPress={() => {}}
                /></Box>): (<Box
                className={`px-3 py-1 rounded-full bg-gray-300 fontWeight-800`}>
                <Text 
                  className="text-sm text-center font-medium fontFamilyAvenir text-white fontWeight-800"
                >
                  {POLL_VOTES_STRINGS.CLOSED}
                </Text>
              </Box>)}
            </HStack>
          </Box>

          {/* Poll Options with Voters */}
          <VStack className="space-y-4 mb-3 gap-6">
            {poll.options?.map((option) => {
              const optionText = isPollOptionWithVotes(option) ? option.text : option;
              const optionVotes = isPollOptionWithVotes(option) ? (option.vote_count || 0) : 0;
              const optionVoters = isPollOptionWithVotes(option) ? (option.voters || []) : [];

              return (
                <Box key={optionText} style={styles.optionCard}>
                  {/* Option Title and Vote Count */}
                  <HStack className={`items-center justify-between mb-3 ${optionVotes > 0 ? 'border-b border-gray-200 pb-2' : ''}`} space="sm">
                    <Text className="text-base font-bold text-gray-900 fontFamilyAvenir flex-1">
                      {optionText}
                    </Text>
                    {optionVotes > 0 ? (
                      <Box style={styles.oneAndMoreVoteButton}>
                        <Text className="py-1 px-2 text-white text-sm font-bold fontFamilyAvenir">{optionVotes} {optionVotes === 1 ? POLL_VOTES_STRINGS.VOTE : POLL_VOTES_STRINGS.VOTES}</Text>
                      </Box>
                    ) : (
                      <Box style={styles.zeroVoteButton}>
                        <Text className="py-1 px-2 text-gray-500 text-sm font-bold fontFamilyAvenir">
                          0 {POLL_VOTES_STRINGS.VOTES}
                        </Text>
                      </Box>
                    )}
                  </HStack>

                  {/* Voters List */}
                  {optionVotes > 0 ? (
                    <VStack space="md">
                      {optionVoters.map((voter) => {
                        const isCurrentUser = voter._id === userId;
                        const displayName = isCurrentUser ? 'You' : voter.preferredName;

                        return (
                          <HStack key={voter._id} className="items-center" space="sm">
                            <GradientAvatar
                              userName={voter.preferredName}
                              userImage={voter.profilePhotoURL || voter.preferredName}
                              size="small"
                            />
                            <Text className={`text-base font-bold fontFamilyAvenir fontWeight-800 ${displayName === 'You' ? 'text-primary-500' : 'text-gray-900'}`}>
                              {displayName}
                            </Text>
                          </HStack>
                        );
                      })}
                    </VStack>
                  ) : (<></>)}
                </Box>
              );
            })}
          </VStack>
        </VStack>
      </ScrollView>

      {/* Share Button */}
      <Box className="bg-white border-t border-gray-200 p-4">
        <GradientButton
          title={POLL_VOTES_STRINGS.SHARE_RESULT}
          onPress={handleShareResult}
          loading={isPublishing}
          disabled={isPublishing}
          size="large"
        />
      </Box>
      <ToastComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    marginTop: -50,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gradientButton: {
    borderRadius: 50,
    height: 28,
    width: 60,
    marginTop: 0,
  },
  textButton: {
    fontSize: 12,
    fontFamily: 'AvenirLTPro-Medium',
    fontWeight: 800,
  },
  optionCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    color: '#fff',
  },
  totalVotersGradientText: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: 'AvenirLTPro-Medium',
  },
  voteCountButton: {
    height: 28,
    width: 60,
    borderRadius: 50,
    paddingHorizontal: 12,
    marginTop: 0,
  },
  voteCountText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'AvenirLTPro-Medium',
  },
  oneAndMoreVoteButton: {
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    color: Colors.white,
    borderRadius: 4,
    fontWeight: 800,
    fontFamily: 'AvenirLTPro-Bold',
  },
  zeroVoteButton: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.darkGray,
    borderRadius: 4,
    fontWeight: 800,
    fontFamily: 'AvenirLTPro-Bold',
  },
});

export default PollVotes;