import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface ProfileSetupRequest {
  firstName: string;
  lastName: string;
  preferredName?: string;
  phoneNumber: string;
  country_code?: string;
  pronouns?: string;
  country: string;
  state: string;
  postalCode: string;
  preferredAirport?: string;
  racialEthnic?: string;
  ageDemographic?: string;
  foodAllergies?: string[];
  dietaryRestrictions?: string;
  genderIdentity?: string;
  sexualOrientation?: string;
  disabilityStatus?: string;
}

export interface ProfileSetupResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data?: {
    id: string;
    email: string;
    isProfileSetup: boolean;
    profile: ProfileSetupRequest;
  };
}

export const profileSetupApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    setupProfile: builder.mutation<ProfileSetupResponse, ProfileSetupRequest>({
      query: body => ({
        url: API_ENDPOINTS.SETUP_PROFILE,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useSetupProfileMutation } = profileSetupApi;
