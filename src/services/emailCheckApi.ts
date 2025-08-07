import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '@/src/constant/apiConstant';

export interface EmailCheckApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    action: 'login' | 'register' | 'verify_email';
    message: string;
    email: string;
    userId: string;
  };
}

// Defining the emailCheckApi using the injectEndpoints method from apiSlice
export const emailCheckApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    checkEmailStatus: builder.mutation<EmailCheckApiResponse, string>({
      query: email => {
        return {
          url: API_ENDPOINTS.CHECK_EMAIL_STATUS,
          method: 'POST',
          body: { email },
        };
      },
    }),
  }),
});

export const { useCheckEmailStatusMutation } = emailCheckApi;
