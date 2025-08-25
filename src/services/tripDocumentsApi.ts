import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface TripDocument {
  _id: string;
  tripId: string;
  userId: string;
  fileUrl: string;
  publicId: string;
  fileSize: number;
  mimeType: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fileName: string;
  originalFileName: string;
  previewUrl: string;
  thumbnailUrl: string;
  isExpired: boolean;
  daysUntilExpiry: number | null;
}

export interface TripDocumentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    documents: TripDocument[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface UpdateTripDocumentRequest {
  tripId: string;
  documentId: string;
  originalFileName: string;
}

export interface UpdateTripDocumentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: TripDocument;
}

export interface DeleteTripDocumentRequest {
  tripId: string;
  documentId: string;
}

export interface DeleteTripDocumentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    deletedDocument: TripDocument;
  };
}

export interface TripDocumentsQueryParams {
  tripId: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const tripDocumentsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTripDocuments: builder.query<
      TripDocumentsResponse,
      TripDocumentsQueryParams
    >({
      query: ({ tripId, ...params }) => {
        console.log('Trip Documents API params:', { tripId, ...params });

        return {
          url: `/api/trips/${tripId}/documents`,
          method: 'GET',
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.search && { search: params.search }),
          },
        };
      },
      providesTags: (result, error, { tripId }) => [
        { type: 'TripDocuments', id: tripId },
        { type: 'TripDocuments', id: 'LIST' },
      ],
    }),
    uploadTripDocument: builder.mutation<
      any,
      { tripId: string; formData: FormData }
    >({
      query: ({ tripId, formData }) => ({
        url: `/api/trips/${tripId}/documents`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: 'TripDocuments', id: tripId },
        { type: 'TripDocuments', id: 'LIST' },
      ],
    }),
    updateTripDocument: builder.mutation<
      UpdateTripDocumentResponse,
      UpdateTripDocumentRequest
    >({
      query: ({ tripId, documentId, originalFileName }) => ({
        url: `/api/trips/${tripId}/documents/${documentId}`,
        method: 'PUT',
        body: {
          originalFileName,
        },
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: 'TripDocuments', id: tripId },
        { type: 'TripDocuments', id: 'LIST' },
      ],
    }),
    deleteTripDocument: builder.mutation<
      DeleteTripDocumentResponse,
      DeleteTripDocumentRequest
    >({
      query: ({ tripId, documentId }) => ({
        url: `/api/trips/${tripId}/documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: 'TripDocuments', id: tripId },
        { type: 'TripDocuments', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTripDocumentsQuery,
  useLazyGetTripDocumentsQuery,
  useUploadTripDocumentMutation,
  useUpdateTripDocumentMutation,
  useDeleteTripDocumentMutation,
} = tripDocumentsApi;
