import { Search, Ban } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { toast } from "sonner";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "@/store/api/authApi/authApi";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const {
  data: usersResponse,
  isLoading,
  isFetching,
  isError,
  error,
} = useGetAllUsersQuery();

const usersData = usersResponse?.data || [];

  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  React.useEffect(() => {
    if (isError) {
      const message =
        error?.data?.msg ||
        error?.data?.message ||
        "Foydalanuvchilarni yuklashda xatolik yuz berdi";
      toast.error(message);
    }
  }, [isError, error]);

  const filteredUsers = React.useMemo(() => {
    if (!usersData) return [];
    const term = searchTerm.toLowerCase().trim();
    if (!term) return usersData;
    return usersData.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
    );
  }, [usersData, searchTerm]);

  const handleDelete = async (user) => {
    if (!window.confirm(`${user.name}ni o'chirmoqchimisiz?`)) return;
    try {
      await deleteUser(user._id).unwrap();
      toast.success(`${user.name} muvaffaqiyatli o'chirildi`);
    } catch (err) {
      const message =
        err?.data?.msg ||
        err?.data?.message ||
        "Foydalanuvchini o'chirishda xatolik yuz berdi";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full max-w-xs">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Foydalanuvchi qidirish..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Foydalanuvchi</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Ro'yxatdan o'tgan</th>
              <th className="px-4 py-3 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  Foydalanuvchi topilmadi
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar fallback={user.name?.[0] || "?"} />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role === "admin" ? "Admin" : "Foydalanuvchi"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(user)}
                      disabled={deleting}
                    >
                      <Ban className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}