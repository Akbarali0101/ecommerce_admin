import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { mockCategories, mockProducts } from "@/data/mockData";


export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id) && id !== "new";

  const [isLoading, setIsLoading] = useState(false);

  
  const getStoredProducts = () => {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : mockProducts;
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    discount: "",
    stock: "",
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isEdit) {
      const allProducts = getStoredProducts();
      const product = allProducts.find((p) => String(p._id) === String(id));

      if (product) {
        setFormData({
          title: product.title || "",
          description: product.description || "",
          category: product.category || "",
          brand: product.brand || "",
          price: product.price || "",
          discount: product.discount || "",
          stock: product.stock || "",
        });
        setImages(product.images || []);
      }
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImageUrls]);
  };

 
  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Kichik delay

      const currentProducts = getStoredProducts();

      const payload = {
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        images: images,  
      };

      let updatedProducts = [];

      if (isEdit) {
       
        updatedProducts = currentProducts.map((p) =>
          String(p._id) === String(id) ? { ...p, ...payload } : p
        );
        toast.success("Mahsulot muvaffaqiyatli tahrirlandi!");
      } else {
       
        const newProduct = {
          _id: String(Date.now()),
          ...payload,
          createdAt: new Date().toISOString(),
        };
        updatedProducts = [newProduct, ...currentProducts];
        toast.success("Yangi mahsulot muvaffaqiyatli qo'shildi!");
      }

      
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      navigate("/products");
    } catch (error) {
      console.error("Xatolik:", error);
      toast.error("Xatolik yuz berdi!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/products">
          <ArrowLeft className="size-4 mr-2" />
          Mahsulotlarga qaytish
        </Link>
      </Button>

      <h1 className="mb-6 text-xl font-semibold">
        {isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
      </h1>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Asosiy ma'lumotlar Card */}
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Asosiy ma'lumotlar</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Mahsulot nomi</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Masalan: iPhone 15 Pro 128GB"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Tavsif</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mahsulot haqida to'liq ma'lumot..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Kategoriya</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
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
                <Input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Masalan: Apple"
                />
              </div>
            </div>
          </div>
        </Card>

        
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Narx va ombor</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Narxi (so'm)</Label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Chegirma (%)</Label>
              <Input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Ombordagi soni</Label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>
        </Card>

        
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Rasmlar</h3>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg border group">
                <img
                  src={img}
                  alt={`Mahsulot rasmi ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}

            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <UploadCloud className="size-5" />
              <span className="text-xs">Yuklash</span>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </Card>

        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" disabled={isLoading} asChild>
            <Link to="/products">Bekor qilish</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
          </Button>
        </div>
      </form>
    </div>
  );
}