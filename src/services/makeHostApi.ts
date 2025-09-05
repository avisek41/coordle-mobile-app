import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '@/src/constant/apiConstant';

// Types for make host API
export interface MakeHostRequest {
  userId: string;
}

export interface TripMember {
  userId: string;
  email: string;
  phoneNumber: string | null;
  userRole: string;
  preferredName: string;
  inviteType: string | null;
}

export interface MakeHostResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    tripId: string;
    tripName: string;
    members: TripMember[];
    totalMembers: number;
  };
}

// Make host API slice
export const makeHostApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    makeHost: builder.mutation<
      MakeHostResponse,
      { tripId: string; body: MakeHostRequest }
    >({
      query: ({ tripId, body }) => ({
        url: `${API_ENDPOINTS.MAKE_HOST}/${tripId}/hosts`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TripMembers'],
    }),
  }),
});

// Export hooks for usage in components
export const { useMakeHostMutation } = makeHostApi;
