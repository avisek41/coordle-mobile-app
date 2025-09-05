import { apiSlice } from './apiSlice';

export interface CreateAnnouncementRequest {
  message: string;
}

export interface CreatedBy {
  _id: string;
  email: string;
  preferredName: string;
}

export interface Announcement {
  _id: string;
  tripId: string;
  createdBy: CreatedBy;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetAnnouncementsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    announcements: Announcement[];
    pagination: Pagination;
  };
}

export interface CreateAnnouncementResponse {
  success: boolean;
  message: string;
  data: Announcement;
}

export const announcementsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createAnnouncement: builder.mutation<
      CreateAnnouncementResponse,
      { tripId: string; announcement: CreateAnnouncementRequest }
    >({
      query: ({ tripId, announcement }) => ({
        url: `/api/trips/${tripId}/announcements`,
        method: 'POST',
        body: announcement,
      }),
      invalidatesTags: ['Announcements'],
    }),
    getAnnouncements: builder.query<
      GetAnnouncementsResponse,
      { tripId: string; page?: number; limit?: number }
    >({
      query: ({ tripId, page = 1, limit = 10 }) => ({
        url: `/api/trips/${tripId}/announcements`,
        params: { page, limit },
      }),
      providesTags: ['Announcements'],
    }),
  }),
});

export const { useCreateAnnouncementMutation, useGetAnnouncementsQuery } =
  announcementsApi;
