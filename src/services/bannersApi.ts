import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface Banner {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BannersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: Banner[];
}

export const bannersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBanners: builder.query<BannersResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.GET_BANNERS,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetBannersQuery } = bannersApi;
