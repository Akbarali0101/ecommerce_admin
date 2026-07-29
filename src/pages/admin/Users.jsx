import { Search, Ban } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const mockUsers = [
  { _id: "u1", name: "Aziz Karimov", email: "aziz@mail.uz", role: "user", createdAt: "2026-05-01" },
  { _id: "u2", name: "Malika Yusupova", email: "malika@mail.uz", role: "user", createdAt: "2026-05-14" },
  { _id: "u3", name: "Bosh Admin", email: "admin@shop.uz", role: "admin", createdAt: "2026-01-01" },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [usersData, setUsersData] = React.useState([]);

  // Simulate loading state
  const [loading, setLoading] = React.useState(true);

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  // Fetch mock data (simulate async)
  React.useEffect(() => {
    let timeoutId = setTimeout(() => {
      setUsersData(mockUsers);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [mockUsers]);

  const isAdmin = usersData.some(user => user.role === "admin" && user.email === "admin@shop.uz");

  const filteredUsers = React.useMemo(() => {
    if (!usersData) return [];
    const term = searchTerm.toLowerCase().trim();
    if (!term) return usersData;
    return usersData.filter(
      user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
    );
  }, [usersData, searchTerm]);

  if (loading) {
    return <div className="flex h-[200px] items-center justify-center">Loading user info...</div>;
  }

  // If not admin, show only the current user's info
  if (!isAdmin) {
    const currentUser = usersData.find(u => u.email === "aziz@mail.uz"); // example non-admin
    return (
      <div className="flex flex-col gap-4">
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Your Profile</h2>
          <div className="flex items-center gap-4">
            <Avatar fallback={currentUser?.name?.[0] || "?"} size={48} />
            <div>
              <p className="font-medium">{currentUser?.name}</p>
              <p className="text-muted-foreground">{currentUser?.email}</p>
              <p className="text-xs text-muted-foreground">Role: {currentUser?.role}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin view
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Foydalanuvchi qidirish..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => {
            // refresh mock data
            setLoading(true);
            setTimeout(() => {
              setUsersData(mockUsers);
              setLoading(false);
            }, 500);
          }}>
            Refresh
          </Button>
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
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
                      setSelectedUser(user);
                      setDialogOpen(true);
                    }}>
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
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (window.confirm("Delete this user?")) {
                            // remove from state
                            setUsersData(prev => prev.filter(u => u._id !== user._id));
                          }
                        }}
                      >
                        <Ban className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* User Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-96 sm:w-[400px]"> 
          <DialogHeader className="space-y-2">
            <DialogTitle>Foydalanuvchi ma'lumotlari</DialogTitle>
            {selectedUser ? (
              <DialogDescription className="space-y-1">
                <p><strong>Ism:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Rol:</strong> {selectedUser.role}</p>
                <p><strong>Ro'yxatdan o'tgan sana:</strong> {selectedUser.createdAt}</p>
                <p><strong>ID:</strong> {selectedUser._id}</p>
              </DialogDescription>
            ) : (
              <p>Ma'lumot yo'q</p>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Yopish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}