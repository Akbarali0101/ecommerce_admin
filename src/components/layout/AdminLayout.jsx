import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

const titleMap = {
  "/": "Dashboard",
  "/products": "Mahsulotlar",
  "/categories": "Kategoriyalar",
  "/orders": "Buyurtmalar",
  "/banners": "Bannerlar",
  "/users": "Foydalanuvchilar",
};

export function AdminLayout() {
  const { pathname } = useLocation();
  const title = titleMap[pathname] || "Admin panel";

  return (
    <div className="flex bg-secondary/30">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar title={title} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
