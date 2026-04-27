"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Loader2, ChevronLeft, ChevronRight, SlidersHorizontal,
  Banknote, ShieldMinus, Trash2, X, Plus
} from "lucide-react";
import Link from "next/link";

interface Fine {
  id: number;
  userName: string;
  userEmail?: string;
  bookTitle: string;
  bookIsbn?: string;
  type: string;
  amount: number;
  amountPaid: number;
  status: string;
  reason: string;
  createdAt: string;
}

interface SearchBody {
  status: string;
  type: string;
  userId: string;
  page: number;
  size: number;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-[#f97316] text-white",
  PAID: "bg-[#22c55e] text-white",
  WAIVED: "bg-surface-container-high text-on-surface-variant",
};

export default function AdminFines() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState<SearchBody>({
    status: "",
    type: "",
    userId: "",
    page: 0,
    size: 20,
  });

  const update = (patch: Partial<SearchBody>) =>
    setSearch(prev => ({ ...prev, ...patch, page: "page" in patch ? patch.page! : 0 }));

  const fetchFines = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("Authentication token not found. Please sign in again.");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("page", search.page.toString());
      params.append("size", search.size.toString());
      if (search.status) params.append("status", search.status);
      if (search.type) params.append("type", search.type);
      if (search.userId) params.append("userId", search.userId);

