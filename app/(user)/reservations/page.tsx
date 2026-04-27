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

      {/* Header */}
      <div className="bg-white pt-10 pb-10 border-b border-outline-variant/10 mb-8">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-3">My Reservations</h1>
          <p className="text-on-surface-variant text-base">Manage and track your book  reservations</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-20">

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/15 text-center">
            <p className="text-3xl font-bold text-violet-600 mb-1">{reservations.length}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Reservations</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/15 text-center">
            <p className="text-3xl font-bold text-[#ea580c] mb-1">{activeCount}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Active</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant/15 text-center">
            <p className="text-3xl font-bold text-[#16a34a] mb-1">{readyCount}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Ready to Pick Up</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium flex items-center gap-2">
            <AlertCircle className="size-5" /> {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left Sidebar (Filters) */}
          <aside className="w-full lg:w-[280px] shrink-0 space-y-6">
            {/* Status Filter Card */}
            <div className="bg-white rounded-xl border border-outline-variant/20 p-5 shadow-sm">
              <h3 className="font-bold text-lg text-on-surface mb-4">Status</h3>
              <div className="space-y-1">
                {[
                  { id: "ALL", label: "All Reservations", icon: BookMarked },
                  { id: "ACTIVE", label: "Active", icon: AlarmClock },
                  { id: "COMPLETED", label: "Completed", icon: CheckCircle2 }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                      ? "bg-[#f3e8ff] text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-lowest"
                      }`}
                  >
                    <div className={`size-4 rounded-full border-[4px] flex items-center justify-center shrink-0 ${activeTab === tab.id
                      ? "border-primary bg-white"
                      : "border-outline-variant/50 bg-transparent"
                      }`} />
                    {/* <tab.icon className="size-4 opacity-70" /> */}
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">

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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredReservations.map((reservation) => {
                  const status = reservation.status;

                  // Colors configuration
                  const colors = {
                    PENDING: { bg: "bg-[#fff7ed]", text: "text-[#ea580c]", border: "border-[#fed7aa]", icon: <HourglassIcon className="size-3" /> },
                    AVAILABLE: { bg: "bg-[#f0fdf4]", text: "text-[#16a34a]", border: "border-[#bbf7d0]", icon: <CalendarCheck className="size-3" /> },
                    FULFILLED: { bg: "bg-[#eff6ff]", text: "text-[#2563eb]", border: "border-[#bfdbfe]", icon: <CheckCircle2 className="size-3" /> },
                    CANCELLED: { bg: "bg-[#fef2f2]", text: "text-[#dc2626]", border: "border-[#fecaca]", icon: <X className="size-3" /> },
                    EXPIRED: { bg: "bg-[#f8f9fc]", text: "text-[#475569]", border: "border-[#e2e8f0]", icon: <CalendarX className="size-3" /> }
                  }[status] || { bg: "bg-[#f8f9fc]", text: "text-[#475569]", border: "border-[#e2e8f0]", icon: <BookMarked className="size-3" /> };

                  return (
                    <div key={reservation.id} className="bg-white rounded-xl border border-outline-variant/15 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">

                      {/* Card Body */}
                      <div className="p-5 flex flex-col flex-1">

                        <div className="flex justify-between items-start mb-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                            <BookMarked className="size-3.5" /> Book #{reservation.bookId}
                          </p>
                          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${colors.bg} ${colors.text} ${colors.border}`}>
                            {colors.icon} {status.replace('_', ' ')}
                          </div>
                        </div>

                        <h3 className="font-bold text-lg text-on-surface leading-tight mb-4 line-clamp-2 min-h-[44px]">
                          {reservation.bookTitle || `Book ID #${reservation.bookId}`}
                        </h3>

                        <div className="space-y-3 mt-auto pt-4 border-t border-outline-variant/15">
                          <div className="flex items-start gap-2">
                            <Clock className="size-3.5 text-on-surface-variant mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reserved</p>
                              <p className="text-xs font-bold text-on-surface">
                                {new Date(reservation.reservationDate).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>

                          {reservation.availableDate && (
                            <div className="flex items-start gap-2">
                              <CalendarCheck className="size-3.5 text-[#16a34a] mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] font-bold text-[#16a34a] uppercase tracking-widest">Available</p>
                                <p className="text-xs font-bold text-[#15803d]">
                                  {new Date(reservation.availableDate).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          )}

                          {reservation.fulfilledDate && (
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="size-3.5 text-[#2563eb] mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] font-bold text-[#2563eb] uppercase tracking-widest">Fulfilled</p>
                                <p className="text-xs font-bold text-[#1d4ed8]">
                                  {new Date(reservation.fulfilledDate).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer Action */}
                        <div className="pt-4 border-t border-outline-variant/10 mt-4">
                          {(status === "PENDING" || status === "AVAILABLE") ? (
                            <Button
                              variant="outline"
                              onClick={() => setCancelModalId(reservation.id)}
                              className="w-full font-bold h-11 text-[#dc2626] border-[#fca5a5] hover:bg-[#fef2f2]"
                            >
                              <X className="size-4 mr-2" /> Cancel Reservation
                            </Button>
                          ) : (
                            <Button variant="outline" disabled className="w-full font-bold h-11 border-outline-variant/30 text-on-surface-variant/50">
                              Closed
                            </Button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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
