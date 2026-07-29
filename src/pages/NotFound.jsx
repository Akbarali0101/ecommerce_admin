import { Link } from "react-router-dom";
import { PackageSearch, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="flex size-24 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-background">
            <PackageSearch className="size-10 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 flex size-9 items-center justify-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground shadow-sm">
            ?
          </div>
        </div>

        <div className="mb-1 flex items-center gap-2 font-mono text-5xl font-bold tracking-tight text-foreground">
          4
          <span className="inline-block h-[0.9em] w-[0.55em] rounded-sm bg-gradient-to-b from-primary via-primary/40 to-primary bg-[length:3px_100%] bg-repeat-x" />
          4
        </div>

        <h1 className="mt-3 text-xl font-semibold text-foreground">
          Bu sahifa topilmadi
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Qidirilayotgan manzil mavjud emas, ko'chirilgan yoki o'chirilgan bo'lishi mumkin.
        </p>

        <div className="mt-7 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" asChild className="gap-2">
            <Link to="/login">
              <ArrowLeft className="size-4" />
              Orqaga
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link to="/login">
              <Home className="size-4" />
              Login sahifasiga qaytish
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}