import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '@/src/constant/apiConstant';

// Types for change user role API
export interface ChangeUserRoleRequest {
  userId: string;
  tripRole: string;
}

export interface ChangeUserRoleResponse {
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

// Change user role API slice
export const changeUserRoleApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    changeUserRole: builder.mutation<
      ChangeUserRoleResponse,
      { tripId: string; body: ChangeUserRoleRequest }
    >({
      query: ({ tripId, body }) => ({
        url: `${API_ENDPOINTS.CHANGE_USER_ROLE}/${tripId}/change-role`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['TripMembers'],
    }),
  }),
});

// Export hooks for usage in components
export const { useChangeUserRoleMutation } = changeUserRoleApi;
