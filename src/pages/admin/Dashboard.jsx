import { DollarSign, ShoppingCart, Package, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockOrders, orderStatusLabels } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";

const stats = [
  { label: "Umumiy savdo", value: "48 250 000 so'm", icon: DollarSign, change: "+12.4%" },
  { label: "Buyurtmalar", value: "128", icon: ShoppingCart, change: "+8.1%" },
  { label: "Mahsulotlar", value: "342", icon: Package, change: "+3" },
  { label: "Foydalanuvchilar", value: "1 204", icon: Users, change: "+24" },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, change }) => (
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
            <p className="mt-3 flex items-center gap-1 text-xs font-medium text-success">
              <TrendingUp className="size-3.5" />
              {change} shu oyda
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Savdo dinamikasi</h3>
            <Badge variant="secondary">Oxirgi 30 kun</Badge>
          </div>
          <div className="flex h-56 items-end justify-between gap-2">
            {[40, 65, 50, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-primary/70 transition-all hover:bg-primary"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-semibold">So'nggi buyurtmalar</h3>
          <div className="flex flex-col gap-3">
            {mockOrders.map((order) => {
              const status = orderStatusLabels[order.status];
              return (
                <div key={order._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">#{order._id.toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(order.totalPrice)}</p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
