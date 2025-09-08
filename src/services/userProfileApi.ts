import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface ProfilePhoto {
  url: string;
  publicId: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  uploadedAt: string;
}

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
    country_code?: string;
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
    currentPlan?: {
      planName: string;
      planVariant: string;
      price: number;
      currency: string;
      features: string[];
    };
    profilePhoto?: ProfilePhoto;
  };
}

export const userProfileApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCurrentUserProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.GET_CURRENT_USER_PROFILE,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useGetCurrentUserProfileQuery } = userProfileApi;
