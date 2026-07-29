export const PRODUCT_PATH = {
  GET_ALL: "/product/get-all",
  GET_ALL_ADMIN: "/product/get-all-admin",
  GET_SINGLE: (id) => `/product/get-single/${id}`,
  CREATE: "/product/create",
  UPDATE: (id) => `/product/update/${id}`,
  DELETE: (id) => `/product/delete/${id}`,
};
