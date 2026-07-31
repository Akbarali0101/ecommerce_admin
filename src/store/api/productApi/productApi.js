import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { PRODUCT_PATH } from "./path";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (params) => ({ url: PRODUCT_PATH.GET_ALL, params: params || {} }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((p) => ({ type: API_TAGS.PRODUCT, id: p._id })),
              { type: API_TAGS.PRODUCT, id: "LIST" },
            ]
          : [{ type: API_TAGS.PRODUCT, id: "LIST" }],
    }),

    getAllProductsAdmin: builder.query({
      query: (params) => ({ url: PRODUCT_PATH.GET_ALL_ADMIN, params: params || {} }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((p) => ({ type: API_TAGS.PRODUCT, id: p._id })),
              { type: API_TAGS.PRODUCT, id: "LIST" },
            ]
          : [{ type: API_TAGS.PRODUCT, id: "LIST" }],
    }),

    getSingleProduct: builder.query({
      query: (id) => PRODUCT_PATH.GET_SINGLE(id),
      providesTags: (_r, _e, id) => [{ type: API_TAGS.PRODUCT, id }],
    }),

    createProduct: builder.mutation({
      query: (body) => ({ url: PRODUCT_PATH.CREATE, method: "POST", body }),
      invalidatesTags: [{ type: API_TAGS.PRODUCT, id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: PRODUCT_PATH.UPDATE(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: API_TAGS.PRODUCT, id },
        { type: API_TAGS.PRODUCT, id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({ url: PRODUCT_PATH.DELETE(id), method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: API_TAGS.PRODUCT, id },
        { type: API_TAGS.PRODUCT, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetAllProductsAdminQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
