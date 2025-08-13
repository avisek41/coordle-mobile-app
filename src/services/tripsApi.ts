import { apiSlice } from './apiSlice';
import { TripsResponse, Trip } from '@/src/types/trip';

export interface CreateTripFormData {
  name: string;
  to_address: string;
  to_location_latitude: number;
  to_location_longitude: number;
  from_address: string;
  from_location_latitude?: number;
  from_location_longitude?: number;
  display_start: string;
  display_end: string;
  start_date: string;
  end_date: string;
  coverImage?: any; // File object for FormData
}

export interface CreateTripResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Trip;
  timestamp: string;
}

export interface TripResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Trip;
  timestamp: string;
}

export const tripsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTrips: builder.query<TripsResponse, { status?: string } | void>({
      query: (params) => ({
        url: '/api/trips',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['Trips'],
    }),
    createTrip: builder.mutation<CreateTripResponse, FormData>({
      query: formData => ({
        url: '/api/trips',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['Trips'],
    }),
    getTripById: builder.query<TripResponse, string>({
      query: (tripId) => ({
        url: `/api/trips/${tripId}`,
        method: 'GET',
      }),
      providesTags: (result, error, tripId) => [{ type: 'Trips', id: tripId }],
    }),
    updateTrip: builder.mutation<CreateTripResponse, { tripId: string; formData: FormData }>({
      query: ({ tripId, formData }) => ({
        url: `/api/trips/${tripId}`,
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['Trips'],
    }),
    deleteTrip: builder.mutation<{ success: boolean; message: string }, string>({
      query: (tripId) => ({
        url: `/api/trips/${tripId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Trips'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetTripsQuery, useCreateTripMutation, useGetTripByIdQuery, useUpdateTripMutation, useDeleteTripMutation } = tripsApi;
