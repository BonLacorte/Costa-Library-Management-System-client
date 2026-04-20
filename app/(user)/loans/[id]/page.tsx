"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookMarked, CalendarDays, Loader2, CheckCircle2, RotateCw, BookUp, RefreshCw, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
  bookCoverImage?: string;
  status: string;
  checkoutDate: string;
  dueDate: string;
  returnDate?: string;
  renewalCount: number;
  maxRenewals: number;
  notes?: string;
}

export default function LoanDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  // Modal States
  const [modalType, setModalType] = useState<"checkin" | "renew" | null>(null);
  const [modalNotes, setModalNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    paramsPromise.then(p => setResolvedParams(p));
  }, [paramsPromise]);

  const fetchLoan = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      const response = await fetch(`http://localhost:8080/api/book-loans/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      
      const data = await response.json();
      setLoan(data);
    } catch (err: any) {
      setError(err.message || "Failed to load loan details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resolvedParams?.id) {
      fetchLoan(resolvedParams.id);
    }
  }, [resolvedParams]);

  const openModal = (type: "checkin" | "renew") => {
    setModalType(type);
    setModalNotes("");
  };

  const closeModal = () => {
    setModalType(null);
    setModalNotes("");
  };

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loan || !modalType) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const isRenew = modalType === "renew";
      
      const payload = isRenew ? {
        bookLoanId: loan.id,
        extensionDays: 14,
        notes: modalNotes || "Extension requested via User Portal"
      } : {
        bookLoanId: loan.id,
        condition: "RETURNED",
        notes: modalNotes || "Returned via User Portal"
      };

      const endpoint = isRenew ? "renew" : "checkin";

      const response = await fetch(`http://localhost:8080/api/book-loans/${endpoint}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errMessage = `Failed: Server returned ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.message || errData.error) errMessage = errData.message || errData.error;
        } catch { /* ignore */ }
        throw new Error(errMessage);
      }

      alert(`Successfully ${isRenew ? 'renewed' : 'returned'} the book!`);
      closeModal();
      if (resolvedParams?.id) fetchLoan(resolvedParams.id);
    } catch (err: any) {
      alert(err.message || "An error occurred during the action.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !resolvedParams) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] w-full flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary opacity-60" />
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] w-full p-10 flex flex-col items-center justify-center text-center">
        <AlertCircle className="size-16 text-error opacity-60 mb-4" />
        <h2 className="text-2xl font-bold text-on-surface mb-2">Loan Not Found</h2>
        <p className="text-on-surface-variant mb-8">{error || "Could not retrieve the loan details."}</p>
        <Link href="/loans">
          <Button variant="outline" className="font-bold border-primary/20 text-primary">Go Back to Loans</Button>
        </Link>
      </div>
    );
  }

  const isCheckoutPhase = loan.status === "CHECKED_OUT" || loan.status === "OVERDUE";

  return (
    <div className="min-h-screen bg-[#f8f9fc] w-full animate-in fade-in duration-500 pb-20">
      
      {/* Top Navigation Strip */}
      <div className="bg-white border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-[1200px] mx-auto">
          <button
            onClick={() => router.push("/loans")}
            className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to My Loans
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 pt-10">
        
        {/* Header Title */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
              Loan Details
            </h1>
            <p className="text-sm text-on-surface-variant flex items-center gap-2">
              <BookMarked className="size-4" /> Loan ID: #{loan.id}
            </p>
          </div>
          
          <div className={`px-5 py-2 rounded-full border flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${
            loan.status === 'RETURNED' ? 'bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]' :
            loan.status === 'OVERDUE' ? 'bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]' :
            'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]'
          }`}>
            <CheckCircle2 className="size-4" />
            {loan.status.replace('_', ' ')}
          </div>
        </header>

        {/* Main Content Layout */}
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            {/* Left Column (Cover and Book Details) */}
            <div className="w-full md:w-1/3 bg-surface-container-lowest border-r border-outline-variant/10 p-8 flex flex-col items-center text-center">
              <div className="w-full max-w-[200px] aspect-[2/3] rounded-xl overflow-hidden shadow-md border border-outline-variant/10 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={loan.bookCoverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"} 
                  alt={loan.bookTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">{loan.bookTitle}</h3>
              <p className="text-sm font-medium text-on-surface-variant mb-4">{loan.bookAuthor || "Unknown Author"}</p>
              
              <Link href={`/books/${loan.bookId}`} className="w-full">
                <Button variant="outline" className="w-full font-bold shadow-none text-xs">
                  View Full Book Catalog
                </Button>
              </Link>
            </div>

            {/* Right Column (Loan Specific Details) */}
            <div className="w-full md:w-2/3 p-8 flex flex-col">
              <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-6 border-b border-outline-variant/15 pb-2">
                Checkout Details
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/15">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Checkout Date</p>
                  <p className="text-base font-medium text-on-surface flex items-center gap-2">
                    <CalendarDays className="size-5 text-primary" />
                    {new Date(loan.checkoutDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className={`p-5 rounded-xl border border-outline-variant/15 ${loan.status === 'OVERDUE' ? 'bg-[#fef2f2] border-[#fee2e2]' : 'bg-surface-container-lowest'}`}>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Due Date</p>
                  <p className={`text-base font-medium flex items-center gap-2 ${loan.status === 'OVERDUE' ? 'text-[#dc2626]' : 'text-on-surface'}`}>
                    <CalendarDays className="size-5" />
                    {new Date(loan.dueDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/15 sm:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                      <RotateCw className="size-4" /> Renewals Used
                    </p>
                    <span className="text-sm font-bold">{loan.renewalCount} of {loan.maxRenewals || 2}</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2 mt-3">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${(loan.renewalCount / Math.max(loan.maxRenewals || 1, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              {loan.notes && (
                <div className="bg-[#f8f9fc] p-5 rounded-xl border border-outline-variant/15 mb-10 text-sm">
                  <h5 className="font-bold text-on-surface mb-2 flex items-center gap-2">
                    <AlertCircle className="size-4 text-primary" /> Staff/System Notes
                  </h5>
                  <p className="text-on-surface-variant leading-relaxed">
                    {loan.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {isCheckoutPhase && (
                <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-6 border-t border-outline-variant/15">
                  <Button 
                    onClick={() => openModal("renew")}
                    disabled={loan.renewalCount >= (loan.maxRenewals || 2)}
                    variant="outline" 
                    className="flex-1 h-12 font-bold border-[#eab308]/30 text-[#ca8a04] hover:bg-[#fefce8] disabled:opacity-50"
                  >
                    <RefreshCw className="size-4 mr-2" /> Renew (14 Days)
                  </Button>
                  
                  <Button 
                    onClick={() => openModal("checkin")}
                    className="flex-1 h-12 font-bold bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-md shadow-green-200"
                  >
                    <BookUp className="size-4 mr-2" /> Return Book
                  </Button>
                </div>
              )}

              {!isCheckoutPhase && (
                <div className="mt-auto pt-6 border-t border-outline-variant/15 text-center">
                  <p className="text-sm font-bold text-on-surface-variant bg-surface-container py-3 rounded-lg">
                    This loan is closed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Modal Overlay */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              modalType === "renew" ? "bg-[#fefce8] border-[#fef08a]" : "bg-[#f0fdf4] border-[#bbf7d0]"
            }`}>
              <h3 className={`font-bold text-lg flex items-center gap-2 ${
                modalType === "renew" ? "text-[#ca8a04]" : "text-[#16a34a]"
              }`}>
                {modalType === "renew" ? <RefreshCw className="size-5" /> : <BookUp className="size-5" />}
                {modalType === "renew" ? "Confirm Renewal" : "Confirm Return"}
              </h3>
              <button onClick={closeModal} className="text-black/40 hover:text-black/70 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleActionSubmit} className="p-6">
              <div className="mb-6">
                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                  You are about to {modalType === "renew" ? "extend the due date for" : "return"} 
                  <strong className="text-on-surface"> {loan.bookTitle}</strong>. 
                  {modalType === "renew" && " This will add 14 days to your current due date."}
                </p>

                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Optional Notes
                </label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="E.g., I loved this book!"
                  className="w-full h-24 p-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={closeModal} className="font-bold text-on-surface-variant hover:bg-surface-container">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={actionLoading} 
                  className={`font-bold shadow-md ${
                    modalType === "renew" 
                      ? "bg-[#eab308] hover:bg-[#ca8a04] text-white shadow-yellow-200" 
                      : "bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-green-200"
                  }`}
                >
                  {actionLoading && <Loader2 className="size-4 animate-spin mr-2" />}
                  {modalType === "renew" ? "Confirm Renew" : "Confirm Return"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
