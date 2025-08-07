import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface SendEmailVerificationRequest {
  email: string;
}

export interface SendEmailVerificationResponse {
  success: boolean;
  message: string;
}

export const emailVerificationApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    sendEmailVerification: builder.mutation<
      SendEmailVerificationResponse,
      SendEmailVerificationRequest
    >({
      query: body => ({
        url: API_ENDPOINTS.SEND_EMAIL_VERIFICATION,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendEmailVerificationMutation } = emailVerificationApi;
