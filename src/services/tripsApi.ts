import { apiSlice } from './apiSlice';
import { TripsResponse } from '@/src/types/trip';

export const tripsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTrips: builder.query<TripsResponse, void>({
      query: () => ({
        url: '/api/trips',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetTripsQuery } = tripsApi;
