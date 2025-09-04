import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface UserPlanFeatures {
  currentPlan: {
    planName: string;
    planVariant: string;
    price: number;
    currency: string;
    features: string[];
    allowedHost: number;
    trialDays: number;
    paymentDate: string;
    paymentStatus: string;
  };
}

export interface UserPlanResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: UserPlanFeatures;
}

export const userPlanApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUserPlan: builder.query<UserPlanResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.GET_USER_PLAN,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUserPlanQuery } = userPlanApi;
