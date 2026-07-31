import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { AUTH_PATH } from "./path";

/**
 * Auth API endpoints
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Queries
    getMe: builder.query({
      query: () => ({
        url: AUTH_PATH.ME,
        method: "GET",
      }),
      providesTags: [{ type: API_TAGS.USER, id: "ME" }],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: AUTH_PATH.GET_ALL_USERS,
        method: "GET",
      }),
      providesTags: [{ type: API_TAGS.USER }],
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: AUTH_PATH.GET_SINGLE_USER(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: API_TAGS.USER, id }],
    }),
    // Mutations
    deleteUser: builder.mutation({
      query: (id) => ({
        url: AUTH_PATH.DELETE_USER(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: API_TAGS.USER }],
    }),
    updateMeInfo: builder.mutation({
      query: (body) => ({
        url: AUTH_PATH.UPDATE_ME_INFO,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: API_TAGS.USER, id: "ME" }],
    }),
    // Add other mutations as needed (updateMeEmail, updateMePassword, updateMeProfileImg)
  }),
});

// Export hooks for usage in components
export const {
  useGetMeQuery,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useDeleteUserMutation,
  useUpdateMeInfoMutation,
} = authApi;