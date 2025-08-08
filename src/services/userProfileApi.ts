import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface UserProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    preferredName?: string;
    phoneNumber: string;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isProfileSetup: boolean;
    userRole: string;
    createdAt: string;
    updatedAt: string;
    // Profile fields (if profile is set up)
    pronouns?: string;
    country?: string;
    state?: string;
    postalCode?: string;
    preferredAirport?: string;
    racialEthnic?: string;
    ageDemographic?: string;
    foodAllergies?: string[];
    dietaryRestrictions?: string;
    genderIdentity?: string;
    sexualOrientation?: string;
    disabilityStatus?: string;
  };
}

export const userProfileApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCurrentUserProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.GET_CURRENT_USER_PROFILE,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCurrentUserProfileQuery } = userProfileApi;
