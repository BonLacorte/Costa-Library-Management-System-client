"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2, Eye, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Subscription {
  id: number;
  planName: string;
  userEmail: string;
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

export default function AdminUserSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [triggerMsg, setTriggerMsg] = useState("");

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("Authentication token not found. Please sign in again.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/subscriptions/admin/active?page=${page}&size=20`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error(`Server returned ${response.status}.`);
      const data: Subscription[] = await response.json();
      setSubscriptions(data);
      setHasMore(data.length === 20);
    } catch (err: any) {
      setError(err.message || "Failed to load subscriptions from server.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleTriggerExpiry = async () => {
    setTriggerLoading(true);
    setTriggerMsg("");
    try {
      const response = await fetch(
        "http://localhost:8080/api/subscriptions/admin/deactivate-expired",
        {
          method: "POST",
          headers: { "Authorization": `Bearer ${localStorage.getItem("jwt")}` }
        }
      );
      if (response.ok) {
        setTriggerMsg("Expiry check completed. Refreshing list...");
        await fetchSubscriptions();
      } else {
        setTriggerMsg(`Expiry check failed: ${response.status}`);
      }
    } catch {
      setTriggerMsg("Network error during expiry check.");
    } finally {
      setTriggerLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1">User Subscriptions</h1>
          <p className="text-sm text-on-surface-variant">Monitor active premium memberships and billing lifecycles.</p>
        </div>
        <Button
          onClick={handleTriggerExpiry}
          disabled={triggerLoading || loading}
          variant="outline"
          className="rounded-lg px-5 gap-2 shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium"
        >
          {triggerLoading
            ? <><Loader2 className="size-4 animate-spin" /> Running...</>
            : <><RefreshCw className="size-4" /> TRIGGER EXPIRY CHECK</>
          }
        </Button>
      </header>

      {/* Trigger feedback */}
      {triggerMsg && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-primary-container text-on-primary-container text-sm font-medium">
          <AlertCircle className="size-4 shrink-0" />
          {triggerMsg}
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
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider pl-6">ID</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Plan</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">User Email</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Price</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Start Date</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">End Date</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Days Left</TableHead>
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
                ) : subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center text-on-surface-variant font-medium text-sm">
                      No active subscriptions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.map(s => (
                    <TableRow key={s.id} className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors">
                      {/* ID */}
                      <TableCell className="pl-6 py-4">
                        <span className="font-mono text-xs text-outline bg-surface-container px-2 py-1 rounded">
                          {String(s.id).padStart(4, "0")}
                        </span>
                      </TableCell>

                      {/* Plan */}
                      <TableCell className="py-4">
                        <span className="text-sm font-medium text-on-surface">{s.planName}</span>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="py-4 text-sm text-on-surface-variant">
                        {s.userEmail}
                      </TableCell>

                      {/* Price */}
                      <TableCell className="py-4 text-center">
                        <span className="text-sm font-semibold text-on-surface">
                          {s.currency} {Number(s.price).toFixed(2)}
                        </span>
                      </TableCell>

                      {/* Start Date */}
                      <TableCell className="py-4 text-center text-xs text-on-surface-variant">
                        {formatDate(s.startDate)}
                      </TableCell>

                      {/* End Date */}
                      <TableCell className="py-4 text-center text-xs text-on-surface-variant">
                        {formatDate(s.endDate)}
                      </TableCell>

                      {/* Days Remaining */}
                      <TableCell className="py-4 text-center">
                        <Badge className={`rounded-full px-3 py-0.5 text-[10px] font-semibold border-0 shadow-none ${
                          s.daysRemaining > 14
                            ? "bg-primary/10 text-primary hover:bg-primary/10"
                            : s.daysRemaining > 3
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                            : "bg-error-container text-error hover:bg-error-container"
                        }`}>
                          {s.daysRemaining}d left
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 text-right pr-6">
                        <Link href={`/admin/user-subscriptions/${s.id}`}>
                          <Button variant="ghost" size="icon" className="size-8 rounded-lg text-primary hover:bg-primary/10 hover:text-primary">
                            <Eye className="size-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/15">
              <p className="text-sm text-on-surface-variant font-medium">
                Page {page + 1} · Showing {subscriptions.length} record{subscriptions.length !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                  disabled={page === 0 || loading}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                  disabled={!hasMore || loading}
                  onClick={() => setPage(p => p + 1)}
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
