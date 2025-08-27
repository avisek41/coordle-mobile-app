import { apiSlice } from './apiSlice';

interface RemoveParticipantRequest {
  userId: string;
}

interface RemoveParticipantResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    tripId: string;
    removedUserId: string;
  };
}

export const removeParticipantApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    removeParticipant: builder.mutation<
      RemoveParticipantResponse,
      { tripId: string; body: RemoveParticipantRequest }
    >({
      query: ({ tripId, body }) => ({
        url: `/api/trips/${tripId}/participants`,
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

export const { useRemoveParticipantMutation } = removeParticipantApi;
