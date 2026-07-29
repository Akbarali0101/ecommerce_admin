export const AUTH_PATH = {
  SIGNUP: "/auth/signup",
  SIGNUP_ADMIN: "/auth/signup-admin",
  LOGIN: "/auth/login",
  ME: "/auth/me",
  GET_ALL_USERS: "/auth/get-all-users",
  GET_SINGLE_USER: (id) => `/auth/get-single-user/${id}`,
  UPDATE_ME_INFO: "/auth/update-me-info",
  UPDATE_ME_EMAIL: "/auth/update-me-email",
  UPDATE_ME_PASSWORD: "/auth/update-me-password",
  UPDATE_ME_PROFILE_IMG: "/auth/update-me-profile-img",
  DELETE_USER: (id) => `/auth/delete/${id}`,
};
