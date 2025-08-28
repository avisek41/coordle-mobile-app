import { apiSlice } from './apiSlice';

interface InviteUser {
  email?: string;
  phoneNumber?: string;
  userRole: string;
  isInvited?: boolean;
}

interface InviteUsersRequest {
  tripId: string;
  users: InviteUser[];
}

interface InviteUsersResponse {
  success: boolean;
  data: {
    invitedUsers: Array<{
      _id: string;
      email?: string;
      phoneNumber?: string;
      userRole: string;
      isInvited: boolean;
      tripId: string;
    }>;
  };
  message: string;
}

export const inviteUsersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    inviteUsersToTrip: builder.mutation<
      InviteUsersResponse,
      InviteUsersRequest
    >({
      query: data => ({
        url: '/api/users/invite-to-trip',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useInviteUsersToTripMutation } = inviteUsersApi;
