import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, ImageOff, Loader2, EyeOff, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetAllBannersAdminQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "@/store/api/bannerApi/bannerApi";
import { useUploadFileMutation } from "@/store/api/uploadApi/uploadApi";

// Backend static fayllar /uploads/... ko'rinishida qaytadi.
// Vite proxy orqali shu URL frontenddan (5174) kelgandek ko'rinadi,
// shuning uchun relative path ishlatamiz (proxy ishlaydi).
const resolveImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  // /uploads/... bilan boshlansa — relative, Vite proxy orqali backendga
  // boradi va helmet header'lari olib tashlanadi.
  return image;
};

// Banner title'ni slug formatga o'tkazib, oraliq belgilarni tozalaymiz.
// "Yozgi chegirmalar -50%" → "yozgi-chegirmalar-50"
function slugifyTitle(title) {
  if (!title) return "banner";
  return (
    title
      .toString()
      .toLowerCase()
      .trim()
      // O'zbek lotin harflarini transliteratsiya qilmaymiz, faqat
      // maxsus belgilarni olib tashlaymiz.
      .replace(/[''`]/g, "")
      .replace(/[^a-z0-9Ѐ-ӿԀ-ԯ\s-]/gi, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "banner"
  );
}

// Original faylni banner.title asosida qayta nomlab, vaqt tamg'asi qo'shamiz.
// Masalan: "iPhone 15 Pro" → "iphone-15-pro-1735123456.jpg"
function renameFileForBanner(file, title) {
  const ext = file.name?.split(".").pop()?.toLowerCase() || "png";
  const slug = slugifyTitle(title);
  // Vaqt tamg'asi — bir xil title bilan ikki marta yuklanishda fayllar
  // ustida yozilmasligi uchun.
  const timestamp = Date.now();
  const newName = `${slug}-${timestamp}.${ext}`;
  return new File([file], newName, { type: file.type });
}

const emptyForm = { title: "", link: "", order: 0 };

export default function AdminBanners() {
  const { data, isLoading, isError, error } = useGetAllBannersAdminQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const banners = data || [];

  const [open, setOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const isSaving = isCreating || isUpdating || isUploading;

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
    setPreview("");
    setEditingBanner(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setOpen(true);
  };

  const openEditDialog = (banner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title || "",
      link: banner.link || "",
      order: banner.order ?? 0,
    });
    setPreview(banner.image ? resolveImageUrl(banner.image) : "");
    setFile(null);
    setOpen(true);
  };

  const handleDialogChange = (value) => {
    setOpen(value);
    if (!value) resetForm();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingBanner && !file) {
      toast.error("Iltimos, banner uchun rasm tanlang");
      return;
    }

    try {
      let imagePathFinal = editingBanner?.image;

      if (file) {
        // Rasmni banner.title ga asosan ma'noli nom bilan yuklaymiz.
        // Masalan: "Yozgi chegirmalar -50%" → "yozgi-chegirmalar-50-1735123456.png".
        // Backend multer filename ishlatadi, lekin biz File obyektini
        // qayta nomlash orqali originalname ni o'zgartiramiz.
        const renamedFile = renameFileForBanner(file, form.title);
        const uploadRes = await uploadFile(renamedFile).unwrap();
        // Backend turli formatlarda javob berishi mumkin:
        //   { file: { file_path } }   yoki
        //   { data: { file_path } }   yoki
        //   { file_path }             yoki
        //   { url }                   kabi.
        const uploaded = uploadRes?.data ?? uploadRes;
        const imagePath =
          uploaded?.file?.file_path ||
          uploaded?.file_path ||
          uploaded?.path ||
          uploaded?.url;
        if (!imagePath) {
          toast.error("Rasm yuklandi, lekin server javobini tushunmadim");
          return;
        }
        imagePathFinal = imagePath;
      }

      const payload = {
        title: form.title,
        link: form.link,
        order: Number(form.order) || 0,
        image: imagePathFinal,
      };

      if (editingBanner) {
        await updateBanner({ id: editingBanner._id, ...payload }).unwrap();
        toast.success("Banner yangilandi");
      } else {
        await createBanner(payload).unwrap();
        toast.success("Banner qo'shildi");
      }

      setOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err?.data?.msg || "Xatolik yuz berdi, qayta urinib ko'ring");
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await updateBanner({ id: banner._id, isActive: !banner.isActive }).unwrap();
      toast.success(banner.isActive ? "Banner o'chirildi (nofaol)" : "Banner faollashtirildi");
    } catch (err) {
      toast.error(err?.data?.msg || "Holatni o'zgartirib bo'lmadi");
    }
  };

  const handleDelete = async (banner) => {
    if (!window.confirm(`"${banner.title || "Nomsiz banner"}" o'chirilsinmi?`)) return;

    try {
      await deleteBanner(banner._id).unwrap();
      toast.success("Banner o'chirildi");
    } catch (err) {
      toast.error(err?.data?.msg || "Bannerni o'chirib bo'lmadi");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Yuklanmoqda..." : `${banners.length} ta banner`}
        </p>

        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="size-4" />
              Yangi banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBanner ? "Bannerni tahrirlash" : "Yangi banner qo'shish"}</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Sarlavha</Label>
                <Input
                  id="title"
                  placeholder="Masalan: Yozgi chegirmalar"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="link">Havola (link)</Label>
                <Input
                  id="link"
                  placeholder="/catalog?category=elektronika"
                  value={form.link}
                  onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="order">Tartib raqami</Label>
                <Input
                  id="order"
                  type="number"
                  placeholder="0"
                  value={form.order}
                  onChange={(e) => setForm((prev) => ({ ...prev, order: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Rasm</Label>
                <label className="relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed text-muted-foreground hover:border-primary hover:text-primary">
                  {preview ? (
                    <img src={preview} alt="Banner ko'rinishi" className="size-full object-cover" />
                  ) : (
                    <span className="text-sm">Rasm yuklash</span>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="size-4 animate-spin" />}
                  {editingBanner ? "Saqlash" : "Qo'shish"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden p-0">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="p-3">
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card className="p-6 text-center text-sm text-destructive">
          {error?.data?.msg || "Bannerlarni yuklashda xatolik yuz berdi"}
        </Card>
      )}

      {!isLoading && !isError && banners.length === 0 && (
        <Card className="flex flex-col items-center gap-2 p-10 text-center text-muted-foreground">
          <ImageOff className="size-8 text-muted-foreground/40" />
          <p className="text-sm">Hozircha bannerlar mavjud emas</p>
        </Card>
      )}

      {!isLoading && !isError && banners.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Card key={banner._id} className="overflow-hidden p-0">
              <div className="relative flex aspect-video items-center justify-center bg-muted">
                {banner.image ? (
                  <img
                    src={resolveImageUrl(banner.image)}
                    alt={banner.title || "Banner"}
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageOff className="size-8 text-muted-foreground/30" />
                )}
                <Badge
                  variant={banner.isActive ? "success" : "secondary"}
                  className="absolute left-2 top-2"
                >
                  {banner.isActive ? "Faol" : "Nofaol"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3">
                <p className="line-clamp-1 text-sm font-medium">{banner.title || "Nomsiz banner"}</p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    title={banner.isActive ? "Nofaol qilish" : "Faollashtirish"}
                    onClick={() => handleToggleActive(banner)}
                    disabled={isUpdating}
                  >
                    {banner.isActive ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => openEditDialog(banner)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(banner)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
