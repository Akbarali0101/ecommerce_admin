import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { PRODUCT_PATH } from "./path";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
<<<<<<< HEAD
      query: () => ({
        url: PRODUCT_PATH.GET_ALL_ADMIN,
        method: "GET",
      }),
      transformResponse: (response) => response?.data || response || [],
      providesTags: [API_TAGS.PRODUCT],
    }),

    getSingleProduct: builder.query({
      query: (id) => ({
        url: PRODUCT_PATH.GET_SINGLE(id),
        method: "GET",
      }),
      transformResponse: (response) => response?.data || response,
      providesTags: [API_TAGS.PRODUCT],
    }),

    createProduct: builder.mutation({
      query: (body) => ({
        url: PRODUCT_PATH.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: [API_TAGS.PRODUCT],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
=======
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
>>>>>>> 1ec0ecefdae84d3e451355d8410b273c0b63dbe6
        url: PRODUCT_PATH.UPDATE(id),
        method: "PATCH",
        body,
      }),
<<<<<<< HEAD
      invalidatesTags: [API_TAGS.PRODUCT],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: PRODUCT_PATH.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.PRODUCT],
=======
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
>>>>>>> 1ec0ecefdae84d3e451355d8410b273c0b63dbe6
    }),
  }),
});

export const {
  useGetAllProductsQuery,
<<<<<<< HEAD
=======
  useGetAllProductsAdminQuery,
>>>>>>> 1ec0ecefdae84d3e451355d8410b273c0b63dbe6
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
<<<<<<< HEAD
} = productApi;
=======
} = productApi;
>>>>>>> 1ec0ecefdae84d3e451355d8410b273c0b63dbe6
