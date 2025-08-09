import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    updatedAt: string;
  };
}

export const changePasswordApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: body => ({
        url: API_ENDPOINTS.CHANGE_PASSWORD,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = changePasswordApi;
