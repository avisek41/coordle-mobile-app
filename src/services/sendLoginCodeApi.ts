import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface SendLoginCodeRequest {
  phoneNumber: string;
}

export interface SendLoginCodeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data?: {
    phoneNumber: string;
    code: string;
  };
}

export const sendLoginCodeApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    sendLoginCode: builder.mutation<
      SendLoginCodeResponse,
      SendLoginCodeRequest
    >({
      query: body => ({
        url: API_ENDPOINTS.SEND_LOGIN_CODE,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendLoginCodeMutation } = sendLoginCodeApi;
