import { apiSlice } from './apiSlice';

interface RegisterInvitedUserRequest {
  email: string;
  userRole: string;
  registrationMethod: string;
  isInvited: boolean;
}

interface RegisterInvitedUserResponse {
  success: boolean;
  data: {
    _id: string;
    email: string;
    userRole: string;
    registrationMethod: string;
    isInvited: boolean;
  };
  message: string;
}

export const registerInvitedUserApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerInvitedUser: builder.mutation<
      RegisterInvitedUserResponse,
      RegisterInvitedUserRequest
    >({
      query: (data) => ({
        url: '/api/users/register',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useRegisterInvitedUserMutation } = registerInvitedUserApi; 