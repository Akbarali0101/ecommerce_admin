import { useEffect, useState } from "react";

const REG_KEY = "super-secret-admin-reg-key-43kjdsa8734nb-v09324jbc987-324msc098fh";
const DEFAULT_ADMIN = {
  name: "Admin",
  email: "admin@shop.uz",
  password: "Admin12345!",
};

// Auto-login: sahifa ochilganda avtomatik ravishda admin tokenini olib
// localStorage ga saqlaydi. Bu komponent hech narsa chizmaydi — faqat
// bootstrap vazifasini bajaradi.
//
// Algoritm:
//   1. Agar localStorage'da token bo'lsa — ishlatamiz
//   2. Aks holda /auth/signup-admin (signup) — admin mavjud bo'lmasa yaratadi
//   3. Keyin /auth/login — token olib localStorage ga saqlaydi
//   4. Login xato bo'lsa — boshqa default admin bilan urinib ko'radi
export function AutoAuth() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const existing = localStorage.getItem("token");
    if (existing) {
      setStatus("ready");
      return;
    }

    const tryLogin = async (email, password) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data?.token) {
          localStorage.setItem("token", data.token);
          return true;
        }
      } catch {
        /* network xato bo'lsa pastga tushadi */
      }
      return false;
    };

    const trySignup = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup-admin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reg_key: REG_KEY, ...DEFAULT_ADMIN }),
        });
      } catch {
        /* signup xato bo'lsa ham login urinib ko'radi */
      }
    };

    const bootstrap = async () => {
      // Avval signup qilib ko'ramiz (agar admin mavjud bo'lmasa yaratadi)
      await trySignup();
      // Keyin login
      const ok = await tryLogin(DEFAULT_ADMIN.email, DEFAULT_ADMIN.password);
      if (ok) {
        setStatus("ready");
        // Token o'zgargani uchun sahifani reload qilib, barcha hooklar
        // yangi token bilan qayta so'rov yuboradi
        window.location.reload();
      } else {
        setStatus("failed");
      }
    };

    bootstrap();
  }, []);

  if (status === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
        <div className="max-w-md rounded-lg border border-destructive/20 bg-background p-6 text-center">
          <h2 className="text-lg font-semibold text-destructive">Backend bilan ulanib bo'lmadi</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Backend <code className="rounded bg-muted px-1">http://localhost:5757</code> ishlamayapti yoki admin
            yaratib bo'lmadi. Iltimos, backend serverini tekshiring.
          </p>
        </div>
      </div>
    );
  }

  return null;
}