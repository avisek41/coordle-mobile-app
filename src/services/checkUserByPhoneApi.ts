import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface CheckUserByPhoneRequest {
  phoneNumber: string;
}

export interface CheckUserByPhoneResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    action: 'login' | 'register' | 'verify_phone';
    exists: boolean;
    message: string;
    user: {
      id: string;
      name: string;
      phoneNumber: string;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
      isProfileSetup: boolean;
      userRole: string;
    };
  };
}

export const checkUserByPhoneApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    checkUserByPhone: builder.mutation<
      CheckUserByPhoneResponse,
      CheckUserByPhoneRequest
    >({
      query: body => ({
        url: API_ENDPOINTS.CHECK_USER_BY_PHONE,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCheckUserByPhoneMutation } = checkUserByPhoneApi;
