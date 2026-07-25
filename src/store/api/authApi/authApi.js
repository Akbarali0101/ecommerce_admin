import { baseApi } from "../baseApi/baseApi";
// import { API_TAGS } from "@/constants/apiTags";
// import { AUTH_PATH } from "./path";

/**
 * TODO (talaba uchun): quyida login, signup, me, va profil
 * endpointlarini builder.query / builder.mutation bilan yozing.
 *
 * Namuna:
 * login: builder.mutation({
 *   query: (body) => ({ url: AUTH_PATH.LOGIN, method: "POST", body }),
 * }),
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: () => ({}),
});

