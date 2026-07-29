import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AutoAuth } from "@/components/auth/AutoAuth";

import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import ProductForm from "@/pages/admin/ProductForm";
import AdminCategories from "@/pages/admin/Categories";
import AdminOrders from "@/pages/admin/Orders";
import AdminBanners from "@/pages/admin/Banners";
import AdminUsers from "@/pages/admin/Users";

function App() {
  return (
    <>
      <AutoAuth />
      <Routes>
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;