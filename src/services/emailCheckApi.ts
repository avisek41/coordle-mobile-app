import { apiSlice } from './apiSlice';

// Defining the emailCheckApi using the injectEndpoints method from apiSlice
export const emailCheckApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    checkEmailStatus: builder.mutation({
      query: email => ({
        url: '/api/users/check-email-status',
        method: 'POST',
        body: { email },
      }),
    }),
  }),
});

export const { useCheckEmailStatusMutation } = emailCheckApi;
