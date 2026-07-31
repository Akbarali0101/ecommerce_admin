import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS } from "@/constants/apiTags";

const baseUrl = "http://localhost:5757";

/**
 * Asosiy (root) API. Har bir modul (auth, product, category...)
 * shu baseApi ni "injectEndpoints" orqali kengaytiradi.
 *
 * Talabalar uchun: har bir domen papkasidagi *Api.js faylida
 * builder.query / builder.mutation yozib, shu yerdagi baseQuery
 * orqali backendga so'rov yuboriladi.
 */
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
},
  }),
  tagTypes: Object.values(API_TAGS),
  endpoints: () => ({}),
});