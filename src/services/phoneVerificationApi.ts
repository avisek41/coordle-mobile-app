import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface SendPhoneCodeRequest {
  phoneNumber: string;
}

export interface SendPhoneCodeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data?: {
    code: string;
    phoneNumber: string;
  };
}

export interface VerifyPhoneCodeRequest {
  phoneNumber: string;
  code: string;
}

export interface VerifyPhoneCodeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    phoneNumber: string;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isProfileSetup: boolean;
    userId: string;
    token: string;
  };
}

export const phoneVerificationApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    sendPhoneCode: builder.mutation<
      SendPhoneCodeResponse,
      SendPhoneCodeRequest
    >({
      query: body => ({
        url: API_ENDPOINTS.SEND_PHONE_CODE,
        method: 'POST',
        body,
      }),
    }),
    verifyPhoneCode: builder.mutation<
      VerifyPhoneCodeResponse,
      VerifyPhoneCodeRequest
    >({
      query: body => ({
        url: API_ENDPOINTS.VERIFY_PHONE_CODE,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendPhoneCodeMutation, useVerifyPhoneCodeMutation } =
  phoneVerificationApi;
