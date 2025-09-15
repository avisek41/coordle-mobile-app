import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '@/src/constant/apiConstant';

// Types for remove host API
export interface RemoveHostRequest {
  userId: string;
}

export interface RemoveHostResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    tripId: string;
    tripName: string;
    members: {
      userId: string;
      email: string;
      phoneNumber: string | null;
      tripRole: string;
      preferredName: string;
      inviteType: string | null;
    }[];
    totalMembers: number;
  };
}

// Remove host API slice
export const removeHostApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    removeHost: builder.mutation<
      RemoveHostResponse,
      { tripId: string; body: RemoveHostRequest }
    >({
      query: ({ tripId, body }) => ({
        url: `${API_ENDPOINTS.REMOVE_HOST}/${tripId}/hosts`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['TripMembers'],
    }),
  }),
});

// Export hooks for usage in components
export const { useRemoveHostMutation } = removeHostApi;
