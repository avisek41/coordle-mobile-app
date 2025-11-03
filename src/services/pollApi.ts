import { apiSlice } from './apiSlice';
import { PollsResponse, CreatePollFormData, UpdatePollFormData, CreatePollResponse, GetPollsByTripParams, VoteOnPollRequest, VoteOnPollResponse, GetPollVotesResponse } from '@/src/types/poll';
import { API_ENDPOINTS } from '@/src/constant/apiConstant';

export const pollApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    
    // Get polls by trip ID
    getPollsByTrip: builder.query<PollsResponse, GetPollsByTripParams>({
      query: ({ tripId, ...params }) => ({
        url: `${API_ENDPOINTS.POLL}/trip/${tripId}`,
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: (result, error, { tripId }) => [
        { type: 'Polls', id: tripId },
        'Polls'
      ],
    }),
    
    // Create a new poll
    createPoll: builder.mutation<CreatePollResponse, CreatePollFormData>({
      query: pollData => ({
        url: API_ENDPOINTS.POLL,
        method: 'POST',
        body: pollData,
      }),
      invalidatesTags: ['Polls'],
    }),
    
    // Update poll
    updatePoll: builder.mutation<CreatePollResponse, { pollId: string; pollData: UpdatePollFormData }>({
      query: ({ pollId, pollData }) => ({
        url: `${API_ENDPOINTS.POLL}/${pollId}`,
        method: 'PUT',
        body: pollData,
      }),
      invalidatesTags: (result, error, { pollId }) => [
        { type: 'Polls', id: pollId },
        'Polls'
      ],
    }),
    
    // Delete poll
    deletePoll: builder.mutation<{ success: boolean; message: string }, string>({
      query: pollId => ({
        url: `${API_ENDPOINTS.POLL}/${pollId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, pollId) => [
        { type: 'Polls', id: pollId },
        'Polls'
      ],
    }),
    
    // Publish poll
    publishPoll: builder.mutation<CreatePollResponse, string>({
      query: pollId => ({
        url: `${API_ENDPOINTS.POLL}/${pollId}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, pollId) => [
        { type: 'Polls', id: pollId },
        'Polls'
      ],
    }),
    
    // Close poll
    closePoll: builder.mutation<CreatePollResponse, string>({
      query: pollId => ({
        url: `${API_ENDPOINTS.POLL}/${pollId}/close`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, pollId) => [
        { type: 'Polls', id: pollId },
        'Polls'
      ],
    }),
    
    // Vote on poll
    voteOnPoll: builder.mutation<VoteOnPollResponse, { pollId: string; voteData: VoteOnPollRequest }>({
      query: ({ pollId, voteData }) => ({
        url: `${API_ENDPOINTS.POLL}/${pollId}/vote`,
        method: 'POST',
        body: voteData,
      }),
      invalidatesTags: (result, error, { pollId }) => [
        { type: 'Polls', id: pollId },
        'Polls'
      ],
    }),
    
    // Get poll votes
    getPollVotes: builder.query<GetPollVotesResponse, string>({
      query: pollId => ({
        url: `${API_ENDPOINTS.POLL}/${pollId}/votes`,
        method: 'GET',
      }),
      providesTags: (result, error, pollId) => [
        { type: 'Polls', id: pollId },
        'Polls'
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPollsByTripQuery,
  useCreatePollMutation,
  useUpdatePollMutation,
  useDeletePollMutation,
  usePublishPollMutation,
  useClosePollMutation,
  useVoteOnPollMutation,
  useGetPollVotesQuery,
} = pollApi;
