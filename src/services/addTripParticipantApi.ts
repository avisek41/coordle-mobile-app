import { apiSlice } from './apiSlice';

interface AddTripParticipantRequest {
  userId: string;
  tripRole: string;
}

interface AddTripParticipantResponse {
  success: boolean;
  data: {
    _id: string;
    tripId: string;
    userId: string;
    tripRole: string;
    addedAt: string;
  };
  message: string;
}

export const addTripParticipantApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addTripParticipant: builder.mutation<
      AddTripParticipantResponse,
      { tripId: string; data: AddTripParticipantRequest }
    >({
      query: ({ tripId, data }) => ({
        url: `/api/trips/${tripId}/participants`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useAddTripParticipantMutation } = addTripParticipantApi;
