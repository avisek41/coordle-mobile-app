import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface ProfileOptionsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    ageDemographic: string[];
    dietaryRestrictions: string[];
    disabilityStatus: string[];
    foodAllergies: string[];
    genderIdentity: string[];
    pronouns: string[];
    racialEthnic: string[];
    sexualOrientation: string[];
  };
}

export const profileOptionsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfileOptions: builder.query<ProfileOptionsResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.PROFILE_OPTIONS,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetProfileOptionsQuery } = profileOptionsApi;
