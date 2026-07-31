import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { ORDER_PATH } from "./path";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({ url: ORDER_PATH.CREATE, method: "POST", body }),
      invalidatesTags: [{ type: API_TAGS.ORDER, id: "LIST" }, API_TAGS.CART],
    }),

    getMyOrders: builder.query({
      query: () => ORDER_PATH.GET_ALL_ME,
      providesTags: [{ type: API_TAGS.ORDER, id: "ME" }],
    }),

    getAllOrdersAdmin: builder.query({
      query: (params) => ({ url: ORDER_PATH.GET_ALL_ADMIN, params: params || {} }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((o) => ({ type: API_TAGS.ORDER, id: o._id })),
              { type: API_TAGS.ORDER, id: "LIST" },
            ]
          : [{ type: API_TAGS.ORDER, id: "LIST" }],
    }),

    getSingleOrder: builder.query({
      query: (id) => ORDER_PATH.GET_SINGLE(id),
      providesTags: (_r, _e, id) => [{ type: API_TAGS.ORDER, id }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, body }) => ({
        url: ORDER_PATH.UPDATE_STATUS(id),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: API_TAGS.ORDER, id },
        { type: API_TAGS.ORDER, id: "LIST" },
      ],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({ url: ORDER_PATH.CANCEL(id), method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: API_TAGS.ORDER, id },
        { type: API_TAGS.ORDER, id: "LIST" },
        { type: API_TAGS.ORDER, id: "ME" },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersAdminQuery,
  useGetSingleOrderQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = orderApi;