      const response = await fetch(`http://localhost:8080/api/fines?${params.toString()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}.`);
      const data = await response.json();
      const content: Fine[] = data.content || [];
      setFines(content);
      setHasMore(content.length === search.size);
    } catch (err: any) {
      setError(err.message || "Failed to load fines from server.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchFines();
  }, [fetchFines]);

  const handleAction = (action: string, fineId: number) => {
    console.log(`[Fines] Action: ${action} | Fine ID: ${fineId}`);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "numeric", day: "numeric" });
  };

  // Derive stats from current page
  const stats = {
    pending: fines.filter(f => f.status === "PENDING").length,
    paid: fines.filter(f => f.status === "PAID").length,
    collected: fines.reduce((sum, f) => sum + (Number(f.amountPaid) || 0), 0),
    outstanding: fines.filter(f => f.status === "PENDING").reduce((sum, f) => sum + (Number(f.amount) - Number(f.amountPaid)), 0),
  };

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1">Fines Management</h1>
        <p className="text-sm text-on-surface-variant">Monitor and manage all library fines</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-[#f97316]">{stats.pending}</p>
          <p className="text-sm text-on-surface-variant font-medium">Pending Fines</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-[#22c55e]">{stats.paid}</p>
          <p className="text-sm text-on-surface-variant font-medium">Paid Fines</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">₱{stats.collected.toFixed(2)}</p>
          <p className="text-sm text-on-surface-variant font-medium">Total Collected</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-error">₱{stats.outstanding.toFixed(2)}</p>
          <p className="text-sm text-on-surface-variant font-medium">Total Outstanding</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-end gap-3 mb-4">
        <Link href="/admin/fines/create">
          <Button
            className="h-10 rounded-lg gap-2 shadow-lg shadow-primary/20 font-bold px-4 bg-primary text-on-primary"
          >
            <Plus className="size-4" /> CREATE FINE
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={() => setShowFilters(v => !v)}
          className={`h-10 rounded-lg gap-2 shadow-none font-medium border px-4 ${
            showFilters
              ? "bg-primary text-on-primary border-primary"
              : "bg-surface-container-lowest border-outline-variant/30 text-primary hover:bg-surface-container"
          }`}
        >
          <SlidersHorizontal className="size-4" /> FILTERS
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-surface-container-low rounded-2xl p-6 mb-4 border-0 shadow-none animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-on-surface">Advanced Filters</h3>
            <button onClick={() => setShowFilters(false)} className="text-on-surface-variant hover:text-on-surface">
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Status</label>
              <select
                value={search.status}
                onChange={e => update({ status: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="WAIVED">WAIVED</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Type</label>
              <select
                value={search.type}
                onChange={e => update({ type: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All Types</option>
                <option value="OVERDUE">OVERDUE</option>
                <option value="DAMAGE">DAMAGE</option>
                <option value="LOSS">LOSS</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">User ID</label>
              <Input
                placeholder="e.g. 123"
                value={search.userId}
                onChange={e => update({ userId: e.target.value })}
                className="h-10 rounded-lg border-outline-variant/30 bg-surface-container-lowest text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Rows per Page</label>
              <select
                value={search.size}
                onChange={e => update({ size: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} rows</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-outline-variant/15">
            <Button onClick={fetchFines} className="rounded-lg px-6 shadow-none font-medium gap-2">
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => setSearch({ status: "", type: "", userId: "", page: 0, size: 20 })}
              className="rounded-lg shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
            >
              Reset All
            </Button>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-surface-container-low rounded-2xl shadow-none border-0 overflow-hidden">
        {error ? (
          <div className="p-10 text-center bg-error-container text-error">
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-container hover:bg-surface-container border-b border-outline-variant/20">
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider pl-6">Fine ID</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">User</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Book</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Type</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-right">Amount</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-right">Paid</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Status</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Reason</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Created</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-48 text-center">
                      <Loader2 className="size-6 animate-spin text-primary mx-auto opacity-60" />
                    </TableCell>
                  </TableRow>
                ) : fines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-48 text-center text-on-surface-variant font-medium text-sm">
                      No fines match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  fines.map(fine => (
                    <TableRow key={fine.id} className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors align-top">
                      {/* ID */}
                      <TableCell className="pl-6 pt-5">
                        <span className="font-mono text-xs font-semibold text-on-surface">{fine.id}</span>
                      </TableCell>

                      {/* User */}
                      <TableCell className="pt-4 max-w-[160px]">
                        <p className="text-sm font-medium text-on-surface">{fine.userName}</p>
                        {fine.userEmail && <p className="text-xs text-on-surface-variant mt-0.5 truncate">{fine.userEmail}</p>}
                      </TableCell>

                      {/* Book */}
                      <TableCell className="pt-4 max-w-[200px]">
                        <span className="text-sm text-on-surface line-clamp-2 leading-snug">{fine.bookTitle}</span>
                        {fine.bookIsbn && <span className="text-[10px] text-on-surface-variant mt-0.5 block">ISBN: {fine.bookIsbn}</span>}
                      </TableCell>

                      {/* Type */}
                      <TableCell className="pt-5 text-center">
                        <Badge className={`rounded-full px-3 py-0.5 text-[10px] uppercase tracking-wider font-semibold border-0 shadow-none ${
                          fine.type === "LOSS" ? "bg-[#f43f5e] text-white" :
                          fine.type === "DAMAGE" ? "bg-[#f97316] text-white" :
                          "bg-surface-container-high text-on-surface-variant"
                        }`}>
                          {fine.type || "OTHER"}
                        </Badge>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="pt-5 font-semibold text-on-surface text-right">
                        ₱{Number(fine.amount).toFixed(2)}
                      </TableCell>

                      {/* Amount Paid */}
                      <TableCell className="pt-5 font-semibold text-[#22c55e] text-right">
                        ₱{Number(fine.amountPaid).toFixed(2)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="pt-5 text-center">
                        <Badge className={`rounded-full px-3 py-0.5 text-[10px] font-medium border-0 shadow-none ${STATUS_STYLES[fine.status] || "bg-surface-container text-on-surface-variant"}`}>
                          {fine.status}
                        </Badge>
                      </TableCell>

                      {/* Reason */}
                      <TableCell className="pt-5 text-xs text-on-surface-variant max-w-[180px]">
                        <span className="line-clamp-2">{fine.reason}</span>
                      </TableCell>

                      {/* Created Date */}
                      <TableCell className="pt-5 text-center text-xs text-on-surface-variant">
                        {formatDate(fine.createdAt)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pt-4 pr-6">
                        <div className="flex flex-col items-end gap-1.5">
                          {fine.status === "PENDING" ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAction("Payment", fine.id)}
                                className="h-7 w-24 rounded-md text-[11px] font-bold bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-none gap-1.5 justify-start pl-2.5"
                              >
                                <Banknote className="size-3.5" /> PAYMENT
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction("Waived", fine.id)}
                                className="h-7 w-24 rounded-md text-[11px] font-bold shadow-none gap-1.5 border-[#f97316] text-[#f97316] hover:bg-[#fff7ed] justify-start pl-2.5"
                              >
                                <ShieldMinus className="size-3.5" /> WAIVED
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction("Delete", fine.id)}
                                className="h-7 w-24 rounded-md text-[11px] font-bold shadow-none gap-1.5 border-error/50 text-error hover:bg-error-container hover:border-error justify-start pl-2.5"
                              >
                                <Trash2 className="size-3.5" /> DELETE
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction("Delete", fine.id)}
                              className="h-7 w-24 rounded-md text-[11px] font-bold shadow-none gap-1.5 border-error/50 text-error hover:bg-error-container hover:border-error justify-start pl-2.5"
                            >
                              <Trash2 className="size-3.5" /> DELETE
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/15">
              <p className="text-sm text-on-surface-variant font-medium">
                Page {search.page + 1} · {fines.length} record{fines.length !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                  disabled={search.page === 0 || loading}
                  onClick={() => update({ page: search.page - 1 })}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                  disabled={!hasMore || loading}
                  onClick={() => update({ page: search.page + 1 })}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
