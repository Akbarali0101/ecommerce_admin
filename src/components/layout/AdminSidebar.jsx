import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Image,
  Users,
  Settings,
  LogOut,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAdminSidebar } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Mahsulotlar", icon: Package },
  { to: "/categories", label: "Kategoriyalar", icon: FolderTree },
  { to: "/orders", label: "Buyurtmalar", icon: ShoppingCart },
  { to: "/banners", label: "Bannerlar", icon: Image },
  { to: "/users", label: "Foydalanuvchilar", icon: Users },
  { to: "/settings", label: "Sozlamalar", icon: Settings },
];

export function AdminSidebar() {
  const isOpen = useSelector((state) => state.ui.isAdminSidebarOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and redirect to login
    localStorage.removeItem("token");
    // Optionally dispatch logout action if exists
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r bg-card transition-all duration-200",
        isOpen ? "w-60" : "w-16",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3">
        {isOpen && (
          <div className="flex items-center gap-1.5 text-primary">
            <ShoppingBag className="size-5" />
            <span className="font-bold">Bozorcha</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-8"
          onClick={() => dispatch(toggleAdminSidebar())}
        >
          <ChevronLeft className={cn("size-4 transition-transform", !isOpen && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                !isOpen && "justify-center px-0",
              )
            }
            title={label}
          >
            <Icon className="size-4.5 shrink-0" />
            {isOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout button at the bottom */}
      <div className="flex-shrink-0 flex items-center gap-3 p-4 border-t">
        <Button
          variant="ghost"
          size="icon"
          className="w-8"
          onClick={handleLogout}
          title="Chiqish"
        >
          <LogOut className="size-5" />
        </Button>
        {isOpen && <span className="text-sm">Chiqish</span>}
      </div>
    </aside>
  );
}