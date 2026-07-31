import { baseApi } from "../baseApi/baseApi";
import { API_TAGS } from "@/constants/apiTags";
import { UPLOAD_PATH } from "./path";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Bitta fayl yuklash. FormData ni body sifatida yuboradi.
    // transformResponse dan mustasno — backend fayl uchun alohida
    // struktura qaytaradi (file_path, files[], url). Shuning uchun
    // javobni o'zgartirmasdan qaytaramiz.
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: UPLOAD_PATH.FILE,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [API_TAGS.UPLOAD],
    }),

    // Bir nechta fayl yuklash (maks. 5).
    uploadFiles: builder.mutation({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        return {
          url: UPLOAD_PATH.FILES,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [API_TAGS.UPLOAD],
    }),
  }),
});

export const { useUploadFileMutation, useUploadFilesMutation } = uploadApi;