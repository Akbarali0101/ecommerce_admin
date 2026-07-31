import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS } from "@/constants/apiTags";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8989";

/**
 * Asosiy (root) API. Har bir modul (auth, product, category...)
 * shu baseApi ni "injectEndpoints" orqali kengaytiradi.
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
  // Backend har doim {success, data, ...} formatida javob qaytaradi.
  // Barcha RTK Query hooklarda response.data ga to'g'ridan-to'g'ri murojaat
  // qilish uchun shu yerda data qatlamini "shilliq qilib" olamiz.
  // Istisno: fayl yuklash kabi alohida formatdagi endpointlar o'zining
  // response strukturasini ishlatadi (masalan uploadFile).
  transformResponse: (response) => {
    // Backend javobi turlicha formatda bo'lishi mumkin:
    //   - { success, data: [...] }                 → data massiv
    //   - { success, data: { data: [...], pagination } } → nested
    //   - [...bannerlar massivi]                   → allaqachon array
    // Hammasini birlashtirib, hook ishlatadigan "toza" format qaytaramiz.
    if (Array.isArray(response?.data)) return response.data;
    if (response?.data && typeof response.data === "object" && Array.isArray(response.data.data)) {
      return response.data;
    }
    return response?.data ?? response;
  },
  endpoints: () => ({}),
});
