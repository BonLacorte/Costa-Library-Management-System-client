"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, ArrowLeft, Calendar, Book, User, 
  DollarSign, FileText, Clock, AlertTriangle, 
  Pencil, CheckCircle2, X
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
  createdAt: string;
  updatedAt: string;
}

const STATUS_STYLES: Record<string, { bg: string, text: string, icon: any }> = {
  CHECKED_OUT: { bg: "bg-green-100", text: "text-green-700", icon: Clock },
  RETURNED:    { bg: "bg-slate-100", text: "text-slate-700", icon: CheckCircle2 },
  OVERDUE:     { bg: "bg-red-100",   text: "text-red-700",   icon: AlertTriangle },
  DAMAGED:     { bg: "bg-amber-100", text: "text-amber-700", icon: AlertTriangle },
  LOST:        { bg: "bg-red-200",   text: "text-red-900",   icon: X },
};

export default function AdminLoanDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLoan = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("jwt");
    if (!token) { setError("Auth token not found."); setLoading(false); return; }

    try {
      const res = await fetch(`http://localhost:8080/api/book-loans/${id}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}.`);
      const data = await res.json();
      setLoan(data);
    } catch (err: any) {
      setError(err.message || "Failed to load book loan details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchLoan(); }, [fetchLoan]);

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatShortDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="size-10 animate-spin text-primary opacity-60" />
        <p className="text-on-surface-variant font-medium">Loading loan details...</p>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="p-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="bg-error-container text-error p-6 rounded-2xl">
          <p className="font-semibold">{error || "Loan record not found."}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="size-4" /> Back to Loans
        </Button>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[loan.status] || { bg: "bg-slate-100", text: "text-slate-700", icon: Clock };
  const StatusIcon = statusStyle.icon;

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full hover:bg-surface-container"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-bold tracking-tight text-on-surface">Loan Details</h1>
              <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2 py-1 rounded">#{loan.id}</span>
            </div>
            <p className="text-sm text-on-surface-variant">View full information for this loan record</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href={`/admin/loans/${loan.id}/edit`}>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20">
              <Pencil className="size-4" /> Edit Loan
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
            <div className="aspect-[3/4] relative mb-6 rounded-2xl overflow-hidden bg-surface-container-highest shadow-md">
              {loan.bookCoverImage ? (
                <img src={loan.bookCoverImage} alt={loan.bookTitle} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant/40 p-10 text-center">
                  <Book className="size-16 mb-4 opacity-20" />
                  <p className="text-sm font-medium">No cover image available</p>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-on-surface leading-tight mb-1">{loan.bookTitle}</h2>
            <p className="text-sm text-on-surface-variant mb-4">by {loan.bookAuthor}</p>
            
            <div className="pt-4 border-t border-outline-variant/10">
              <Badge className={`w-full justify-center py-2 rounded-xl border-0 shadow-none text-xs font-bold gap-2 ${statusStyle.bg} ${statusStyle.text}`}>
                <StatusIcon className="size-3.5" /> {loan.status.replace("_", " ")}
              </Badge>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
              <User className="size-4" /> Borrowed By
            </h3>
            <div className="space-y-1">
              <p className="font-semibold text-on-surface">{loan.userName}</p>
              <p className="text-sm text-on-surface-variant">{loan.userEmail}</p>
              <p className="text-xs text-on-surface-variant pt-2">User ID: {loan.userId}</p>
            </div>
            <Link href={`/admin/users/${loan.userId}`} className="block mt-4">
              <Button variant="outline" className="w-full rounded-xl text-xs font-bold border-outline-variant/30">View User Profile</Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline & Dates Card */}
          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-3">
              <Calendar className="size-5 text-primary" /> Loan Timeline
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-outline-variant/30">
                  <div className="absolute left-[-4px] top-1.5 size-2 rounded-full bg-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Checkout Date</p>
                  <p className="font-semibold text-on-surface">{formatShortDate(loan.checkoutDate)}</p>
                  <p className="text-xs text-on-surface-variant">{formatDate(loan.checkoutDate).split(" at ")[1]}</p>
                </div>

                <div className="relative pl-6">
                  <div className={`absolute left-[-4px] top-1.5 size-2 rounded-full ${loan.isOverdue ? "bg-error" : "bg-on-surface-variant/30"}`} />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Due Date</p>
                  <p className={`font-semibold ${loan.isOverdue ? "text-error" : "text-on-surface"}`}>{formatShortDate(loan.dueDate)}</p>
                  {loan.isOverdue && (
                    <p className="text-xs text-error font-medium mt-1">
                      {loan.overdueDays} days overdue
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative pl-6">
                  <div className={`absolute left-[-4px] top-1.5 size-2 rounded-full ${loan.status === "RETURNED" ? "bg-green-500" : "bg-on-surface-variant/10"}`} />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Return Date</p>
                  <p className="font-semibold text-on-surface">{loan.returnDate ? formatShortDate(loan.returnDate) : "Not yet returned"}</p>
                  {loan.returnDate && <p className="text-xs text-on-surface-variant">{formatDate(loan.returnDate).split(" at ")[1]}</p>}
                </div>

                <div className="relative pl-6">
                  <div className="absolute left-[-4px] top-1.5 size-2 rounded-full bg-primary/20" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Renewals</p>
                  <p className="font-semibold text-on-surface">{loan.renewalCount} / {loan.maxRenewals}</p>
                  <p className="text-xs text-on-surface-variant mt-1">Remaining: {loan.maxRenewals - loan.renewalCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financials & Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-6 flex items-center gap-2">
                <DollarSign className="size-4" /> Fine Details
              </h3>
              
              <div className="flex-1 flex flex-col justify-center text-center py-4">
                <p className="text-3xl font-bold text-on-surface mb-2">
                  ₱{loan.fineAmount ? Number(loan.fineAmount).toFixed(2) : "0.00"}
                </p>
                <div className="flex justify-center">
                  <Badge className={`rounded-full border-0 px-4 py-1 text-[10px] font-bold ${
                    loan.finePaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {loan.finePaid ? "PAID" : "UNPAID"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
                <FileText className="size-4" /> Librarian Notes
              </h3>
              <div className="flex-1 bg-surface-container rounded-2xl p-4 text-sm text-on-surface leading-relaxed min-h-[100px] whitespace-pre-wrap">
                {loan.notes || "No notes provided for this loan."}
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <div className="flex gap-4">
                <span>Created: {new Date(loan.createdAt).toLocaleString()}</span>
                <span className="opacity-30">|</span>
                <span>Last Updated: {new Date(loan.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
