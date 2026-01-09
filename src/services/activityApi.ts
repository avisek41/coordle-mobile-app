import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '@/src/constant/apiConstant';

/**
 * Request payload for creating an activity
 */
export interface CreateActivityFormData {
  activity_name: string;
  reservation_date: string; // ISO 8601 date string
  startTime: string; // ISO 8601 date string
  endTime: string; // ISO 8601 date string
  trip_id: string;
  activity_type: string;
  phone?: string;
  website?: string;
  reservation_code?: string;
  tickets?: string;
  address?: string;
  notes?: string;
}

/**
 * Response data structure for activity
 */
export interface ActivityData {
  activity_name: string;
  reservation_date: string;
  startTime: string;
  endTime: string;
  phone?: string;
  website?: string;
  reservation_code?: string;
  tickets?: string;
  address?: string;
  notes?: string;
  activity_type: string;
  trip_id: string;
  owner_id: string;
  createdBy: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Response structure for create activity API
 */
export interface CreateActivityResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: ActivityData;
}

export const activityApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    /**
     * Create a new activity
     * @param activityData - The activity data to create
     * @returns CreateActivityResponse
     */
    createActivity: builder.mutation<
      CreateActivityResponse,
      CreateActivityFormData
    >({
      query: activityData => ({
        url: API_ENDPOINTS.ACTIVITIES,
        method: 'POST',
        body: activityData,
      }),
      invalidatesTags: ['Trips'],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateActivityMutation } = activityApi;

