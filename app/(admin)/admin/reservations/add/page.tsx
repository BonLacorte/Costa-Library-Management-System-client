"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Loader2, BookmarkPlus } from "lucide-react";
import Link from "next/link";

export default function AdminAddReservation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");

  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) return;

        // Fetch Users
        const usersRes = await fetch("http://localhost:8080/api/users/admin/list", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (usersRes.ok) {
          const uData = await usersRes.json();
          setUsers(Array.isArray(uData) ? uData : uData.content || []);
        }

        // Fetch Books (using a large size to get all for the dropdown)
        const booksRes = await fetch("http://localhost:8080/api/books?page=0&size=1000", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (booksRes.ok) {
          const bData = await booksRes.json();
          setBooks(bData.content || bData || []);
        }
      } catch (err) {
        console.error("Failed to load users or books", err);
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !bookId) {
      setError("Both User ID and Book ID are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`http://localhost:8080/api/reservations/admin/user/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ bookId: Number(bookId) })
      });

      if (!response.ok) {
        // Try to read error message from API if present
        let errorMsg = `Server returned ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.message || errData.error) errorMsg = errData.message || errData.error;
        } catch { /* ignore parsing errors */ }
        throw new Error(errorMsg);
      }

      // Success
      router.push("/admin/reservations");
    } catch (err: any) {
      setError(err.message || "Failed to create reservation.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[600px] w-full animate-in fade-in duration-500">
      <Link
        href="/admin/reservations"
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="size-4" /> Back to Reservations
      </Link>

      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1 flex items-center gap-3">
          <BookmarkPlus className="size-7 text-primary" />
          Create Reservation
        </h1>
        <p className="text-sm text-on-surface-variant">Manually queue a book reservation for a user.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-surface-container-low rounded-2xl p-8 shadow-none border-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Select User
            </Label>
            <select
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:border-primary transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23737373%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:calc(100%-1rem)_center] bg-[length:0.6rem] disabled:opacity-50"
              required
              disabled={fetchingData}
            >
              <option value="" disabled>{fetchingData ? "Loading users..." : "Select a user..."}</option>
              {users.map((u: any) => {
                const displayName = u.fullName || u.userName || (u.firstName ? `${u.firstName} ${u.lastName || ''}` : null) || u.email || `User #${u.id}`;
                return (
                  <option key={u.id} value={u.id}>{displayName} {u.email ? `(${u.email})` : ''}</option>
                );
              })}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookId" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Select Book
            </Label>
            <select
              id="bookId"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:border-primary transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23737373%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:calc(100%-1rem)_center] bg-[length:0.6rem] disabled:opacity-50"
              required
              disabled={fetchingData}
            >
              <option value="" disabled>{fetchingData ? "Loading books..." : "Select a book..."}</option>
              {books.map((b: any) => (
                <option key={b.id} value={b.id}>{b.title} {b.isbn ? `(ISBN: ${b.isbn})` : ''}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-outline-variant/15 flex justify-end gap-3">
            <Link href="/admin/reservations">
              <Button type="button" variant="ghost" className="h-11 px-6 font-medium text-on-surface-variant hover:bg-surface-container">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="h-11 px-6 gap-2 shadow-[var(--shadow-ambient)] font-medium">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {loading ? "Creating..." : "Create Reservation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
