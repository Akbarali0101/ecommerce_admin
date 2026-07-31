import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, ImageOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import { useGetAllProductsQuery, useDeleteProductMutation } from "@/store/api/productApi/productApi";

export default function AdminProducts() {
  const { data: products = [], isLoading } = useGetAllProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.stock !== 0) {
      toast.error("Ombordagi qoldiq 0 bo'lmaguncha mahsulotni o'chirib bo'lmaydi");
      setDeleteTarget(null);
      return;
    }

    try {
      await deleteProduct(deleteTarget._id).unwrap();
      toast.success("Mahsulot o'chirildi");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Mahsulot qidirish..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  Yuklanmoqda...
                </td>
              </tr>
            )}

            {!isLoading && filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  Mahsulot topilmadi
                </td>
              </tr>
            )}

            {filteredProducts.map((product) => {
              const categoryName =
                typeof product.category === "object" && product.category !== null
                  ? product.category.name
                  : product.category;

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
                  <td className="px-4 py-3 text-muted-foreground">{categoryName || "-"}</td>
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
                        onClick={() => setDeleteTarget(product)}
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

      {/* O'chirishni tasdiqlash oynasi */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mahsulotni o'chirish</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Haqiqatan ham <span className="font-medium text-foreground">{deleteTarget?.title}</span>{" "}
            mahsulotini o'chirmoqchimisiz?
            {deleteTarget?.stock !== 0 && (
              <span className="mt-2 block text-destructive">
                Diqqat: ombordagi qoldiq {deleteTarget?.stock} ta. Faqat qoldiq 0 bo'lgan mahsulotlarni
                o'chirish mumkin.
              </span>
            )}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Bekor qilish
            </Button>
            <Button variant="destructive" disabled={isDeleting} onClick={handleDeleteConfirm}>
              {isDeleting && <Loader2 className="size-4 animate-spin" />}
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}