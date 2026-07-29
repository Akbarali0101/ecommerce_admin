import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { BANNER_PATH } from "./path";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Faqat faol bannerlar (bosh sahifa uchun)
    getAllBanners: builder.query({
      query: () => ({ url: BANNER_PATH.GET_ALL }),
      providesTags: [{ type: API_TAGS.BANNER, id: "LIST" }],
    }),

    // Admin panel uchun: faol va nofaol barcha bannerlarni qaytaradi.
    // baseApi.transformResponse allaqachon {success, data} dan data qatlamini
    // shilib qo'ygan, shuning uchun result — bu to'g'ridan-to'g'ri bannerlar
    // massivi.
    getAllBannersAdmin: builder.query({
      query: () => ({ url: BANNER_PATH.GET_ALL_ADMIN }),
      transformResponse: (response) => {
        // transformResponse bazada data ni shilib qo'yadi, lekin
        // get-all-admin javobi ba'zan { data: [...] }, ba'zan
        // { data: { data: [...] } } formatida bo'lishi mumkin — har
        // ikkala holatni ham qo'llab-quvvatlaymiz.
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map((b) => ({ type: API_TAGS.BANNER, id: b._id })),
              { type: API_TAGS.BANNER, id: "LIST" },
            ]
          : [{ type: API_TAGS.BANNER, id: "LIST" }],
    }),

    createBanner: builder.mutation({
      query: (body) => ({
        url: BANNER_PATH.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: API_TAGS.BANNER, id: "LIST" }],
    }),

    updateBanner: builder.mutation({
      query: ({ id, ...body }) => ({
        url: BANNER_PATH.UPDATE(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: API_TAGS.BANNER, id },
        { type: API_TAGS.BANNER, id: "LIST" },
      ],
    }),

    deleteBanner: builder.mutation({
      query: (id) => ({
        url: BANNER_PATH.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: API_TAGS.BANNER, id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useGetAllBannersAdminQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
