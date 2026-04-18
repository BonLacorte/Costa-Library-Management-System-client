"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, User, Mail, BookOpen, Calendar, Clock, AlertTriangle, RotateCcw, StickyNote } from "lucide-react";
import Link from "next/link";

interface LoanDetail {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  bookId: number;
  bookTitle: string;
  status: string;
  checkoutDate: string;
  dueDate: string;
  remainingDays: number;
  returnDate: string | null;
  renewalCount: number;
  maxRenewals: number;
  fineAmount: number | null;
  notes: string | null;
  isOverdue: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  CHECKED_OUT: "bg-primary/10 text-primary",
  RETURNED:    "bg-surface-container-high text-on-surface-variant",
  OVERDUE:     "bg-error-container text-error",
  DAMAGED:     "bg-amber-100 text-amber-700",
  LOST:        "bg-error-container/70 text-error",
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

export default function LoanDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const [loan, setLoan] = useState<LoanDetail | null>(null);
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
        const response = await fetch(`http://localhost:8080/api/book-loans/${params.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Server returned ${response.status}.`);
        const data: LoanDetail = await response.json();
        setLoan(data);
      } catch (err: any) {
        setError(err.message || "Failed to load loan details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [params.id]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[800px] w-full animate-in fade-in duration-500">
      <Link
        href="/admin/loans"
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="size-4" /> Back to Book Loans
      </Link>

      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1">Loan Detail</h1>
        <p className="text-sm text-on-surface-variant">Read-only view of loan record #{params.id}.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium">{error}</div>
      )}

      {loading ? (
        <div className="bg-surface-container-low rounded-2xl p-12 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary opacity-60" />
        </div>
      ) : loan ? (
        <div className="space-y-4">

          {/* Status + Overdue Banner */}
          <div className={`rounded-2xl px-6 py-4 flex items-center justify-between gap-4 ${
            loan.isOverdue ? "bg-error-container" : "bg-surface-container-low"
          }`}>
            <div className="flex items-center gap-3">
              {loan.isOverdue && <AlertTriangle className="size-5 text-error shrink-0" />}
              <span className={`font-semibold text-sm ${loan.isOverdue ? "text-error" : "text-on-surface"}`}>
                {loan.isOverdue ? "This loan is OVERDUE" : "Loan Record"}
              </span>
            </div>
            <Badge className={`rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-0 shadow-none ${STATUS_STYLES[loan.status] || "bg-surface-container text-on-surface-variant"}`}>
              {loan.status.replace("_", " ")}
            </Badge>
          </div>

          {/* Borrower */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Borrower</h2>
            <DetailRow label="Full Name" value={loan.userName} icon={User} />
            <DetailRow label="Email" value={loan.userEmail} icon={Mail} />
            <DetailRow
              label="User ID"
              value={<span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{loan.userId}</span>}
            />
          </div>

          {/* Book Info */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Book</h2>
            <DetailRow label="Title" value={loan.bookTitle} icon={BookOpen} />
            <DetailRow
              label="Book ID"
              value={<span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{loan.bookId}</span>}
            />
          </div>

          {/* Loan Dates */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Loan Period</h2>
            <DetailRow label="Checkout Date" value={formatDate(loan.checkoutDate)} icon={Calendar} />
            <DetailRow
              label="Due Date"
              value={
                <span className={loan.isOverdue ? "text-error font-semibold" : ""}>
                  {formatDate(loan.dueDate)}
                </span>
              }
              icon={Calendar}
            />
            <DetailRow label="Return Date" value={formatDate(loan.returnDate)} icon={Calendar} />
            <DetailRow
              label="Days Remaining"
              value={
                <span className={`font-semibold ${loan.remainingDays < 0 ? "text-error" : loan.remainingDays <= 3 ? "text-amber-600" : "text-primary"}`}>
                  {loan.remainingDays < 0 ? `${Math.abs(loan.remainingDays)} days overdue` : `${loan.remainingDays} days`}
                </span>
              }
              icon={Clock}
            />
          </div>

          {/* Renewals & Fines */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Renewals & Fines</h2>
            <DetailRow
              label="Renewals Used"
              value={
                <div className="flex items-center gap-2">
                  <span>{loan.renewalCount} / {loan.maxRenewals}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: loan.maxRenewals }).map((_, i) => (
                      <div key={i} className={`size-2 rounded-full ${i < loan.renewalCount ? "bg-primary" : "bg-surface-container-high"}`} />
                    ))}
                  </div>
                </div>
              }
              icon={RotateCcw}
            />
            <DetailRow
              label="Fine Amount"
              value={
                loan.fineAmount != null
                  ? <span className="font-semibold text-error">₱ {Number(loan.fineAmount).toFixed(2)}</span>
                  : <span className="text-on-surface-variant">No fine</span>
              }
            />
          </div>

          {/* Notes */}
          {loan.notes && (
            <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Notes</h2>
              <DetailRow label="Admin Notes" value={loan.notes} icon={StickyNote} />
            </div>
          )}

          <div className="pt-2">
            <Link href="/admin/loans">
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
