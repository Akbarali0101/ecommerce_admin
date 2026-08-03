import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UploadCloud, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetAllCategoriesQuery } from "@/store/api/categoryApi/categoryApi";
import {
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/store/api/productApi/productApi";
import { useUploadFilesMutation } from "@/store/api/uploadApi/uploadApi";

const API_URL = "http://localhost:5757";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  discount: "",
  stock: "",
  images: [],
};

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id) && id !== "new";

  const { data: categories = [] } = useGetAllCategoriesQuery();
  const { data: product, isLoading: isLoadingProduct } = useGetSingleProductQuery(id, {
    skip: !isEdit,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation();

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isEdit && product) {
      setForm({
        title: product.title || "",
        slug: product.slug || "",
        description: product.description || "",
        category: typeof product.category === "object" ? product.category?._id : product.category || "",
        brand: product.brand || "",
        price: product.price ?? "",
        discount: product.discount ?? "",
        stock: product.stock ?? "",
        images: product.images || [],
      });
    }
  }, [isEdit, product]);

  const isSaving = isCreating || isUpdating;

  const handleChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((f) => ({
      ...f,
      title,
      slug: isEdit ? f.slug : generateSlug(title),
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const res = await uploadFiles(files).unwrap();
      const newPaths = (res.files || []).map((f) => f.file_path);
      setForm((f) => ({ ...f, images: [...f.images, ...newPaths] }));
      if (res.failed?.length) {
        toast.error(`${res.failed.length} ta fayl yuklanmadi`);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Rasm yuklashda xatolik yuz berdi");
    } finally {
      e.target.value = "";
    }
  };

  const removeImage = (path) => {
    setForm((f) => ({ ...f, images: f.images.filter((img) => img !== path) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.slug.trim() || !form.category || form.price === "" || form.stock === "") {
      toast.error("Iltimos, majburiy maydonlarni to'ldiring");
      return;
    }

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      category: form.category,
      brand: form.brand,
      price: Number(form.price),
      discount: form.discount === "" ? 0 : Number(form.discount),
      stock: Number(form.stock),
      images: form.images,
    };

    try {
      if (isEdit) {
        await updateProduct({ id, body: payload }).unwrap();
        toast.success("Mahsulot muvaffaqiyatli tahrirlandi");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Mahsulot muvaffaqiyatli qo'shildi");
      }
      navigate("/products");
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  };

  if (isEdit && isLoadingProduct) {
    return <div className="py-10 text-center text-muted-foreground">Yuklanmoqda...</div>;
  }

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

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Asosiy ma'lumotlar</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Mahsulot nomi</Label>
              <Input
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Masalan: iPhone 15 Pro 128GB"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Tavsif</Label>
              <Textarea
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Mahsulot haqida to'liq ma'lumot..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Kategoriya</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm((f) => ({ ...f, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Brend</Label>
                <Input value={form.brand} onChange={handleChange("brand")} placeholder="Masalan: Apple" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Narx va ombor</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Narxi (so'm)</Label>
              <Input type="number" value={form.price} onChange={handleChange("price")} placeholder="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Chegirma (%)</Label>
              <Input
                type="number"
                value={form.discount}
                onChange={handleChange("discount")}
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Ombordagi soni</Label>
              <Input type="number" value={form.stock} onChange={handleChange("stock")} placeholder="0" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Rasmlar</h3>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {form.images.map((img) => (
              <div key={img} className="group relative aspect-square overflow-hidden rounded-lg border">
                <img src={`${API_URL}${img}`} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}

            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground hover:border-primary hover:text-primary">
              {isUploading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <UploadCloud className="size-5" />
                  <span className="text-xs">Yuklash</span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link to="/products">Bekor qilish</Link>
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="size-4 animate-spin" />}
            {isEdit ? "Saqlash" : "Qo'shish"}
          </Button>
        </div>
      </form>
    </div>
  );
}