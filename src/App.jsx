import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedAdminRoute } from "@/pages/auth/ProtectedAdminRoute";

import AdminLogin from "@/pages/auth/AdminLogin";

import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import ProductForm from "@/pages/admin/ProductForm";
import AdminCategories from "@/pages/admin/Categories";
import AdminOrders from "@/pages/admin/Orders";
import AdminBanners from "@/pages/admin/Banners";
import Users from "@/pages/admin/Users";
import Settings from "@/pages/admin/Settings";
import AdminUsers from "@/pages/admin/Users";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<AdminLogin />} />

      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      {/* Admin panel - faqat token bo'lganlar kira oladi */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;