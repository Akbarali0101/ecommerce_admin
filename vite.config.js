import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    // Backend static fayllar (banner rasmlari, product rasmlari) ni
    // shu yerda proxy qilamiz. Sababi: backend helmet
    // Cross-Origin-Resource-Policy: same-origin qo'yadi, frontend
    // boshqa portda bo'lgani uchun rasmlarni bloklaydi. Vite proxy
    // orqali so'rov frontend o'zidan kelgandek ko'rinadi.
    proxy: {
      "/uploads": {
        target: "http://localhost:5757",
        changeOrigin: true,
        // Backend helmet'dan kelayotgan Cross-Origin-Resource-Policy:
        // same-origin header'ni olib tashlaymiz — Vite proxy orqali
        // o'tayotgan so'rovlar uchun kerak emas.
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            delete proxyRes.headers["cross-origin-resource-policy"];
            delete proxyRes.headers["x-frame-options"];
          });
        },
      },
    },
  },
});
