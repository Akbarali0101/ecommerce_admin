import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { mockOrders, orderStatusLabels } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";

export default function AdminOrders() {
  const [orders] = useState(mockOrders);

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead className="border-b bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Buyurtma</th>
            <th className="px-4 py-3 font-medium">Sana</th>
            <th className="px-4 py-3 font-medium">Mahsulotlar</th>
            <th className="px-4 py-3 font-medium">Jami</th>
            <th className="px-4 py-3 font-medium">Holat</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const status = orderStatusLabels[order.status];
            return (
              <tr key={order._id} className="border-b last:border-0 hover:bg-secondary/30">
                <td className="px-4 py-3 font-medium">#{order._id.toUpperCase()}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{order.items.length} ta mahsulot</td>
                <td className="px-4 py-3 font-medium">{formatPrice(order.totalPrice)}</td>
                <td className="px-4 py-3">
                  <Select defaultValue={order.status}>
                    <SelectTrigger className="w-40">
                      <SelectValue>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(orderStatusLabels).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
