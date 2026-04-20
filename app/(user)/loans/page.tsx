"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookMarked, CalendarDays, Loader2, CheckCircle2, RotateCw, BookUp, RefreshCw, X, BookOpen, User, Clock, XCircle } from "lucide-react";
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

const TABS = ["All", "Active", "Overdue", "Returned", "Lost", "Damaged"];

export default function MyLoansPage() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Modal States
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [modalType, setModalType] = useState<"checkin" | "renew" | null>(null);
  const [modalNotes, setModalNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLoans = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      const response = await fetch("http://localhost:8080/api/book-loans/my", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      
      const data = await response.json();
      setLoans(data.content || []);
    } catch (err: any) {
      setError(err.message || "Failed to load your loans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const openModal = (loan: Loan, type: "checkin" | "renew") => {
    setSelectedLoan(loan);
    setModalType(type);
    setModalNotes("");
  };

  const closeModal = () => {
    setSelectedLoan(null);
    setModalType(null);
    setModalNotes("");
  };

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan || !modalType) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const isRenew = modalType === "renew";
      
      const payload = isRenew ? {
        bookLoanId: selectedLoan.id,
        extensionDays: 14,
        notes: modalNotes || "Extension requested via User Portal"
      } : {
        bookLoanId: selectedLoan.id,
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
      fetchLoans(); // Refresh the list
    } catch (err: any) {
      alert(err.message || "An error occurred during the action.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredLoans = loans.filter((loan) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return loan.status === "CHECKED_OUT";
    return loan.status.toUpperCase() === activeTab.toUpperCase();
  });

  return (
    <div className="min-h-screen bg-[#f8f9fc] w-full animate-in fade-in duration-500 relative">
      
      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-20">
        {/* Header */}
        <header className="mb-10 flex items-start gap-4">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
            <BookMarked className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">
              My Borrowed Books
            </h1>
            <p className="text-on-surface-variant">
              Manage your book loans, track due dates, and renew books
            </p>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex overflow-x-auto custom-scrollbar gap-1 mb-8 bg-white p-1.5 rounded-xl border border-outline-variant/15 shadow-sm w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? "bg-primary text-white shadow-md" 
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-outline-variant/15 p-20 flex flex-col items-center justify-center shadow-sm">
            <Loader2 className="size-10 animate-spin text-primary opacity-60 mb-4" />
            <p className="text-on-surface-variant font-medium">Fetching your loans...</p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-outline-variant/15 p-20 flex flex-col items-center justify-center shadow-sm text-center">
            <div className="size-20 rounded-full bg-[#22c55e] flex items-center justify-center mb-6 shadow-lg shadow-green-100">
              <CheckCircle2 className="size-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Great Job!</h2>
            <p className="text-on-surface-variant">
              You don't have any {activeTab !== "All" ? activeTab.toLowerCase() : ""} books. Keep up the good work!
            </p>
            <Button onClick={() => router.push("/books")} className="mt-8 font-bold px-8 h-12 shadow-md">
              BROWSE MORE BOOKS
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLoans.map((loan) => (
              <div key={loan.id} className="bg-white rounded-xl border border-outline-variant/15 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  {/* Image Area */}
                  <div className="relative h-[220px] bg-surface-container-lowest border-b border-outline-variant/10">
                    {loan.bookCoverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={loan.bookCoverImage}
                        alt={loan.bookTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container/50 text-outline">
                        <BookOpen className="size-10 mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-wider opacity-60">No Photo</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                        loan.status === 'RETURNED' ? 'bg-[#22c55e]' :
                        loan.status === 'OVERDUE' ? 'bg-[#ef4444]' :
                        'bg-[#3b82f6]'
                      }`}>
                        {loan.status === 'RETURNED' ? <CheckCircle2 className="size-3.5" /> : 
                         loan.status === 'OVERDUE' ? <XCircle className="size-3.5" /> :
                         <Clock className="size-3.5" />}
                        {loan.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-on-surface leading-tight mb-2 line-clamp-2 min-h-[44px]">
                      {loan.bookTitle || `Book #${loan.bookId}`}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
                      <User className="size-4 shrink-0" />
                      <span className="truncate">{loan.bookAuthor || 'Unknown Author'}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-3">
                      <span>ISBN: {loan.bookIsbn}</span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/15 mb-4">
                       <div>
                         <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Checkout</p>
                         <p className="text-xs font-medium text-on-surface">
                           {new Date(loan.checkoutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                         </p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Due</p>
                         <p className={`text-xs font-medium ${loan.status === 'OVERDUE' ? 'text-red-600 font-bold' : 'text-on-surface'}`}>
                           {new Date(loan.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                         </p>
                       </div>
                    </div>

                    {loan.notes && (
                      <div className="bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/15 text-xs italic text-on-surface-variant mb-4 line-clamp-2">
                        <span className="font-semibold text-on-surface mr-1">Note:</span> {loan.notes}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-auto flex flex-col gap-2 pt-2">
                      <Link href={`/loans/${loan.id}`} className="w-full">
                        <Button variant="outline" className="w-full text-xs font-bold border-primary/20 text-primary hover:bg-primary/5 h-9">
                          View Details
                        </Button>
                      </Link>
                      
                      <div className="flex gap-2">
                        {loan.status === "CHECKED_OUT" && (
                          <Button 
                            onClick={() => openModal(loan, "renew")}
                            variant="outline" 
                            className="flex-1 text-xs font-bold border-[#eab308]/30 text-[#ca8a04] hover:bg-[#fefce8] h-9 px-0"
                          >
                            <RefreshCw className="size-3.5 mr-1" /> Renew
                          </Button>
                        )}

                        {(loan.status === "CHECKED_OUT" || loan.status === "OVERDUE") && (
                          <Button 
                            onClick={() => openModal(loan, "checkin")}
                            className="flex-1 text-xs font-bold bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-sm shadow-green-200 h-9 px-0"
                          >
                            <BookUp className="size-3.5 mr-1" /> Return
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>

      {/* Reusable Modal Overlay */}
      {modalType && selectedLoan && (
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
                  <strong className="text-on-surface"> {selectedLoan.bookTitle}</strong>. 
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

      {/* Hide scrollbar class */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
