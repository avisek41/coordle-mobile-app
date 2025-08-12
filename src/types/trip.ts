export interface TripLocation {
  latitude: number;
  longitude: number;
}

export interface TripCoverImage {
  url: string;
  uploadedAt: string;
}

export interface TripOwner {
  ref: string;
}

export interface TripPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Trip {
  _id: string;
  name: string;
  author: string;
  owner: TripOwner;
  owner_id: string;
  photo_url: string;
  cover_image: TripCoverImage;
  display_start: string;
  display_end: string;
  start_date: string;
  end_date: string;
  to_address: string;
  to_location: TripLocation;
  from_address: string;
  from_location: TripLocation | null;
  chatId: string;
  activity_count: number;
  broadcast_count: number;
  food_order_count: number;
  group_chat_count: number;
  lodging_count: number;
  miss_count: number;
  travel_count: number;
  trip_chat_count: number;
  invite_count: number;
  hosts: string[];
  users: string[];
  lastest_host_by: string | null;
  lastest_host_remove_by: string | null;
  remove_by: string | null;
  createdAt: string;
  updatedAt: string;
  duration: string;
}

export interface TripsData {
  trips: Trip[];
  pagination: TripPagination;
}

export interface TripsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TripsData;
  timestamp: string;
} 