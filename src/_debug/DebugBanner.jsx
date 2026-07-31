// Tekshirish uchun yordamchi komponent. Backend qanday javob qaytarishini
// aniqlash uchun vaqtincha Banners sahifasining tepasiga qo'yiladi.
import { useGetAllBannersAdminQuery } from "@/store/api/bannerApi/bannerApi";

export default function DebugBanner() {
  const { data, error, isLoading } = useGetAllBannersAdminQuery();
  return (
    <div style={{padding: 20, fontFamily: 'monospace', fontSize: 12}}>
      <h3>Debug Banner Response</h3>
      <pre>{JSON.stringify({ data, error: error?.data, isLoading }, null, 2)}</pre>
    </div>
  );
}
