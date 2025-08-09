import { API_ENDPOINTS } from '../constant/apiConstant';
import { apiSlice } from './apiSlice';

export interface ProfilePhotoUploadResponse {
  success: boolean;
  message: string;
  data: {
    profilePhotoUrl: string;
    userId: string;
    updatedAt: string;
  };
}

export const profilePhotoApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    uploadProfilePhoto: builder.mutation<ProfilePhotoUploadResponse, FormData>({
      query: formData => ({
        url: API_ENDPOINTS.PROFILE_PHOTO_UPLOAD,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['User'], // This will refetch user profile data after upload
    }),
  }),
});

export const { useUploadProfilePhotoMutation } = profilePhotoApi;
