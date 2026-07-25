import { Link } from "react-router-dom";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-sm py-8">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex items-center gap-1.5 text-primary">
            <ShoppingBag className="size-6" />
            <span className="text-lg font-bold">Bozorcha</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <ShieldCheck className="size-4" />
            Admin panel
          </div>
          <CardTitle className="text-xl">Boshqaruv paneliga kirish</CardTitle>
          <CardDescription>Faqat administratorlar uchun</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@shop.uz" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Parol</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="mt-1 w-full">
              Kirish
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Admin hisobi backend orqali <code>/auth/signup-admin</code> bilan yaratiladi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
