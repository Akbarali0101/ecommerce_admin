export const BANNER_PATH = {
  GET_ALL: "/banner/get-all",
  GET_ALL_ADMIN: "/banner/get-all-admin",
  CREATE: "/banner/create",
  UPDATE: (id) => `/banner/update/${id}`,
  DELETE: (id) => `/banner/delete/${id}`,
};
