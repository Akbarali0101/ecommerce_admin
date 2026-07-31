import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { AUTH_PATH } from "./path";

/**
 * Auth API endpoints
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // MUTATIONS (Auth & Management)
    // ==========================================

    // Admin login: Token kelganda localStorage'ga saqlaydi
    login: builder.mutation({
      query: (body) => ({ 
        url: AUTH_PATH.LOGIN, 
        method: "POST", 
        body 
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.token;
          if (token) localStorage.setItem("admin_token", token);
        } catch {
          /* Token saqlanmadi */
        }
      },
    }),

    // Admin ro'yxatdan o'tishi
    signupAdmin: builder.mutation({
      query: (body) => ({ 
        url: AUTH_PATH.SIGNUP_ADMIN, 
        method: "POST", 
        body 
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.token;
          if (token) localStorage.setItem("admin_token", token);
        } catch {
          /* Token saqlanmadi */
        }
      },
    }),

    // Oddiy foydalanuvchi ro'yxatdan o'tishi
    signup: builder.mutation({
      query: (body) => ({ 
        url: AUTH_PATH.SIGNUP, 
        method: "POST", 
        body 
      }),
    }),

    // Profil ma'lumotlarini yangilash
    updateMeInfo: builder.mutation({
      query: (body) => ({ 
        url: AUTH_PATH.UPDATE_ME_INFO, 
        method: "PATCH", 
        body 
      }),
      invalidatesTags: [{ type: API_TAGS.USER, id: "ME" }],
    }),

    // Emailni yangilash
    updateMeEmail: builder.mutation({
      query: (body) => ({ 
        url: AUTH_PATH.UPDATE_ME_EMAIL, 
        method: "PATCH", 
        body 
      }),
      invalidatesTags: [{ type: API_TAGS.USER, id: "ME" }],
    }),

    // Parolni yangilash
    updateMePassword: builder.mutation({
      query: (body) => ({ 
        url: AUTH_PATH.UPDATE_ME_PASSWORD, 
        method: "PATCH", 
        body 
      }),
    }),

    // Profil rasmini yangilash
    updateMeProfileImg: builder.mutation({
      query: (body) => ({ 
        url: AUTH_PATH.UPDATE_ME_PROFILE_IMG, 
        method: "PATCH", 
        body 
      }),
      invalidatesTags: [{ type: API_TAGS.USER, id: "ME" }],
    }),

    // Foydalanuvchini o'chirish
    deleteUser: builder.mutation({
      query: (id) => ({ 
        url: AUTH_PATH.DELETE_USER(id), 
        method: "DELETE" 
      }),
      invalidatesTags: [{ type: API_TAGS.USER, id: "LIST" }],
    }),

    // ==========================================
    // QUERIES (Fetch Data)
    // ==========================================

    // Tizimga kirgan foydalanuvchi ma'lumotlari
    getMe: builder.query({
      query: () => AUTH_PATH.ME,
      providesTags: [{ type: API_TAGS.USER, id: "ME" }],
    }),

    // Barcha foydalanuvchilar ro'yxati (paginatsiya/filtr bilan)
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

    // Bitta foydalanuvchi ma'lumotlari ID bo'yicha
    getSingleUser: builder.query({
      query: (id) => AUTH_PATH.GET_SINGLE_USER(id),
      providesTags: (_result, _error, id) => [{ type: API_TAGS.USER, id }],
    }),
  }),
});

// Auto-generated hook'larni export qilish
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