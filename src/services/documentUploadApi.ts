import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  data?: {
    documentId: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
    documentUrl: string;
  };
}

export const documentUploadApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    uploadDocument: builder.mutation<DocumentUploadResponse, FormData>({
      query: formData => ({
        url: API_ENDPOINTS.DOCUMENT_UPLOAD,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Documents'],
    }),
  }),
});

export const { useUploadDocumentMutation } = documentUploadApi;
