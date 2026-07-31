import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { orderStatusLabels } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";
import { useGetAllOrdersAdminQuery } from "@/store/api/orderApi/orderApi";
import { useGetAllProductsQuery } from "@/store/api/productApi/productApi";
import { useGetAllUsersQuery } from "@/store/api/authApi/authApi";

const WEEKDAY_LABELS = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Juma", "Shan"];

// Oxirgi 7 kunlik savdo dinamikasini buyurtmalar ro'yxatidan hisoblab chiqadi.
function buildWeeklySales(orders) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({ date: d, total: 0, label: WEEKDAY_LABELS[d.getDay()] });
  }

  orders.forEach((order) => {
    const created = new Date(order.createdAt);
    created.setHours(0, 0, 0, 0);
    const bucket = days.find((day) => day.date.getTime() === created.getTime());
    if (bucket) bucket.total += order.totalPrice || 0;
  });

  const max = Math.max(...days.map((d) => d.total), 1);
  return days.map((d) => ({ ...d, height: Math.round((d.total / max) * 100) }));
}

export default function Dashboard() {
  const {
    data: ordersRes,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useGetAllOrdersAdminQuery({ limit: 100 });

  const { data: productsRes, isLoading: productsLoading } = useGetAllProductsQuery({ limit: 1 });
  const { data: usersRes, isLoading: usersLoading } = useGetAllUsersQuery({ limit: 1 });

  const orders = ordersRes?.data || [];
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  // backend response: { success, data: [...], pagination: { total, ... } }.
  // baseApi.transformResponse allaqachon data ni shilib qo'ygan bo'lsa,
  // ordersRes = { data: [...], pagination }. Bo'lmasa { data: { data: [...], pagination } }.
  const ordersCount = ordersRes?.pagination?.total ?? ordersRes?.data?.pagination?.total ?? 0;
  const productsCount = productsRes?.pagination?.total ?? productsRes?.data?.pagination?.total ?? 0;
  const usersCount = usersRes?.pagination?.total ?? usersRes?.data?.pagination?.total ?? 0;
  const recentOrders = orders.slice(0, 5);
  const weeklySales = buildWeeklySales(orders);

  const statsLoading = ordersLoading || productsLoading || usersLoading;

  const stats = [
    {
      label: "Umumiy savdo",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      hint: "so'nggi buyurtmalar bo'yicha",
    },
    {
      label: "Buyurtmalar",
      value: ordersCount,
      icon: ShoppingCart,
      hint: "jami buyurtmalar soni",
    },
    {
      label: "Mahsulotlar",
      value: productsCount,
      icon: Package,
      hint: "faol mahsulotlar",
    },
    {
      label: "Foydalanuvchilar",
      value: usersCount,
      icon: Users,
      hint: "ro'yxatdan o'tganlar",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-7 w-20" />
                <Skeleton className="mt-3 h-3 w-32" />
              </Card>
            ))
          : stats.map(({ label, value, icon: Icon, hint }) => (
              <Card key={label} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-1 text-2xl font-bold">{value}</p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs font-medium text-muted-foreground">{hint}</p>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Savdo dinamikasi</h3>
            <Badge variant="secondary">Oxirgi 7 kun</Badge>
          </div>

          {ordersLoading ? (
            <Skeleton className="h-56 w-full" />
          ) : ordersError ? (
            <div className="flex h-56 items-center justify-center text-sm text-destructive">
              Ma'lumotlarni yuklashda xatolik yuz berdi
            </div>
          ) : totalRevenue === 0 ? (
            <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
              Hozircha buyurtmalar mavjud emas
            </div>
          ) : (
            <div className="flex h-56 items-end justify-between gap-2">
              {weeklySales.map((day) => (
                <div key={day.date.toISOString()} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-primary/70 transition-all hover:bg-primary"
                    style={{ height: `${Math.max(day.height, 2)}%` }}
                    title={formatPrice(day.total)}
                  />
                  <span className="text-xs text-muted-foreground">{day.label}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-semibold">So'nggi buyurtmalar</h3>

          {ordersLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : ordersError ? (
            <p className="text-sm text-destructive">Buyurtmalarni yuklab bo'lmadi</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Hozircha buyurtmalar yo'q</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOrders.map((order) => {
                const status = orderStatusLabels[order.status] || orderStatusLabels.pending;
                return (
                  <div key={order._id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 