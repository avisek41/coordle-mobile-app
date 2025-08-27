import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: null;
  token: string | null;
  isLoggedIn: boolean | null;
  refreshToken: string | null;
  userId: string | null;
  userRole: string | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoggedIn: false,
    refreshToken: null,
    userId: null,
    userRole: null,
  } as AuthState,
  reducers: {
    setCredentials: (state, action) => {
      //   console.log('payload', action?.payload);
      const { token, refreshToken, userId, userRole } = action.payload;

      state.token = token;
      state.refreshToken = refreshToken;
      state.userId = userId;
      state.userRole = userRole;
    },
    logOut: state => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.refreshToken = null;
      state.userId = null;
      state.userRole = null;
    },
    logIn: state => {
      state.isLoggedIn = true;
    },
  },
});

export const { setCredentials, logOut, logIn } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.user;
export const selectCurrentToken = (state: any) => state.auth.token;
export const selectCurrentUserId = (state: any) => state.auth.userId;
