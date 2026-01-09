import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '@/src/constant/apiConstant';

/**
 * Request payload for creating a lodging
 */
export interface CreateLodgingFormData {
  lodging_name: string;
  check_in: string; // ISO 8601 date string
  check_out: string; // ISO 8601 date string
  trip_id: string;
  phone?: string;
  website?: string;
  reservation_code?: string;
  address?: string;
  notes?: string;
}

/**
 * Response data structure for lodging
 */
export interface LodgingData {
  lodging_name: string;
  check_in: string;
  check_out: string;
  phone?: string;
  website?: string;
  reservation_code?: string;
  address?: string;
  notes?: string;
  trip_id: string;
  owner_id: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Response structure for create lodging API
 */
export interface CreateLodgingResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: LodgingData;
}

export const lodgingApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    /**
     * Create a new lodging
     * @param lodgingData - The lodging data to create
     * @returns CreateLodgingResponse
     */
    createLodging: builder.mutation<
      CreateLodgingResponse,
      CreateLodgingFormData
    >({
      query: lodgingData => ({
        url: API_ENDPOINTS.LODGING,
        method: 'POST',
        body: lodgingData,
      }),
      invalidatesTags: ['Trips'],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateLodgingMutation } = lodgingApi;

