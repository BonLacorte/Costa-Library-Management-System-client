"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Authentication token not found. Please sign in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/users/admin/list", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Server returned ${response.status}.`);

        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load user list from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("jwt")}` }
      });

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        alert(`Failed to delete user. Server returned ${response.status}.`);
      }
    } catch (err) {
      alert("Network error — could not reach the server.");
    }
  };

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || "").includes(search)
  );

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Member Directory</h1>
          <p className="text-on-surface-variant">Manage library card holders and access privileges.</p>
        </div>
        <Button className="rounded-full shadow-none px-6 gap-2">
          <UserPlus className="size-4" /> Add User
        </Button>
      </header>

      <div className="bg-surface-container-low rounded-3xl p-8 shadow-none border-0 mb-8">
        <div className="relative w-full max-w-sm mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-outline" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email or phone..."
            className="pl-12 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none rounded-full"
          />
        </div>

        {error ? (
          <div className="p-8 text-center bg-error-container text-error rounded-2xl">
            <p className="font-medium tracking-tight">{error}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-outline-variant/30 hover:bg-transparent">
                <TableHead className="text-on-surface-variant font-medium">ID</TableHead>
                <TableHead className="text-on-surface-variant font-medium">Full Name</TableHead>
                <TableHead className="text-on-surface-variant font-medium">Email</TableHead>
                <TableHead className="text-on-surface-variant font-medium">Phone</TableHead>
                <TableHead className="text-on-surface-variant font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <Loader2 className="size-6 animate-spin text-primary mx-auto opacity-60" />
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-on-surface-variant font-medium text-sm">
                    {search ? "No members match your search." : "No registered members found."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(u => (
                  <TableRow key={u.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors">
                    <TableCell className="font-medium mono-data text-xs text-outline">
                      {String(u.id).padStart(4, "0")}
                    </TableCell>
                    <TableCell className="font-serif text-base text-on-surface">{u.fullName}</TableCell>
                    <TableCell className="text-sm text-on-surface-variant">{u.email}</TableCell>
                    <TableCell className="text-sm text-on-surface-variant">{u.phone || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(u.id)}
                        className="text-error hover:bg-error-container rounded-full size-8"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
