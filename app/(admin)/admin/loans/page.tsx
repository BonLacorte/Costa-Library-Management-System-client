"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Loader2, ChevronLeft, ChevronRight, Eye, SlidersHorizontal, X,
  CheckCircle2, AlertTriangle, RotateCcw, DollarSign, Pencil
} from "lucide-react";
import Link from "next/link";

interface Loan {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  bookId: number;
  bookTitle: string;
  bookIsbn: string;
  bookAuthor: string;
  bookCoverImage: string | null;
  type: string;
  status: string;
  checkoutDate: string;
  dueDate: string;
  remainingDays: number;
  returnDate: string | null;
  renewalCount: number;
  maxRenewals: number;
  fineAmount: number | null;
  finePaid: boolean | null;
  notes: string | null;
  isOverdue: boolean;
  overdueDays: number;
}

interface SearchBody {
  userId?: number | null;
  bookId?: number | null;
  status: string;
  overdueOnly: boolean;
  unpaidFinesOnly: boolean;
  startDate: string;
  endDate: string;
  page: number;
  size: number;
  sortBy: string;
  sortDirection: string;
}

const STATUS_STYLES: Record<string, string> = {
  CHECKED_OUT: "bg-[#22c55e] text-white",
  RETURNED:    "bg-surface-container-high text-on-surface-variant",
  OVERDUE:     "bg-error text-white",
  DAMAGED:     "bg-amber-500 text-white",
  LOST:        "bg-red-800 text-white",
};

const SORT_BY_OPTIONS = [
  { label: "Created Date", value: "createdAt" },
  { label: "Due Date", value: "dueDate" },
  { label: "Checkout Date", value: "checkoutDate" },
  { label: "Return Date", value: "returnDate" },
];

const STATUS_OPTIONS = ["", "CHECKED_OUT", "RETURNED", "OVERDUE", "LOST"];

