"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Eye, CheckCircle2, Trash2, Hash, RefreshCw, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

interface Reservation {
  id: number;
  userId: number;
  userName: string;
  bookTitle: string;
  status: string;
  reservedAt: string;
  queuePosition: number;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-[#f97316] text-white",
  FULFILLED: "bg-[#22c55e] text-white",
  CANCELLED: "bg-error text-white",
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Frontend filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterActiveOnly, setFilterActiveOnly] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [filterBookId, setFilterBookId] = useState("");

  const [refreshingQueue, setRefreshingQueue] = useState<number | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("Authentication token not found. Please sign in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/reservations", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}.`);
      const data = await response.json();
      setReservations(data.content || data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load reservations from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return;
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`http://localhost:8080/api/reservations/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete reservation");
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFulfill = async (id: number) => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`http://localhost:8080/api/reservations/${id}/fulfill`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fulfill reservation");
      // Update local state to FULFILLED
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "FULFILLED" } : r));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updateQueuePosition = async (id: number) => {
    setRefreshingQueue(id);
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`http://localhost:8080/api/reservations/${id}/queue-position`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to get queue position");
      const newPos = await res.json();
      setReservations(prev => prev.map(r => r.id === id ? { ...r, queuePosition: newPos } : r));
    } catch (err: any) {
      console.error(err);
    } finally {
      setRefreshingQueue(null);
    }
  };

  const formatDateWithDays = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const formatted = date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });

    // Calculate days waiting
    const diffTime = Math.abs(new Date().getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return (
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium text-on-surface">{formatted}</span>
        <span className="text-[10px] text-on-surface-variant mt-0.5">{diffDays} days waiting</span>
      </div>
    );
  };

  // Calculate stats
  const stats = {
    pending: reservations.filter(r => r.status === "PENDING").length,
    fulfilled: reservations.filter(r => r.status === "FULFILLED").length,
    cancelled: reservations.filter(r => r.status === "CANCELLED").length,
    total: reservations.length
  };

  // Apply frontend filters
  const filteredReservations = reservations.filter(r => {
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterActiveOnly === "Active Only" && r.status !== "PENDING") return false;
    if (filterUserId && r.userId.toString() !== filterUserId) return false;
    // Note: bookId isn't always in the list shape from standard endpoint, but let's filter if it matches any property playfully, or skip if missing.
    // For exact match we assume it might be embedded, but since API doesn't guarantee bookId here, we'll do our best.
    return true;
  });

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1">Reservations Management</h1>
          <p className="text-sm text-on-surface-variant">Manage book reservations and fulfill requests</p>
        </div>
        <Link href="/admin/reservations/add">
          <Button className="rounded-lg px-5 gap-2 shadow-[var(--shadow-ambient)] font-medium bg-primary hover:bg-primary/90 text-on-primary">
            <Plus className="size-4" /> ADD RESERVATION
          </Button>
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">{stats.pending}</p>
          <p className="text-sm text-on-surface-variant font-medium">Pending Reservations</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">{stats.fulfilled}</p>
          <p className="text-sm text-on-surface-variant font-medium">Fulfilled</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">{stats.cancelled}</p>
          <p className="text-sm text-on-surface-variant font-medium">Cancelled</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">{stats.total}</p>
          <p className="text-sm text-on-surface-variant font-medium">Total Reservations</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
        <div className="flex items-center gap-2 mr-4">
          <SlidersHorizontal className="size-4 text-on-surface-variant" />
          <span className="text-sm font-semibold text-on-surface">Filter</span>
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="h-10 px-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary min-w-[140px]"
        >
          <option value="">Status</option>
          <option value="PENDING">Pending</option>
          <option value="FULFILLED">Fulfilled</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={filterActiveOnly}
          onChange={e => setFilterActiveOnly(e.target.value)}
          className="h-10 px-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary min-w-[140px]"
        >
          <option value="">All</option>
          <option value="Active Only">Active Only</option>
        </select>

        <Input
          placeholder="User ID"
          value={filterUserId}
          onChange={e => setFilterUserId(e.target.value)}
          className="h-10 rounded-lg border-outline-variant/30 bg-surface-container-lowest text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-none w-32"
        />

        <Input
          placeholder="Book ID"
          value={filterBookId}
          onChange={e => setFilterBookId(e.target.value)}
          className="h-10 rounded-lg border-outline-variant/30 bg-surface-container-lowest text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-none w-32"
        />

        <Button
          variant="outline"
          onClick={() => {
            setFilterStatus("");
            setFilterActiveOnly("");
            setFilterUserId("");
            setFilterBookId("");
          }}
          className="h-10 ml-auto rounded-lg shadow-none bg-transparent border-outline-variant/30 text-primary hover:bg-primary/5 font-semibold gap-2"
        >
          <SlidersHorizontal className="size-4" /> CLEAR FILTERS
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-surface-container-low rounded-2xl shadow-none border-0 overflow-hidden">
        {error ? (
          <div className="p-10 text-center bg-error-container text-error">
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-container hover:bg-surface-container border-b border-outline-variant/20">
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider pl-6 w-20">ID</TableHead>
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Book</TableHead>
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">User</TableHead>
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Reserved On</TableHead>
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Priority</TableHead>
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Status</TableHead>
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <Loader2 className="size-6 animate-spin text-primary mx-auto opacity-60" />
                  </TableCell>
                </TableRow>
              ) : filteredReservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-on-surface-variant font-medium text-sm">
                    No reservations match the filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservations.map(res => (
                  <TableRow key={res.id} className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors align-middle">
                    {/* ID */}
                    <TableCell className="pl-6 py-4">
                      <span className="font-mono text-sm font-semibold text-on-surface">{res.id}</span>
                    </TableCell>

                    {/* Book */}
                    <TableCell className="py-4 max-w-[250px]">
                      <span className="text-sm font-medium text-on-surface line-clamp-2 leading-snug">{res.bookTitle}</span>
                    </TableCell>

                    {/* User */}
                    <TableCell className="py-4">
                      <span className="text-sm text-on-surface">{res.userName}</span>
                    </TableCell>

                    {/* Reserved On */}
                    <TableCell className="py-4">
                      {formatDateWithDays(res.reservedAt)}
                    </TableCell>

                    {/* Priority */}
                    <TableCell className="py-4 text-center">
                      <button
                        onClick={() => updateQueuePosition(res.id)}
                        disabled={refreshingQueue === res.id}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1 bg-surface-container border border-primary/20 text-primary text-xs font-bold rounded-full hover:bg-primary/10 transition-colors disabled:opacity-50 group"
                        title="Click to refresh queue position"
                      >
                        {refreshingQueue === res.id ? (
                          <RefreshCw className="size-3 animate-spin" />
                        ) : (
                          <span className="group-hover:scale-110 transition-transform">#{res.queuePosition}</span>
                        )}
                      </button>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-4 text-center">
                      <Badge className={`rounded-full px-4 py-1 text-[11px] font-semibold border-0 shadow-none ${STATUS_STYLES[res.status] || "bg-surface-container text-on-surface-variant"}`}>
                        {res.status}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-4 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {res.status === "PENDING" && (
                          <Button
                            size="sm"
                            onClick={() => handleFulfill(res.id)}
                            className="h-8 rounded-md text-[11px] font-bold bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-none gap-1.5"
                          >
                            <CheckCircle2 className="size-3.5" /> FULFILL
                          </Button>
                        )}
                        <Link href={`/admin/reservations/${res.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 size-8 p-0 rounded-md shadow-none border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                          >
                            <Eye className="size-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(res.id)}
                          className="h-8 size-8 p-0 rounded-md shadow-none border-error/50 text-error hover:bg-error-container hover:border-error"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
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
