export const ORDER_PATH = {
  CREATE: "/order/create",
  GET_ALL_ME: "/order/get-all-me",
  GET_ALL_ADMIN: "/order/get-all-admin",
  GET_SINGLE: (id) => `/order/get-single/${id}`,
  UPDATE_STATUS: (id) => `/order/update-status/${id}`,
  CANCEL: (id) => `/order/cancel/${id}`,
};
