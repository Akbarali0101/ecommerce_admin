import { useState } from "react";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
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

export default function AdminCategories() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{mockCategories.length} ta kategoriya</p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Yangi kategoriya
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi kategoriya qo'shish</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
              <div className="flex flex-col gap-1.5">
                <Label>Nomi</Label>
                <Input placeholder="Masalan: Elektronika" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Slug</Label>
                <Input placeholder="masalan: elektronika" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit">Qo'shish</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mockCategories.map((cat) => (
          <Card key={cat._id} className="flex-row items-center gap-3 p-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
              <ImageOff className="size-5 text-muted-foreground/40" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{cat.name}</p>
              <p className="text-xs text-muted-foreground">/{cat.slug}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="size-8">
                <Pencil className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive">
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
