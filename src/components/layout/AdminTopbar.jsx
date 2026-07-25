import { Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AdminTopbar({ title }) {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar fallback="A" />
          <div className="hidden text-sm sm:block">
            <p className="font-medium leading-none">Bosh Admin</p>
            <p className="text-xs text-muted-foreground">admin@shop.uz</p>
          </div>
        </div>
      </div>
    </div>
  );
}
