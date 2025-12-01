import { apiSlice } from './apiSlice';
import {
  MealsResponse,
  CreateMealFormData,
  UpdateMealFormData,
  CreateMealResponse,
  GetMealsByTripParams,
  SubmitMealOrderFormData,
  SubmitMealOrderResponse,
  UpdateMealOrderFormData,
  UpdateMealOrderResponse,
} from '@/src/types/meal';
import { API_ENDPOINTS } from '@/src/constant/apiConstant';

export const mealApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Get meals by trip ID
    getMealsByTrip: builder.query<MealsResponse, GetMealsByTripParams>({
      query: ({ tripId, ...params }) => ({
        url: `${API_ENDPOINTS.MEAL}/trip/${tripId}`,
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: (result, error, { tripId }) => [
        { type: 'Meals', id: tripId },
        'Meals',
      ],
    }),

    // Create a new meal
    createMeal: builder.mutation<CreateMealResponse, CreateMealFormData>({
      query: mealData => ({
        url: API_ENDPOINTS.MEAL,
        method: 'POST',
        body: mealData,
      }),
      invalidatesTags: ['Meals'],
    }),

    // Update meal
    updateMeal: builder.mutation<
      CreateMealResponse,
      { mealId: string; mealData: UpdateMealFormData }
    >({
      query: ({ mealId, mealData }) => ({
        url: `${API_ENDPOINTS.MEAL}/${mealId}`,
        method: 'PUT',
        body: mealData,
      }),
      invalidatesTags: (result, error, { mealId }) => [
        { type: 'Meals', id: mealId },
        'Meals',
      ],
    }),

    // Delete meal
    deleteMeal: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: mealId => ({
        url: `${API_ENDPOINTS.MEAL}/${mealId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, mealId) => [
        { type: 'Meals', id: mealId },
        'Meals',
      ],
    }),

    // Get meal by ID
    getMealById: builder.query<CreateMealResponse, string>({
      query: mealId => ({
        url: `${API_ENDPOINTS.MEAL}/${mealId}`,
        method: 'GET',
      }),
      providesTags: (result, error, mealId) => [
        { type: 'Meals', id: mealId },
        'Meals',
      ],
    }),

    // Submit meal order
    submitMealOrder: builder.mutation<SubmitMealOrderResponse, SubmitMealOrderFormData>({
      query: ({ mealId, name, userId, meal }) => ({
        url: `${API_ENDPOINTS.MEAL}/${mealId}/order`,
        method: 'POST',
        body: {
          name,
          userId,
          meal,
        },
      }),
      invalidatesTags: (result, error, { mealId }) => [
        { type: 'Meals', id: mealId },
        'Meals',
      ],
    }),

    // Update meal order
    updateMealOrder: builder.mutation<UpdateMealOrderResponse, UpdateMealOrderFormData>({
      query: ({ mealId, orderId, name, meal }) => ({
        url: `${API_ENDPOINTS.MEAL}/${mealId}/order/${orderId}`,
        method: 'PUT',
        body: {
          name,
          meal,
        },
      }),
      invalidatesTags: (result, error, { mealId }) => [
        { type: 'Meals', id: mealId },
        'Meals',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMealsByTripQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
  useGetMealByIdQuery,
  useSubmitMealOrderMutation,
  useUpdateMealOrderMutation,
} = mealApi;

