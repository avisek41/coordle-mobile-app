// Restaurant interface for meal
export interface Restaurant {
  name: string;
  link: string;
}

// Base Meal interface matching backend model
export interface Meal {
  _id: string;
  meal_date: string;
  meal_type: string;
  order_deadline_date_time: string;
  restaurants: Restaurant[];
  trip_id: string;
  createdBy: {
    email: string;
    preferredName: string;
    profilePhotoURL: string;
  };
  reminders?: number[];
  food_order?: IFoodOrder[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MealPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface MealsData {
  meals: Meal[];
  pagination: MealPagination;
}

export interface MealsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: MealsData;
  timestamp: string;
}
// Define the FoodOrder interface
export interface IFoodOrder {
  meal: string;
  name: string;
  userId: string;
  _id: string;
  user?: {
    _id: string;
    email: string;
    preferredName: string;
    profilePhotoURL: string;
  };
}

export interface CreateMealFormData {
  meal_date: string;
  meal_type: string;
  order_deadline_date_time: string;
  restaurants: Restaurant[];
  trip_id: string;
  reminders?: number[];
  createdBy: string;
}

export interface UpdateMealFormData {
  meal_date?: string;
  meal_type?: string;
  order_deadline_date_time?: string;
  restaurants?: Restaurant[];
  reminders?: number[];
  food_order?: IFoodOrder[];
}

export interface CreateMealResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Meal;
  timestamp: string;
}

export interface GetMealsByTripParams {
  tripId: string;
  page?: number;
  limit?: number;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'PreGame' | 'PostGameDinner' | 'Snack';

// Submit meal order types
export interface SubmitMealOrderFormData {
  mealId: string;
  name: string;
  userId: string;
  meal: string;
}

export interface SubmitMealOrderResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: Meal;
}

// Update meal order types
export interface UpdateMealOrderFormData {
  mealId: string;
  orderId: string;
  name: string;
  meal: string;
}

export interface UpdateMealOrderResponse {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data: Meal;
}

