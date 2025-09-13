import { apiSlice } from './apiSlice';

export interface BulkUserData {
  _id: string; // API returns _id instead of userId
  userId?: string; // Keep for backward compatibility
  email: string;
  phoneNumber: string | null;
  userRole: string;
  inviteType: string;
  preferredName: string;
  // Additional user profile data
  pronouns?: string; // Added to match code usage
  pronoun?: string;
  photoUrl?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  genderIdentity?: string; // Added to match code usage
  ageDemographic?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  country_code?: string; // Added to match code usage
  dietaryRestriction?: string;
  dietaryRestrictions?: string; // Added to match code usage
  disabilityStatus?: string;
  ethnicBackground?: string;
  racialEthnic?: string; // Added to match code usage
  foodAllergy?: string;
  foodAllergies?: string[]; // Added to match code usage
  sexualOrientation?: string; // Added to match code usage
  preferredAirport?: string;
  userType?: string;
  // Additional API fields
  profilePhoto?: any;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  isProfileSetup?: boolean;
}

export interface BulkUsersRequest {
  userIds: string[];
}

export interface BulkUsersResponse {
  success: boolean;
  data: {
    users: BulkUserData[];
  };
  message: string;
}

export const bulkUsersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBulkUsers: builder.query<BulkUsersResponse, BulkUsersRequest>({
      query: body => ({
        url: '/api/users/bulk',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetBulkUsersQuery, useLazyGetBulkUsersQuery } = bulkUsersApi;
