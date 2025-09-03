import { apiSlice } from './apiSlice';
import { SamePlanUsersResponse } from '../types/user';

export const samePlanUsersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSamePlanUsers: builder.query<SamePlanUsersResponse, string>({
      query: (ownerId: string) => `/api/users/same-plan/${ownerId}`,
    }),
  }),
});

export const { useGetSamePlanUsersQuery } = samePlanUsersApi;
