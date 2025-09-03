export interface User {
  _id: string;
  email: string;
  userRole: string;
  createdAt: string;
  phoneNumber: string;
  inviteType?: 'email' | 'phone';
}

export interface PlanOwner {
  id: string;
  email: string;
  phoneNumber: string;
  userRole: string;
}

export interface Plan {
  planId: string;
  planName: string;
  planVariant: string;
  price: number;
  currency: string;
  features: string[];
}

export interface PlanSummary {
  totalUsers: number;
  planId: string;
}

export interface SamePlanUsersData {
  owner: PlanOwner;
  plan: Plan;
  users: User[];
  summary: PlanSummary;
}

export interface SamePlanUsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: SamePlanUsersData;
} 