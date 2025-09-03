import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface MemberProfilePhoto {
  uploadedAt: string;
  url: string;
}

export interface MemberProfileData {
  profilePhoto?: MemberProfilePhoto;
  _id: string;
  phoneNumber: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isProfileSetup: boolean;
  userRole: string;
  foodAllergies: string[];
  createdAt: string;
  updatedAt: string;
  ageDemographic: string;
  country: string;
  country_code: string;
  dietaryRestrictions: string;
  disabilityStatus: string;
  firstName: string;
  genderIdentity: string;
  lastName: string;
  postalCode: string;
  preferredAirport: string;
  preferredName: string;
  pronouns: string;
  racialEthnic: string;
  sexualOrientation: string;
  state: string;
  planId: string;
  email: string;
}

export interface MemberProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: MemberProfileData;
}

export const memberProfileApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMemberProfile: builder.query<MemberProfileResponse, string>({
      query: (userId: string) => ({
        url: `${API_ENDPOINTS.GET_MEMBER_PROFILE}/${userId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetMemberProfileQuery } = memberProfileApi;
