import { baseApi } from "../baseApi/baseApi";
<<<<<<< HEAD
=======
import { API_TAGS } from "@/constants/apiTags";
>>>>>>> 1ec0ecefdae84d3e451355d8410b273c0b63dbe6
import { UPLOAD_PATH } from "./path";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
<<<<<<< HEAD
=======
    // Bitta fayl yuklash. FormData ni body sifatida yuboradi.
    // transformResponse dan mustasno — backend fayl uchun alohida
    // struktura qaytaradi (file_path, files[], url). Shuning uchun
    // javobni o'zgartirmasdan qaytaramiz.
>>>>>>> 1ec0ecefdae84d3e451355d8410b273c0b63dbe6
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
<<<<<<< HEAD
    }),

=======
      invalidatesTags: [API_TAGS.UPLOAD],
    }),

    // Bir nechta fayl yuklash (maks. 5).
>>>>>>> 1ec0ecefdae84d3e451355d8410b273c0b63dbe6
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
<<<<<<< HEAD
=======
      invalidatesTags: [API_TAGS.UPLOAD],
>>>>>>> 1ec0ecefdae84d3e451355d8410b273c0b63dbe6
    }),
  }),
});

export const { useUploadFileMutation, useUploadFilesMutation } = uploadApi;