import { apiSlice } from './apiSlice';

export interface CreateAnnouncementRequest {
  message: string;
}

export interface Announcement {
  _id: string;
  message: string;
  tripId: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
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
    getAnnouncements: builder.query<Announcement[], string>({
      query: tripId => `/api/trips/${tripId}/announcements`,
      providesTags: ['Announcements'],
    }),
  }),
});

export const { useCreateAnnouncementMutation, useGetAnnouncementsQuery } =
  announcementsApi;
