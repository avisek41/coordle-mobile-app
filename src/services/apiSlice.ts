import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { RootState } from '../redux/Store';
import { BASE_URL } from '../configs';
import { getItem, setItem, removeItem } from '../utils';
import { logOut, setCredentials } from '../features';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,

  prepareHeaders: (
    headers: Headers,
    { getState }: { getState: () => unknown },
  ) => {
    const state = getState() as RootState;
    const token = getItem('accessToken');
    console.log('token', token);
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
const baseQueryWithReauth = async (
  args?: any, // Arguments for the query
  api?: any, // API object (possibly Redux store or similar)
  extraOptions?: any, // Extra options for the query
) => {
  console.log('args>>', args);
  // full url = base url + end point

  console.log('api>>', api);
  // Make the initial query
  let result = await baseQuery(args, api, extraOptions);

  return result; // Return the result of the query
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Profile',
    'Documents',
    'Trips',
    'TripDocuments',
    'TripMembers',
    'Announcements',
  ],
  endpoints: builder => ({}),
});

// https://coordle-backend-4.onrender.com/api/trips
// https://coordle-backend-4.onrender.com/api/trips
