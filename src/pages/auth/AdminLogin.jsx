import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const API_URL = "http://localhost:5757";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!navigator.onLine) {
      toast.error("Offline: internet aloqasi yo'q. Ulanishni tekshiring.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        toast.error(data?.msg || data?.message || "Email yoki parol noto'g'ri");
        return;
      }

      // Faqat role === "admin" bo'lganlarga ruxsat berish
      if (data?.data?.role !== "admin") {
        toast.error("Sizda admin huquqi yo'q");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.data));

      toast.success(`Xush kelibsiz, ${data.data.name}`);
      navigate("/");
    } catch (err) {
      if (err instanceof TypeError) {
        toast.error("Offline: serverga ulanib bo'lmadi. Internetni tekshiring.");
      } else {
        toast.error(err?.message || "Kutilmagan xatolik. Qayta urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  }

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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@shop.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="mt-1 w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Tekshirilmoqda...
                </>
              ) : (
                "Kirish"
              )}
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