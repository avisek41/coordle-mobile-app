import { apiSlice } from './apiSlice';

export interface PaymentPlan {
  _id: string;
  planName: string;
  price: number;
  currency: string;
  features: string[];
  allowedHost: number;
  trialDays: number;
}

export interface Payment {
  _id: string;
  userId: string;
  planId: PaymentPlan;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  stripePaymentIntentId: string;
}

export interface PaymentHistoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    payments: Payment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export const paymentHistoryApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPaymentHistory: builder.query<
      PaymentHistoryResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/api/payments/history?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetPaymentHistoryQuery } = paymentHistoryApi;
