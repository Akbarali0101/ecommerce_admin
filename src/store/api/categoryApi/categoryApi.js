import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { CATEGORY_PATH } from "./path";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => CATEGORY_PATH.GET_ALL,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((c) => ({ type: API_TAGS.CATEGORY, id: c._id })),
              { type: API_TAGS.CATEGORY, id: "LIST" },
            ]
          : [{ type: API_TAGS.CATEGORY, id: "LIST" }],
    }),

    getSingleCategory: builder.query({
      query: (id) => CATEGORY_PATH.GET_SINGLE(id),
      providesTags: (_r, _e, id) => [{ type: API_TAGS.CATEGORY, id }],
    }),

    createCategory: builder.mutation({
      query: (body) => ({ url: CATEGORY_PATH.CREATE, method: "POST", body }),
      invalidatesTags: [{ type: API_TAGS.CATEGORY, id: "LIST" }],
    }),

    updateCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: CATEGORY_PATH.UPDATE(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: API_TAGS.CATEGORY, id },
        { type: API_TAGS.CATEGORY, id: "LIST" },
      ],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({ url: CATEGORY_PATH.DELETE(id), method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: API_TAGS.CATEGORY, id },
        { type: API_TAGS.CATEGORY, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
