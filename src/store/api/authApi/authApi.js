import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { AUTH_PATH } from "./path";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin login. Backend javobi: { success, data: { token, user } }
    login: builder.mutation({
      query: (body) => ({ url: AUTH_PATH.LOGIN, method: "POST", body }),
      // Token kelganda localStorage ga saqlab qo'yamiz — boshqa so'rovlarda
      // baseApi.prepareHeaders uni avtomatik o'qib Bearer header qo'shadi.
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.token;
          if (token) localStorage.setItem("token", token);
        } catch {
          // xato bo'lsa token saqlanmaydi
        }
      },
    }),

    signupAdmin: builder.mutation({
      query: (body) => ({ url: AUTH_PATH.SIGNUP_ADMIN, method: "POST", body }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.token;
          if (token) localStorage.setItem("token", token);
        } catch {
          /* noop */
        }
      },
    }),

    signup: builder.mutation({
      query: (body) => ({ url: AUTH_PATH.SIGNUP, method: "POST", body }),
    }),

    getMe: builder.query({
      query: () => AUTH_PATH.ME,
      providesTags: [API_TAGS.USER],
    }),

    getAllUsers: builder.query({
      query: (params) => ({
        url: AUTH_PATH.GET_ALL_USERS,
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((u) => ({ type: API_TAGS.USER, id: u._id })),
              { type: API_TAGS.USER, id: "LIST" },
            ]
          : [{ type: API_TAGS.USER, id: "LIST" }],
    }),

    getSingleUser: builder.query({
      query: (id) => AUTH_PATH.GET_SINGLE_USER(id),
      providesTags: (_r, _e, id) => [{ type: API_TAGS.USER, id }],
    }),

    updateMeInfo: builder.mutation({
      query: (body) => ({ url: AUTH_PATH.UPDATE_ME_INFO, method: "PATCH", body }),
      invalidatesTags: [API_TAGS.USER],
    }),

    updateMeEmail: builder.mutation({
      query: (body) => ({ url: AUTH_PATH.UPDATE_ME_EMAIL, method: "PATCH", body }),
      invalidatesTags: [API_TAGS.USER],
    }),

    updateMePassword: builder.mutation({
      query: (body) => ({ url: AUTH_PATH.UPDATE_ME_PASSWORD, method: "PATCH", body }),
    }),

    updateMeProfileImg: builder.mutation({
      query: (body) => ({ url: AUTH_PATH.UPDATE_ME_PROFILE_IMG, method: "PATCH", body }),
      invalidatesTags: [API_TAGS.USER],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({ url: AUTH_PATH.DELETE_USER(id), method: "DELETE" }),
      invalidatesTags: [{ type: API_TAGS.USER, id: "LIST" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupAdminMutation,
  useSignupMutation,
  useGetMeQuery,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateMeInfoMutation,
  useUpdateMeEmailMutation,
  useUpdateMePasswordMutation,
  useUpdateMeProfileImgMutation,
  useDeleteUserMutation,
} = authApi;
