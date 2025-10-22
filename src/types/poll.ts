// Define the Vote interface to match backend
export interface IVote {
  userId: string; // ObjectId as string in frontend
  selectedOptionText: string[]; // Array of selected option texts
  votedAt: Date;
}

// Poll option structure for API responses (when votes are aggregated)
export interface PollOptionWithVotes {
  text: string;
  vote_count: number;
  is_selected_by_user?: boolean;
  voters: Array<{
    _id: string;
    preferredName: string;
    profilePhotoURL: string;
    votedAt?: string;
  }>;
}

// Base Poll interface matching backend model
export interface Poll {
  _id: string;
  question: string;
  options: string[]; // Backend stores options as string array
  allow_multi_answers?: boolean;
  published?: boolean;
  owner_id?: string;
  createdBy: {
    email: string;
    preferredName: string;
    profilePhotoURL: string; },
  trip_id: string;
  status: 'Active' | 'Closed';
  close_poll_date_time: string;
  display_close_poll_date?: string;
  display_close_poll_time?: string;
  reminders?: number[];
  votes?: IVote[]; // Array of votes
  createdAt: Date;
  updatedAt: Date;
  duration?: string; // Virtual field from backend
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
  display_close_poll_date?: string;
  display_close_poll_time?: string;
  reminders?: number[];
}

export interface UpdatePollFormData {
  question?: string;
  options?: string[];
  allow_multi_answers?: boolean;
  published?: boolean;
  status?: 'Active' | 'Closed';
  close_poll_date_time?: string;
  display_close_poll_date?: string;
  display_close_poll_time?: string;
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

// Voting related types
export interface VoteOnPollRequest {
  userId: string;
  selectedOptionTexts: string[];
}

// Response type for voteOnPoll endpoint (returns poll with aggregated vote data)
export interface VoteOnPollResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Poll & {
    options: PollOptionWithVotes[];
    total_voters?: number;
    trip_members_count?: number;
  };
  timestamp: string;
}

// Response type for getPollVotes endpoint (returns poll with detailed vote information)
export interface GetPollVotesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Poll & {
    options: PollOptionWithVotes[];
    total_voters: number;
    trip_members_count: number;
  };
  timestamp: string;
}