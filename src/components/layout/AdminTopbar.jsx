import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AdminTopbar({ title }) {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar fallback="B" />
          <div className="hidden text-sm sm:block">
            <p className="font-medium">Bosh Admin</p>
            <p className="text-xs text-muted-foreground">admin@shop.uz</p>
          </div>
        </div>
      </div>
    </div>
  );
}