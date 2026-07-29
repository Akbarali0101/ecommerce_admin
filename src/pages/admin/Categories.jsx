import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ImageOff, AlertTriangle } from "lucide-react";
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
import { mockCategories } from "@/data/mockData";
import { toast } from "sonner";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);

  // Forma (qo'shish/tahrirlash) modal state'lari
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  // O'chirish tasdiqlash modal state'lari
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // localStorage'dan kategoriyalarni yuklash
  useEffect(() => {
    const saved = localStorage.getItem("categories");
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      localStorage.setItem("categories", JSON.stringify(mockCategories));
      setCategories(mockCategories);
    }
  }, []);

  // Forma inputlarini boshqarish
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // "Yangi kategoriya" tugmasi bosilganda
  const openAddModal = () => {
    setIsEdit(false);
    setEditingId(null);
    setFormData({ name: "", slug: "" });
    setOpen(true);
  };

  // Tahrirlash (Pencil) tugmasi bosilganda
  const openEditModal = (cat) => {
    setIsEdit(true);
    setEditingId(cat._id);
    setFormData({ name: cat.name || "", slug: cat.slug || "" });
    setOpen(true);
  };

  // Formani saqlash (qo'shish yoki tahrirlash)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    let updated = [];

    if (isEdit) {
      // TAHRIRLASH
      updated = categories.map((cat) =>
        String(cat._id) === String(editingId)
          ? { ...cat, name: formData.name, slug: formData.slug }
          : cat
      );
      toast.success("Kategoriya muvaffaqiyatli tahrirlandi!");
    } else {
      // YANGI QO'SHISH
      const newCategory = {
        _id: String(Date.now()),
        name: formData.name,
        slug: formData.slug,
      };
      updated = [newCategory, ...categories];
      toast.success("Yangi kategoriya qo'shildi!");
    }

    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
    setOpen(false);
  };

  // O'chirish modalini ochish
  const openDeleteModal = (cat) => {
    setSelectedCategory(cat);
    setDeleteOpen(true);
  };

  // O'chirishni tasdiqlash
  const confirmDelete = () => {
    if (!selectedCategory) return;

    const updated = categories.filter(
      (cat) => String(cat._id) !== String(selectedCategory._id)
    );
    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));

    toast.success("Kategoriya o'chirildi!");
    setDeleteOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{categories.length} ta kategoriya</p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <Plus className="size-4" />
              Yangi kategoriya
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo'shish"}
              </DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <Label>Nomi</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masalan: Elektronika"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Slug</Label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="masalan: elektronika"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit">{isEdit ? "Saqlash" : "Qo'shish"}</Button>
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
                onClick={() => openEditModal(cat)}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:text-destructive"
                onClick={() => openDeleteModal(cat)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* O'CHIRISH TASDIQLASH MODALI (Ogohlantiruv paneli) */}
      {deleteOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-100 text-gray-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Kategoriyani o'chirish</h3>
                <p className="text-sm text-gray-500 mt-1">
                  "<span className="font-medium text-gray-800">{selectedCategory.name}</span>"
                  kategoriyasini haqiqatdan ham o'chirmoqchimisiz?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDelete}>
                O'chirish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}