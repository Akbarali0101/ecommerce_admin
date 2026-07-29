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
import { mockBanners } from "@/data/mockData";

export default function AdminBanners() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{mockBanners.length} ta banner</p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Yangi banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi banner qo'shish</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
              <div className="flex flex-col gap-1.5">
                <Label>Sarlavha</Label>
                <Input placeholder="Masalan: Yozgi chegirmalar" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Havola (link)</Label>
                <Input placeholder="/catalog?category=elektronika" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Rasm</Label>
                <label className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border border-dashed text-muted-foreground hover:border-primary hover:text-primary">
                  <span className="text-sm">Rasm yuklash</span>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockBanners.map((banner) => (
          <Card key={banner._id} className="overflow-hidden p-0">
            <div className="flex aspect-video items-center justify-center bg-muted">
              <ImageOff className="size-8 text-muted-foreground/30" />
            </div>
            <div className="flex items-center justify-between p-3">
              <p className="line-clamp-1 text-sm font-medium">{banner.title}</p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="size-8">
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


// salom bu test?