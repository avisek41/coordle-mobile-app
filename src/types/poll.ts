export interface Poll {
  _id: string;
  question: string;
  options: string[];
  allow_multi_answers: boolean;
  published: boolean;
  owner_id: string;
  trip_id: string;
  status: 'Active' | 'Closed';
  close_poll_date_time: string;
  display_poll_date: string;
  display_poll_time: string;
  reminders: number[];
  createdBy: {
    preferredName: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePhotoURL: string;
  };
  createdAt: string;
  updatedAt: string;
  duration?: string;
}

export interface PollPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PollsData {
  polls: Poll[];
  pagination: PollPagination;
}

export interface PollsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PollsData;
  timestamp: string;
}

export interface PollResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Poll;
  timestamp: string;
}

export interface CreatePollFormData {
  question: string;
  options: string[];
  allow_multi_answers?: boolean;
  published?: boolean;
  status?: 'Active' | 'Closed';
  trip_id: string;
  close_poll_date_time?: string;
  display_poll_date?: string;
  display_poll_time?: string;
  reminders?: number[];
}

export interface UpdatePollFormData {
  question?: string;
  options?: string[];
  allow_multi_answers?: boolean;
  published?: boolean;
  status?: 'Active' | 'Closed';
  close_poll_date_time?: string;
  display_poll_date?: string;
  display_poll_time?: string;
  reminders?: number[];
}

export interface CreatePollResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Poll;
  timestamp: string;
}

export interface GetPollsByTripParams {
  tripId: string;
  page?: number;
  limit?: number;
  status?: string;
  published?: boolean;
}

export interface GetAllPollsParams {
  page?: number;
  limit?: number;
  status?: string;
  published?: boolean;
  trip_id?: string;
}