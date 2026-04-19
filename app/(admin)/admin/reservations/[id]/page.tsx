"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, User, BookOpen, Calendar, Clock, Bookmark, XCircle, StickyNote } from "lucide-react";
import Link from "next/link";

interface ReservationDetail {
  id: number;
  userId: number;
  userName: string;
  bookId: number;
  bookTitle: string;
  bookIsbn: string;
  status: string;
  reservedAt: string;
  queuePosition: number;
  cancelledAt: string | null;
  notes: string | null;
  canBeCancelled: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-[#f97316] text-white",
  FULFILLED: "bg-[#22c55e] text-white",
  CANCELLED: "bg-error text-white",
};

function DetailRow({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: any }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-outline-variant/10 last:border-0">
      {Icon && (
        <div className="size-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="size-4 text-on-surface-variant" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">{label}</p>
        <div className="text-sm font-medium text-on-surface">{value}</div>
      </div>
    </div>
  );
}

export default function ReservationDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Authentication token not found. Please sign in again.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8080/api/reservations/${params.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Server returned ${response.status}.`);
        const data: ReservationDetail = await response.json();
        setReservation(data);
      } catch (err: any) {
        setError(err.message || "Failed to load reservation details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [params.id]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[800px] w-full animate-in fade-in duration-500">
      <Link
        href="/admin/reservations"
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="size-4" /> Back to Reservations
      </Link>

      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1">Reservation Detail</h1>
        <p className="text-sm text-on-surface-variant">Read-only view of reservation #{params.id}.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium">{error}</div>
      )}

      {loading ? (
        <div className="bg-surface-container-low rounded-2xl p-12 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary opacity-60" />
        </div>
      ) : reservation ? (
        <div className="space-y-4">

          {/* Status Banner */}
          <div className="bg-surface-container-low rounded-2xl px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bookmark className="size-5 text-primary shrink-0" />
              <span className="font-semibold text-sm text-on-surface">Reservation Record</span>
            </div>
            <div className="flex items-center gap-3">
              {reservation.status === "PENDING" && (
                <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-primary/20">
                  Priority Queue: <span className="text-primary">#{reservation.queuePosition}</span>
                </span>
              )}
              <Badge className={`rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-widest border-0 shadow-none ${STATUS_STYLES[reservation.status] || "bg-surface-container text-on-surface-variant"}`}>
                {reservation.status}
              </Badge>
            </div>
          </div>

          {/* Borrower */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Requestor</h2>
            <DetailRow label="Full Name" value={reservation.userName} icon={User} />
            <DetailRow
              label="User ID"
              value={<span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{reservation.userId}</span>}
            />
          </div>

          {/* Book Info */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Requested Book</h2>
            <DetailRow label="Title" value={reservation.bookTitle} icon={BookOpen} />
            <DetailRow
              label="Book ID"
              value={<span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{reservation.bookId}</span>}
            />
            {reservation.bookIsbn && (
               <DetailRow label="ISBN" value={<span className="font-mono text-xs">{reservation.bookIsbn}</span>} />
            )}
          </div>

          {/* Timeline */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Timeline</h2>
            <DetailRow label="Reserved On" value={formatDate(reservation.reservedAt)} icon={Calendar} />
            {reservation.status === "CANCELLED" && (
              <DetailRow label="Cancelled At" value={formatDate(reservation.cancelledAt)} icon={XCircle} />
            )}
          </div>

          {/* Notes */}
          {reservation.notes && (
            <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Admin Notes</h2>
              <DetailRow label="Notes" value={reservation.notes} icon={StickyNote} />
            </div>
          )}

          <div className="pt-2">
            <Link href="/admin/reservations">
              <Button variant="outline" className="rounded-lg shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface gap-2">
                <ArrowLeft className="size-4" /> Back to List
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
