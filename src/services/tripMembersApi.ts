import { apiSlice } from './apiSlice';

interface TripMember {
  userId: string;
  email: string;
  phoneNumber: string | null;
  userRole: string;
}

interface TripMembersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    tripId: string;
    tripName: string;
    members: TripMember[];
    totalMembers: number;
  };
}

export const tripMembersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTripMembers: builder.query<TripMembersResponse, string>({
      query: tripId => `/api/trips/${tripId}/members`,
    }),
  }),
});

export const { useGetTripMembersQuery } = tripMembersApi;