export default function AdminLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Search body state — matches API schema exactly
  const [search, setSearch] = useState<SearchBody>({
    status: "",
    overdueOnly: false,
    unpaidFinesOnly: false,
    startDate: "",
    endDate: "",
    page: 0,
    size: 20,
    sortBy: "createdAt",
    sortDirection: "DESC",
  });

  // Derived stats from current page
  const stats = {
    active: loans.filter(l => l.status === "CHECKED_OUT").length,
    overdue: loans.filter(l => l.isOverdue).length,
    returned: loans.filter(l => l.status === "RETURNED").length,
    fines: loans.reduce((sum, l) => sum + (l.fineAmount || 0), 0),
  };

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("jwt");
    if (!token) { setError("Auth token not found."); setLoading(false); return; }

    // Build clean body — omit empty optional fields
    const body: any = {
      overdueOnly: search.overdueOnly,
      unpaidFinesOnly: search.unpaidFinesOnly,
      page: search.page,
      size: search.size,
      sortBy: search.sortBy,
      sortDirection: search.sortDirection,
    };
    if (search.status) body.status = search.status;
    if (search.startDate) body.startDate = search.startDate;
    if (search.endDate) body.endDate = search.endDate;

    try {
      const res = await fetch("http://localhost:8080/api/book-loans/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}.`);
      const data = await res.json();
      const content: Loan[] = data.content || [];
      setLoans(content);
      setHasMore(content.length === search.size);
    } catch (err: any) {
      setError(err.message || "Failed to load book loans.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchLoans(); }, [fetchLoans]);

  const update = (patch: Partial<SearchBody>) =>
    setSearch(prev => ({ ...prev, ...patch, page: "page" in patch ? patch.page! : 0 }));

  const handleAction = async (action: string, loanId: number) => {
    if (action === "EDIT") return; // Handled by Link

    const token = localStorage.getItem("jwt");
    if (!token) return;

    let status = "";
    switch (action) {
      case "RETURN": status = "RETURNED"; break;
      case "DAMAGE": status = "DAMAGED"; break;
      case "LOSS":   status = "LOST"; break;
      case "OVERDUE": status = "OVERDUE"; break;
      default: return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/book-loans/${loanId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchLoans();
    } catch (err) {
      console.error("Failed to update loan status", err);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
  };

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1">Book Loans Management</h1>
        <p className="text-sm text-on-surface-variant">Monitor and manage all book loans</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Loans", value: stats.active, color: "text-[#22c55e]", icon: CheckCircle2 },
          { label: "Overdue Loans", value: stats.overdue, color: "text-error", icon: AlertTriangle },
          { label: "Returned", value: stats.returned, color: "text-primary", icon: RotateCcw },
          { label: "Total Fines", value: `$${stats.fines.toFixed(2)}`, color: "text-amber-500", icon: DollarSign },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
            <p className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</p>
            <p className="text-sm text-on-surface-variant font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Controls: Sort + Filters toggle */}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
        {/* Sort By */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant pl-1">Sort By</label>
          <select
            value={search.sortBy}
            onChange={e => update({ sortBy: e.target.value })}
            className="h-10 px-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {SORT_BY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Sort Direction */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant pl-1">Sort Direction</label>
          <select
            value={search.sortDirection}
            onChange={e => update({ sortDirection: e.target.value })}
            className="h-10 px-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>

        {/* Filter Toggle */}
        <div className="flex flex-col gap-1 justify-end">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-transparent pl-1">·</label>
          <Button
            variant="outline"
            onClick={() => setShowFilters(v => !v)}
            className={`h-10 rounded-lg gap-2 shadow-none font-medium border px-4 ${
              showFilters
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <SlidersHorizontal className="size-4" /> FILTERS
          </Button>
        </div>
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Status</label>
              <select
                value={search.status}
                onChange={e => update({ status: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All Statuses</option>
                {["CHECKED_OUT", "RETURNED", "OVERDUE", "LOST"].map(s => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Start Date</label>
              <Input
                type="date"
                value={search.startDate}
                onChange={e => update({ startDate: e.target.value })}
                className="h-10 rounded-lg border-outline-variant/30 bg-surface-container-lowest text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-none"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">End Date</label>
              <Input
                type="date"
                value={search.endDate}
                onChange={e => update({ endDate: e.target.value })}
                className="h-10 rounded-lg border-outline-variant/30 bg-surface-container-lowest text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-none"
              />
            </div>

            {/* Page Size */}
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

            {/* Overdue Only */}
            <div className="flex items-center gap-3 pt-6">
              <input
                id="overdueOnly"
                type="checkbox"
                checked={search.overdueOnly}
                onChange={e => update({ overdueOnly: e.target.checked })}
                className="size-4 rounded accent-primary"
              />
              <label htmlFor="overdueOnly" className="text-sm font-medium text-on-surface cursor-pointer">Overdue Only</label>
            </div>

            {/* Unpaid Fines Only */}
            <div className="flex items-center gap-3 pt-6">
              <input
                id="unpaidFinesOnly"
                type="checkbox"
                checked={search.unpaidFinesOnly}
                onChange={e => update({ unpaidFinesOnly: e.target.checked })}
                className="size-4 rounded accent-primary"
              />
              <label htmlFor="unpaidFinesOnly" className="text-sm font-medium text-on-surface cursor-pointer">Unpaid Fines Only</label>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-outline-variant/15">
            <Button onClick={fetchLoans} className="rounded-lg px-6 shadow-none font-medium gap-2">
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearch({ status: "", overdueOnly: false, unpaidFinesOnly: false, startDate: "", endDate: "", page: 0, size: 20, sortBy: "createdAt", sortDirection: "DESC" });
              }}
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
          <div className="p-10 text-center bg-error-container text-error rounded-2xl">
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-container hover:bg-surface-container border-b border-outline-variant/20">
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider pl-6">Loan ID</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Book</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">User</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Checkout Date</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Due Date</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Return Date</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Status</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center">
                      <Loader2 className="size-6 animate-spin text-primary mx-auto opacity-60" />
                    </TableCell>
                  </TableRow>
                ) : loans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center text-on-surface-variant font-medium text-sm">
                      No book loans match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  loans.map(loan => (
                    <TableRow key={loan.id} className="border-b border-outline-variant/10 hover:bg-surface-container/40 transition-colors align-top">
                      {/* Loan ID */}
                      <TableCell className="pl-6 pt-5">
                        <span className="font-mono text-xs text-outline bg-surface-container px-2 py-1 rounded">
                          {loan.id}
                        </span>
                      </TableCell>

                      {/* Book */}
                      <TableCell className="pt-4 max-w-[200px]">
                        <div className="flex items-start gap-3">
                          {loan.bookCoverImage ? (
                            <img src={loan.bookCoverImage} alt={loan.bookTitle} className="w-8 h-11 object-cover rounded shadow shrink-0" />
                          ) : (
                            <div className="w-8 h-11 rounded bg-surface-container-highest shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-on-surface line-clamp-2 leading-snug">{loan.bookTitle}</p>
                            <p className="text-xs text-on-surface-variant mt-0.5">by {loan.bookAuthor}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* User */}
                      <TableCell className="pt-4 max-w-[160px]">
                        <p className="text-sm font-medium text-on-surface">{loan.userName}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5 truncate">{loan.userEmail}</p>
                      </TableCell>

                      {/* Checkout Date */}
                      <TableCell className="pt-5 text-center text-xs text-on-surface-variant">
                        {formatDate(loan.checkoutDate)}
                      </TableCell>

                      {/* Due Date */}
                      <TableCell className="pt-5 text-center text-xs font-medium">
                        <span className={loan.isOverdue ? "text-error font-semibold" : "text-on-surface"}>
                          {formatDate(loan.dueDate)}
                        </span>
                      </TableCell>

                      {/* Return Date */}
                      <TableCell className="pt-5 text-center text-xs text-on-surface-variant">
                        {formatDate(loan.returnDate)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="pt-5 text-center">
                        <Badge className={`rounded-full px-3 py-0.5 text-[10px] uppercase tracking-wider font-bold border-0 shadow-none ${STATUS_STYLES[loan.status] || "bg-surface-container text-on-surface-variant"}`}>
                          {loan.status.replace("_", " ")}
                        </Badge>
                        {loan.fineAmount != null && (
                          <p className="text-[10px] text-error font-semibold mt-1">₱{Number(loan.fineAmount).toFixed(2)}</p>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pt-4 pr-6">
                        <div className="flex flex-col items-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleAction("RETURN", loan.id)}
                            className="h-7 w-28 rounded-md text-[11px] font-bold bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-none gap-1.5"
                          >
                            <CheckCircle2 className="size-3.5" /> RETURN
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAction("DAMAGE", loan.id)}
                            className="h-7 w-28 rounded-md text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-none gap-1.5"
                          >
                            <AlertTriangle className="size-3.5" /> DAMAGE
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAction("LOSS", loan.id)}
                            className="h-7 w-28 rounded-md text-[11px] font-bold bg-error hover:bg-error/90 text-white shadow-none gap-1.5"
                          >
                            <X className="size-3.5" /> LOSS
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAction("OVERDUE", loan.id)}
                            className="h-7 w-28 rounded-md text-[11px] font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-none gap-1.5"
                          >
                            <AlertTriangle className="size-3.5" /> OVERDUE
                          </Button>
                          <Link href={`/admin/loans/${loan.id}/edit`} className="w-28">
                            <Button
                              size="sm"
                              className="h-7 w-full rounded-md text-[11px] font-bold bg-primary hover:bg-primary/90 text-on-primary shadow-none gap-1.5"
                            >
                              <Pencil className="size-3.5" /> EDIT
                            </Button>
                          </Link>
                          <Link href={`/admin/loans/${loan.id}`} className="w-28">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-full rounded-md text-[11px] font-bold shadow-none gap-1.5 border-outline-variant/30 bg-transparent text-on-surface-variant hover:bg-surface-container"
                            >
                              <Eye className="size-3.5" /> VIEW
                            </Button>
                          </Link>
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
                Page {search.page + 1} · {loans.length} record{loans.length !== 1 ? "s" : ""}
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
