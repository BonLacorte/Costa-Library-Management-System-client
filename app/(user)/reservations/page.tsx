"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, BookMarked, AlarmClock, CalendarCheck, X, CheckCircle2, Clock, CalendarX, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Reservation {
  id: number;
  bookId: number;
  bookTitle?: string;
  status: string;
  reservationDate: string;
  availableDate?: string;
  fulfilledDate?: string;
  expiryDate?: string;
}

export default function MyReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");

  const [cancelModalId, setCancelModalId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      const response = await fetch("http://localhost:8080/api/reservations/my?size=100", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      
      const data = await response.json();
      setReservations(data.content || data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load your reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalId) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      const response = await fetch(`http://localhost:8080/api/reservations/${cancelModalId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        let errMessage = `Failed: Server returned ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.message || errData.error) errMessage = errData.message || errData.error;
        } catch { /* ignore */ }
        throw new Error(errMessage);
      }

      alert("Reservation cancelled successfully.");
      setCancelModalId(null);
      fetchReservations();
    } catch (err: any) {
      alert(err.message || "An error occurred during cancellation.");
    } finally {
      setActionLoading(false);
    }
  };

  // Calculations
  const activeCount = reservations.filter(r => r.status === "PENDING" || r.status === "AVAILABLE").length;
  const readyCount = reservations.filter(r => r.status === "AVAILABLE").length;

  // Filtering
  const filteredReservations = reservations.filter(r => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ACTIVE") return r.status === "PENDING" || r.status === "AVAILABLE";
    if (activeTab === "COMPLETED") return r.status === "FULFILLED" || r.status === "CANCELLED" || r.status === "EXPIRED";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fc] w-full animate-in fade-in duration-500 relative">
      
      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-20">
        
        {/* Header */}
        <header className="mb-10 flex items-start gap-4">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-200">
            <BookMarked className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">
              My Reservations
            </h1>
            <p className="text-on-surface-variant">
              Manage and track your book reservations
            </p>
          </div>
        </header>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/15 flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Total Reservations</p>
              <p className="text-4xl font-bold text-[#1e1b4b]">{reservations.length}</p>
            </div>
            <div className="size-12 rounded-xl bg-violet-600 flex items-center justify-center shadow-md">
              <BookMarked className="size-6 text-white" />
            </div>
          </div>
          <div className="bg-[#fffbeb] rounded-xl p-6 shadow-sm border border-[#fef3c7] flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#b45309] mb-1">Active</p>
              <p className="text-4xl font-bold text-[#92400e]">{activeCount}</p>
            </div>
            <div className="size-12 rounded-xl bg-[#f59e0b] flex items-center justify-center shadow-md">
              <AlarmClock className="size-6 text-white" />
            </div>
          </div>
          <div className="bg-[#f0fdf4] rounded-xl p-6 shadow-sm border border-[#dcfce7] flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#15803d] mb-1">Ready to Pick Up</p>
              <p className="text-4xl font-bold text-[#166534]">{readyCount}</p>
            </div>
            <div className="size-12 rounded-xl bg-[#22c55e] flex items-center justify-center shadow-md">
              <CalendarCheck className="size-6 text-white" />
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 flex overflow-hidden mb-8">
          <button 
            onClick={() => setActiveTab("ALL")}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "ALL" ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50/50" : "text-on-surface-variant hover:bg-surface-container-lowest"
            }`}
          >
            <BookMarked className="size-4" /> All Reservations
          </button>
          <button 
            onClick={() => setActiveTab("ACTIVE")}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "ACTIVE" ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50/50" : "text-on-surface-variant hover:bg-surface-container-lowest"
            }`}
          >
            <AlarmClock className="size-4" /> Active
          </button>
          <button 
            onClick={() => setActiveTab("COMPLETED")}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "COMPLETED" ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50/50" : "text-on-surface-variant hover:bg-surface-container-lowest"
            }`}
          >
            <CheckCircle2 className="size-4" /> Completed
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium flex items-center gap-2">
            <AlertCircle className="size-5" /> {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-outline-variant/15 p-20 flex flex-col items-center justify-center shadow-sm">
            <Loader2 className="size-10 animate-spin text-primary opacity-60 mb-4" />
            <p className="text-on-surface-variant font-medium">Fetching reservations...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-outline-variant/15 p-20 flex flex-col items-center justify-center shadow-sm text-center">
            <div className="size-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6 border border-outline-variant/20">
              <BookMarked className="size-10 text-on-surface-variant opacity-60" />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">No Reservations Found</h2>
            <p className="text-on-surface-variant">
              You do not have any {activeTab !== "ALL" ? activeTab.toLowerCase() : ""} reservations currently.
            </p>
            <Button onClick={() => router.push("/books")} className="mt-6 font-bold">
              Browse Books
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReservations.map((reservation) => {
              const status = reservation.status;
              
              // Colors configuration
              const colors = {
                PENDING: { bg: "bg-[#fef3c7]", text: "text-[#b45309]", icon: <HourglassIcon className="size-4 mr-2" /> },
                AVAILABLE: { bg: "bg-[#dcfce7]", text: "text-[#15803d]", icon: <CalendarCheck className="size-4 mr-2" /> },
                FULFILLED: { bg: "bg-[#dbeafe]", text: "text-[#1d4ed8]", icon: <CheckCircle2 className="size-4 mr-2" /> },
                CANCELLED: { bg: "bg-[#fee2e2]", text: "text-[#b91c1c]", icon: <X className="size-4 mr-2" /> },
                EXPIRED: { bg: "bg-[#f1f5f9]", text: "text-[#475569]", icon: <CalendarX className="size-4 mr-2" /> }
              }[status] || { bg: "bg-[#f1f5f9]", text: "text-[#475569]", icon: <BookMarked className="size-4 mr-2" /> };

              return (
                <div key={reservation.id} className="bg-white rounded-2xl border border-outline-variant/15 shadow-sm overflow-hidden flex flex-col h-full">
                  
                  {/* Status Banner */}
                  <div className={`px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center ${colors.bg} ${colors.text}`}>
                    {colors.icon} {status.replace('_', ' ')}
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="size-12 rounded-xl bg-violet-600 flex items-center justify-center shrink-0 shadow-md">
                        <BookMarked className="size-6 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Book ID</p>
                        <p className="text-xl font-bold text-[#1e1b4b]">#{reservation.bookId}</p>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-[#1e1b4b] mb-6 leading-tight">
                      {reservation.bookTitle || `Book ID #${reservation.bookId}`}
                    </h3>

                    <div className="space-y-4 mt-auto border-t border-outline-variant/15 pt-5">
                      <div className="flex items-start gap-3">
                        <Clock className="size-4 text-on-surface-variant mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reserved</p>
                          <p className="text-xs font-bold text-on-surface mt-0.5">
                            {new Date(reservation.reservationDate).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      {reservation.availableDate && (
                        <div className="flex items-start gap-3">
                          <CalendarCheck className="size-4 text-[#16a34a] mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-[#16a34a] uppercase tracking-widest">Available</p>
                            <p className="text-xs font-bold text-[#15803d] mt-0.5">
                              {new Date(reservation.availableDate).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                            </p>
                          </div>
                        </div>
                      )}

                      {reservation.fulfilledDate && (
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="size-4 text-[#2563eb] mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-[#2563eb] uppercase tracking-widest">Fulfilled</p>
                            <p className="text-xs font-bold text-[#1d4ed8] mt-0.5">
                              {new Date(reservation.fulfilledDate).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Action */}
                  {(status === "PENDING" || status === "AVAILABLE") && (
                    <div className="p-6 pt-0 mt-auto">
                      <Button 
                        variant="outline" 
                        onClick={() => setCancelModalId(reservation.id)}
                        className="w-full font-bold text-[#dc2626] border-[#fca5a5] hover:bg-[#fef2f2]"
                      >
                        <X className="size-4 mr-2" /> Cancel
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b bg-[#fef2f2] border-[#fee2e2] flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2 text-[#dc2626]">
                <AlertCircle className="size-5" /> Cancel Reservation
              </h3>
              <button onClick={() => setCancelModalId(null)} className="text-black/40 hover:text-black/70 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleCancelReservation} className="p-6">
              <div className="mb-8">
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Are you sure you want to cancel this reservation? If you cancel, you will lose your spot in the queue and another user may reserve the book.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={() => setCancelModalId(null)} className="font-bold text-on-surface-variant hover:bg-surface-container">
                  Keep Reservation
                </Button>
                <Button 
                  type="submit" 
                  disabled={actionLoading} 
                  className="font-bold shadow-md bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-red-200"
                >
                  {actionLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : <X className="size-4 mr-2" />}
                  Confirm Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function HourglassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  );
}
