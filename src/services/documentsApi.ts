import { apiSlice } from './apiSlice';
import { API_ENDPOINTS } from '../constant/apiConstant';

export interface Document {
  _id: string;
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
  previewUrl: string;
  thumbnailUrl: string;
  isExpired: boolean;
  daysUntilExpiry: number | null;
}

export interface DocumentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    documents: Document[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface UpdateDocumentRequest {
  documentId: string;
  fileName: string;
}

export interface UpdateDocumentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: Document;
}

export interface DocumentsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const documentsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDocuments: builder.query<DocumentsResponse, DocumentsQueryParams>({
      query: (params = {}) => {
        console.log('Documents API params:', params);
        console.log(
          'API_ENDPOINTS.GET_DOCUMENTS:',
          API_ENDPOINTS.GET_DOCUMENTS,
        );

        return {
          url: API_ENDPOINTS.GET_DOCUMENTS,
          method: 'GET',
          params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.search && { search: params.search }),
          },
        };
      },
      providesTags: ['Documents'],
    }),
    updateDocument: builder.mutation<
      UpdateDocumentResponse,
      UpdateDocumentRequest
    >({
      query: ({ documentId, fileName }) => ({
        url: `${API_ENDPOINTS.UPDATE_DOCUMENT}/${documentId}`,
        method: 'PUT',
        body: {
          fileName,
        },
      }),
      invalidatesTags: ['Documents'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDocumentsQuery,
  useLazyGetDocumentsQuery,
  useUpdateDocumentMutation,
} = documentsApi;
