import { useState } from "react";
import { Plus, Pencil, Trash2, ImageOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/store/api/categoryApi/categoryApi";

export default function AdminCategories() {
  const { data: categories = [], isLoading } = useGetAllCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "" });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const isSaving = isCreating || isUpdating;

  const openCreateDialog = () => {
    setEditingCategory(null);
    setForm({ name: "", slug: "" });
    setOpen(true);
  };

  const openEditDialog = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name || "", slug: cat.slug || "" });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, ...form }).unwrap();
        toast.success("Kategoriya muvaffaqiyatli tahrirlandi");
      } else {
        await createCategory(form).unwrap();
        toast.success("Kategoriya muvaffaqiyatli qo'shildi");
      }
      setOpen(false);
      setEditingCategory(null);
      setForm({ name: "", slug: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget._id).unwrap();
      toast.success("Kategoriya o'chirildi");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Yuklanmoqda..." : `${categories.length} ta kategoriya`}
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="size-4" />
              Yangi kategoriya
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo'shish"}
              </DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <Label>Nomi</Label>
                <Input
                  placeholder="Masalan: Elektronika"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Slug</Label>
                <Input
                  placeholder="masalan: elektronika"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="size-4 animate-spin" />}
                  {editingCategory ? "Saqlash" : "Qo'shish"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat._id} className="flex-row items-center gap-3 p-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
              <ImageOff className="size-5 text-muted-foreground/40" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{cat.name}</p>
              <p className="text-xs text-muted-foreground">/{cat.slug}</p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => openEditDialog(cat)}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:text-destructive"
                onClick={() => setDeleteTarget(cat)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* O'chirishni tasdiqlash oynasi */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategoriyani o'chirish</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Haqiqatan ham <span className="font-medium text-foreground">{deleteTarget?.name}</span>{" "}
            kategoriyasini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
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