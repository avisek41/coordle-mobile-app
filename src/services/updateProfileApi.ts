import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  preferredName?: string;
  phoneNumber?: string;
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
}

export interface UpdateProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data?: {
    id: string;
    email: string;
    isProfileSetup: boolean;
    profile: UpdateProfileRequest;
  };
}

export const updateProfileApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: body => ({
        url: API_ENDPOINTS.SETUP_PROFILE,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useUpdateProfileMutation } = updateProfileApi;
