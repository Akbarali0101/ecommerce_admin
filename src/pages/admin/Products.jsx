import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, ImageOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts, mockCategories } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";

export default function AdminProducts() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Mahsulot qidirish..." className="pl-9" />
        </div>
        <Button asChild>
          <Link to="/products/new">
            <Plus className="size-4" />
            Yangi mahsulot
          </Link>
        </Button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Mahsulot</th>
              <th className="px-4 py-3 font-medium">Kategoriya</th>
              <th className="px-4 py-3 font-medium">Narx</th>
              <th className="px-4 py-3 font-medium">Ombor</th>
              <th className="px-4 py-3 font-medium">Holat</th>
              <th className="px-4 py-3 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((product) => {
              const category = mockCategories.find((c) => c._id === product.category);
              return (
                <tr key={product._id} className="border-b last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                        <ImageOff className="size-4 text-muted-foreground/40" />
                      </div>
                      <span className="line-clamp-1 font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{category?.name || "-"}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.stock > 0 ? "success" : "destructive"}>
                      {product.stock > 0 ? "Faol" : "Tugagan"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" asChild>
                        <Link to={`/products/${product._id}`}>
                          <Pencil className="size-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
