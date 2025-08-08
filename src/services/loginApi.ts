import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface LoginRequest {
  email?: string;
  password?: string;
  phoneNumber?: string;
  verificationCode?: string;
  loginMethod: 'email' | 'phone';
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    id: string;
    email: string;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isProfileSetup: boolean;
    userRole: string;
    createdAt: string;
    token: string;
  };
}

export const loginApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: API_ENDPOINTS.LOGIN,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = loginApi;
