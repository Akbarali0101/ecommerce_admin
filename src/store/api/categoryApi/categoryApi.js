import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { CATEGORY_PATH } from "./path";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: CATEGORY_PATH.GET_ALL,
        method: "GET",
      }),
      transformResponse: (response) => response?.data || response || [],
      providesTags: [API_TAGS.CATEGORY],
    }),

    createCategory: builder.mutation({
      query: (body) => ({
        url: CATEGORY_PATH.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: CATEGORY_PATH.UPDATE(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: CATEGORY_PATH.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.CATEGORY],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;