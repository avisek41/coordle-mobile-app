import { apiSlice } from './apiSlice';
export { apiSlice };

// Export email check API
export { emailCheckApi, useCheckEmailStatusMutation } from './emailCheckApi';

// Export email verification API
export {
  emailVerificationApi,
  useSendEmailVerificationMutation,
} from './emailVerificationApi';

// Export login API
export { loginApi, useLoginMutation } from './loginApi';

// Export profile setup API
export { profileSetupApi, useSetupProfileMutation } from './profileSetupApi';

// Export profile options API
export {
  profileOptionsApi,
  useGetProfileOptionsQuery,
} from './profileOptionsApi';

// Export phone verification API
export {
  phoneVerificationApi,
  useSendPhoneCodeMutation,
  useVerifyPhoneCodeMutation,
} from './phoneVerificationApi';

// Export check user by phone API
export {
  checkUserByPhoneApi,
  useCheckUserByPhoneMutation,
} from './checkUserByPhoneApi';

// Export send login code API
export { sendLoginCodeApi, useSendLoginCodeMutation } from './sendLoginCodeApi';

// Export user profile API
export {
  userProfileApi,
  useGetCurrentUserProfileQuery,
  type ProfilePhoto,
  type UserProfileResponse,
} from './userProfileApi';

// Export profile photo API
export {
  profilePhotoApi,
  useUploadProfilePhotoMutation,
} from './profilePhotoApi';

// Export change password API
export {
  changePasswordApi,
  useChangePasswordMutation,
} from './changePasswordApi';

// Export document upload API
export {
  documentUploadApi,
  useUploadDocumentMutation,
} from './documentUploadApi';

// Export documents API
export {
  documentsApi,
  useGetDocumentsQuery,
  useLazyGetDocumentsQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  type Document,
  type DocumentsResponse,
  type DocumentsQueryParams,
  type UpdateDocumentRequest,
  type UpdateDocumentResponse,
  type DeleteDocumentRequest,
  type DeleteDocumentResponse,
} from './documentsApi';
