import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, ImageOff, AlertTriangle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts, mockCategories } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react"; 

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  
  // Modal uchun state-lar
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      localStorage.setItem("products", JSON.stringify(mockProducts));
      setProducts(mockProducts);
    }
  }, []);

  // Modalni ochish
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  // O'chirish funksiyasi (Faqat stok bo'sh / 0 bo'lganda ishlaydi)
  const confirmDelete = () => {
    if (!selectedProduct || Number(selectedProduct.stock) > 0) return;

    const updatedProducts = products.filter((p) => String(p._id) !== String(selectedProduct._id));
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    
    setIsDeleteOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((product) => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Mahsulot qidirish..." 
            className="pl-9" 
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
            {filteredProducts.map((product) => {
              const category = mockCategories.find((c) => c._id === product.category);
              return (
                <tr key={product._id} className="border-b last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted overflow-hidden">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                        ) : (
                          <ImageOff className="size-4 text-muted-foreground/40" />
                        )}
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
                        onClick={() => openDeleteModal(product)}
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

      {/* OQ MODAL OYNA (BLUR FON BILAN) */}
      {isDeleteOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-100 text-gray-900 space-y-4">
            
            {/* SHART: Stok bo'sh bo'lmasa (0 dan katta bo'lsa) taqiqlovchi oyna chiqadi */}
            {Number(selectedProduct.stock) > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <XCircle className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Mahsulot hali tugamagan</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Omboringizda hali <strong className="text-gray-900">{selectedProduct.stock} ta</strong> mahsulot bor. Stok bo'sh bo'lmagani uchun uni o'chira olmaysiz.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-xs text-amber-800">
                  ⚠️ O'chirish uchun avval mahsulot tugashi kerak.
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    Tushundim
                  </Button>
                </div>
              </>
            ) : (
              /* Stok 0 bo'lsa o'chirishga ruxsat beriladi */
              <>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Mahsulotni o'chirish</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      "<span className="font-medium text-gray-800">{selectedProduct.title}</span>" stoki 0 ga teng. Ushbu mahsulotni haqiqatdan ham o'chirmoqchimisiz?
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    Bekor qilish
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={confirmDelete}
                  >
                    O'chirish
                  </Button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}