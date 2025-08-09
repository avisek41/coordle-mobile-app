import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { RootState } from '../redux/Store';
import { BASE_URL } from '../configs';
import { getItem, setItem } from '../utils';
import { logOut, setCredentials } from '../features';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,

  prepareHeaders: (
    headers: Headers,
    { getState }: { getState: () => unknown },
  ) => {
    const state = getState() as RootState;
    const auth = state.auth as { token: string | null };
    const { token } = auth;
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
  //   console.log('args>>', args);
  //   console.log('api>>', api);
  // Make the initial query
  let result = await baseQuery(args, api, extraOptions);
  console.log('result', result);

  // Check if the result contains an error with status code 401 (Unauthorized)
  if (result?.error?.status === 401) {
    console.log('Access token expired or invalid, logging out user');
    // Since there's no refresh token, simply log out the user when access token is invalid
    api.dispatch(logOut());
    setItem('isLoggedIn', 'false');
    setItem('accessToken', '');
  }

  return result; // Return the result of the query
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Profile'],
  endpoints: builder => ({}),
});
