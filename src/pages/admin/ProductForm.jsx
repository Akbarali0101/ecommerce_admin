import { useParams, Link } from "react-router-dom";
import { ArrowLeft, UploadCloud, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { mockCategories, mockProducts } from "@/data/mockData";

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id) && id !== "new";
  const product = isEdit ? mockProducts.find((p) => p._id === id) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/products">
          <ArrowLeft className="size-4" />
          Mahsulotlarga qaytish
        </Link>
      </Button>

      <h1 className="mb-6 text-xl font-semibold">
        {isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
      </h1>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Asosiy ma'lumotlar</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Mahsulot nomi</Label>
              <Input defaultValue={product?.title} placeholder="Masalan: iPhone 15 Pro 128GB" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Tavsif</Label>
              <Textarea placeholder="Mahsulot haqida to'liq ma'lumot..." rows={4} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Kategoriya</Label>
                <Select defaultValue={product?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Brend</Label>
                <Input defaultValue={product?.brand} placeholder="Masalan: Apple" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Narx va ombor</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Narxi (so'm)</Label>
              <Input type="number" defaultValue={product?.price} placeholder="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Chegirma (%)</Label>
              <Input type="number" defaultValue={product?.discount} placeholder="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Ombordagi soni</Label>
              <Input type="number" defaultValue={product?.stock} placeholder="0" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Rasmlar</h3>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground hover:border-primary hover:text-primary">
              <UploadCloud className="size-5" />
              <span className="text-xs">Yuklash</span>
              <input type="file" className="hidden" multiple accept="image/*" />
            </label>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link to="/products">Bekor qilish</Link>
          </Button>
          <Button type="submit">{isEdit ? "Saqlash" : "Qo'shish"}</Button>
        </div>
      </form>
    </div>
  );
}
