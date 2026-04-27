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
  const [loanLimit, setLoanLimit] = useState<number | null>(null);

  // Modal States
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [modalType, setModalType] = useState<"checkin" | "renew" | null>(null);
  const [modalNotes, setModalNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      // Fetch Loans
      const response = await fetch("http://localhost:8080/api/book-loans/my", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      setLoans(data.content || []);

      // Fetch User Info to get userId
      const userRes = await fetch("http://localhost:8080/api/users/profile", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      let userId = null;
      if (userRes.ok) {
        const userData = await userRes.json();
        userId = userData.id;
      }

      // Fetch Active Subscription for Loan Limit
      const subUrl = userId 
        ? `http://localhost:8080/api/subscriptions/active?userId=${userId}`
        : "http://localhost:8080/api/subscriptions/active";
      const subRes = await fetch(subUrl, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        setLoanLimit(subData.maxBooksAllowed || null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load your loans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      fetchData(); // Refresh the list
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

      {/* <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-20"> */}
      {/* Header Section */}
      {/* <div className="mb-12 max-w-3xl"> */}
      <div className="bg-white pt-10 pb-10 border-b border-outline-variant/10 mb-8">
        {/* <p className="text-sm font-medium text-secondary mb-2 uppercase tracking-widest">Patron Account</p> */}
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-3">My Borrowed Books</h1>
          <p className="text-on-surface-variant text-base">Review your current academic loans, manage renewals, and track archival materials assigned to your desk.</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-20">

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Column */}
          <aside className="w-full lg:w-[280px] shrink-0 space-y-6">
            
            {/* Account Standing Card */}
            <div className="bg-white rounded-xl border border-outline-variant/20 p-5 shadow-sm">
              <h3 className="font-bold text-lg text-on-surface mb-4">Account Standing</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-3 py-1">
                  <div className="size-4 rounded-full border-[4px] border-primary bg-white shrink-0" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none mb-1">Current Loans</p>
                    <p className="text-lg font-bold text-on-surface">
                      {loans.filter(l => l.status === "CHECKED_OUT" || l.status === "OVERDUE").length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-3 py-1">
                  <div className="size-4 rounded-full border-[4px] border-outline-variant/50 bg-transparent shrink-0" />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none mb-1">Loan Limit</p>
                    <p className="text-lg font-bold text-on-surface">
                      {loanLimit !== null ? loanLimit : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Types of Loans Card */}
            <div className="bg-white rounded-xl border border-outline-variant/20 p-5 shadow-sm">
              <h3 className="font-bold text-lg text-on-surface mb-4">Types of Loans</h3>
              <div className="space-y-1">
                {TABS.map((tab) => {
                  let tabLabel = tab;
                  let count = undefined;
                  if (tab === "Overdue") {
                    count = loans.filter(l => l.status === "OVERDUE").length;
                  } else if (tab === "Active") {
                    count = loans.filter(l => l.status === "CHECKED_OUT").length;
                    tabLabel = "Active Loans";
                  } else if (tab === "All") {
                    tabLabel = "All History";
                  }

                  const isActive = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#f3e8ff] text-primary"
                          : "text-on-surface-variant hover:bg-surface-container-lowest"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`size-4 rounded-full border-[4px] flex items-center justify-center shrink-0 ${
                          isActive
                            ? "border-primary bg-white"
                            : "border-outline-variant/50 bg-transparent"
                        }`} />
                        <span className="truncate">{tabLabel}</span>
                      </div>
                      {count !== undefined && count > 0 && (
                        <span className={`text-[10px] py-0.5 px-2 rounded-full font-bold ${tab === "Overdue" ? "bg-error text-white" : "bg-primary/10 text-primary"}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* Primary Loan Column */}
          <div className="flex-1 space-y-6">
            {filteredLoans.length === 0 ? (
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
              filteredLoans.map((loan) => (
                <article key={loan.id} className="flex flex-col sm:flex-row bg-surface-container-lowest rounded-[1rem] p-6 shadow-sm border border-outline-variant/15 relative group overflow-hidden">
                  {/* Subtle highlight bar indicating status */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-[1rem] ${loan.status === 'RETURNED' ? 'bg-[#22c55e]' :
                    loan.status === 'OVERDUE' ? 'bg-error' :
                      'bg-primary'
                    }`}></div>

                  <div className="shrink-0 mb-6 sm:mb-0 sm:mr-8 w-32 md:w-40 shadow-sm rounded-sm overflow-hidden bg-surface-container/50 flex items-center justify-center">
                    {loan.bookCoverImage ? (
                      <img alt={loan.bookTitle} className="w-full h-auto object-cover aspect-[2/3]" src={loan.bookCoverImage} />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-outline aspect-[2/3] w-full">
                        <BookOpen className="size-8 mb-2 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">No Cover</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider ${loan.status === 'RETURNED' ? 'bg-green-100 text-green-800' :
                          loan.status === 'OVERDUE' ? 'bg-error-container text-on-error-container' :
                            'bg-secondary-container/50 text-on-secondary-container'
                          }`}>
                          {loan.status === 'RETURNED' ? <CheckCircle2 className="size-3.5 mr-1" /> :
                            loan.status === 'OVERDUE' ? <XCircle className="size-3.5 mr-1" /> :
                              <Clock className="size-3.5 mr-1" />}
                          {loan.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-2xl text-on-surface mb-1">{loan.bookTitle || `Book #${loan.bookId}`}</h3>
                      <p className="text-base text-secondary mb-4">{loan.bookAuthor || 'Unknown Author'}</p>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm">
                          <CalendarDays className={`mr-2 size-4 ${loan.status === 'OVERDUE' ? 'text-error' : 'text-outline'}`} />
                          <span className={loan.status === 'OVERDUE' ? 'text-error font-medium' : 'text-on-surface-variant'}>
                            Due: <span className="font-mono font-medium">{new Date(loan.dueDate).toLocaleDateString()}</span>
                            {loan.status === 'OVERDUE' && ' (Overdue)'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-on-surface-variant">
                          <BookMarked className="text-outline mr-2 size-4" />
                          <span>ISBN: <span className="font-mono text-xs">{loan.bookIsbn}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-auto">
                      {loan.status === "CHECKED_OUT" && (
                        <button
                          onClick={() => openModal(loan, "renew")}
                          className="px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:-translate-y-px hover:shadow-md transition-all flex items-center"
                        >
                          <RefreshCw className="size-4 mr-2" /> Renew Loan
                        </button>
                      )}
                      {(loan.status === "CHECKED_OUT" || loan.status === "OVERDUE") && (
                        <button
                          onClick={() => openModal(loan, "checkin")}
                          className="px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-sm hover:bg-surface-dim transition-colors flex items-center"
                        >
                          <BookUp className="size-4 mr-2" /> Return Book
                        </button>
                      )}
                      <Link href={`/loans/${loan.id}`}>
                        <button className="px-6 py-2.5 rounded-full border border-outline-variant/30 text-primary font-bold text-sm hover:bg-primary/5 transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* Reusable Modal Overlay */}
      {modalType && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`px-6 py-4 border-b flex items-center justify-between ${modalType === "renew" ? "bg-[#fefce8] border-[#fef08a]" : "bg-[#f0fdf4] border-[#bbf7d0]"
              }`}>
              <h3 className={`font-bold text-lg flex items-center gap-2 ${modalType === "renew" ? "text-[#ca8a04]" : "text-[#16a34a]"
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
                  className={`font-bold shadow-md ${modalType === "renew"
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
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
