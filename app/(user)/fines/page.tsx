"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Receipt, CalendarDays, TrendingUp, CheckCircle2, AlertTriangle, AlertCircle, Filter, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Fine {
  id: number;
  bookTitle?: string;
  userName?: string;
  amount: number;
  amountPaid: number;
  status: string;
  type: string;
  reason?: string;
  createdAt: string;
}

export default function MyFinesPage() {
  const router = useRouter();
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [paymentLoading, setPaymentLoading] = useState<number | null>(null);

  const fetchFines = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      // Using the base /my endpoint, assuming it returns all if no query params provided, 
      // or we just fetch and filter client-side to ensure we get all data for stats.
      const response = await fetch("http://localhost:8080/api/fines/my", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const data = await response.json();
      setFines(data.content || data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load your fines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const handlePayFine = async (fineId: number) => {
    setPaymentLoading(fineId);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      const response = await fetch(`http://localhost:8080/api/fines/${fineId}/pay`, {
        method: "POST",
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

      alert("Fine paid successfully!");
      fetchFines(); // Refresh the list
    } catch (err: any) {
      alert(err.message || "An error occurred during payment.");
    } finally {
      setPaymentLoading(null);
    }
  };

  // Calculations
  const pendingFines = fines.filter(f => f.status === "PENDING");
  const paidFines = fines.filter(f => f.status === "PAID");

  const totalOutstanding = pendingFines.reduce((sum, f) => sum + (f.amount - (f.amountPaid || 0)), 0);
  const totalPaid = fines.reduce((sum, f) => sum + (f.amountPaid || 0), 0);

  // Filters
  const filteredFines = fines.filter((fine) => {
    const matchStatus = statusFilter === "All" || fine.status.toUpperCase() === statusFilter.toUpperCase();
    const matchType = typeFilter === "All" || fine.type.toUpperCase() === typeFilter.toUpperCase();
    return matchStatus && matchType;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fc] w-full animate-in fade-in duration-500 relative">

      {/* Header */}
      <div className="bg-white pt-10 pb-10 border-b border-outline-variant/10 mb-8">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-3">My Fines</h1>
          <p className="text-on-surface-variant text-base">Manage and pay your library fines securely</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-20">

        {/* Statistic Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-outline-variant/15 rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary mb-1">{pendingFines.length}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Pending Fines</p>
          </div>
          <div className="bg-white border border-outline-variant/15 rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary mb-1">{paidFines.length}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Paid Fines</p>
          </div>
          <div className="bg-white border border-outline-variant/15 rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary mb-1">${totalOutstanding.toFixed(2)}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Outstanding</p>
          </div>
          <div className="bg-white border border-outline-variant/15 rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary mb-1">${totalPaid.toFixed(2)}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Paid</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left Sidebar (Filters) */}
          <aside className="w-full lg:w-[280px] shrink-0 space-y-6">

            {/* Status Filter Card */}
            <div className="bg-white rounded-xl border border-outline-variant/20 p-5 shadow-sm">
              <h3 className="font-bold text-lg text-on-surface mb-4">Status</h3>
              <div className="space-y-1">
                {["All", "PENDING", "PAID", "WAIVED"].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                      ? "bg-[#f3e8ff] text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-lowest"
                      }`}
                  >
                    <div className={`size-4 rounded-full border-[4px] flex items-center justify-center shrink-0 ${statusFilter === status
                      ? "border-primary bg-white"
                      : "border-outline-variant/50 bg-transparent"
                      }`} />
                    <span className="truncate">{status === "All" ? "All Statuses" : status.charAt(0) + status.slice(1).toLowerCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter Card */}
            <div className="bg-white rounded-xl border border-outline-variant/20 p-5 shadow-sm">
              <h3 className="font-bold text-lg text-on-surface mb-4">Fine Type</h3>
              <div className="space-y-1">
                {["All", "OVERDUE", "DAMAGE", "LOSS"].map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${typeFilter === type
                      ? "bg-[#f3e8ff] text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-lowest"
                      }`}
                  >
                    <div className={`size-4 rounded-full border-[4px] flex items-center justify-center shrink-0 ${typeFilter === type
                      ? "border-primary bg-white"
                      : "border-outline-variant/50 bg-transparent"
                      }`} />
                    <span className="truncate">{type === "All" ? "All Types" : type.charAt(0) + type.slice(1).toLowerCase()}</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Main Content Area */}
          <div className="flex-1">

            {/* Content */}
            {loading ? (
              <div className="bg-white rounded-2xl border border-outline-variant/15 p-20 flex flex-col items-center justify-center shadow-sm">
                <Loader2 className="size-10 animate-spin text-primary opacity-60 mb-4" />
                <p className="text-on-surface-variant font-medium">Fetching your fines...</p>
              </div>
            ) : filteredFines.length === 0 ? (
              <div className="bg-white rounded-2xl border border-outline-variant/15 p-20 flex flex-col items-center justify-center shadow-sm text-center">
                <div className="size-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6 border border-outline-variant/20">
                  <Receipt className="size-10 text-on-surface-variant opacity-60" />
                </div>
                <h2 className="text-2xl font-bold text-on-surface mb-2">No Fines Found</h2>
                <p className="text-on-surface-variant">
                  You do not have any {statusFilter !== "All" ? statusFilter.toLowerCase() : ""} fines matching these filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {filteredFines.map((fine) => {
                  const isPaid = fine.status === "PAID";
                  const isWaived = fine.status === "WAIVED";
                  const isPending = fine.status === "PENDING";
                  const outstandingAmount = fine.amount - (fine.amountPaid || 0);

                  return (
                    <div key={fine.id} className={`bg-white rounded-xl border overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow ${isPaid ? 'border-[#dcfce7]' : isPending ? 'border-[#ffedd5]' : 'border-outline-variant/15'
                      }`}>

                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                            <Receipt className="size-3.5" /> Fine #{fine.id}
                          </p>
                          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${isPaid ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]" :
                            isPending ? "bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]" :
                              "bg-[#f1f5f9] text-[#64748b] border-[#cbd5e1]"
                            }`}>
                            {isPaid && <CheckCircle2 className="size-3" />}
                            {isPending && <AlertCircle className="size-3" />}
                            {isPaid ? "Paid" : isPending ? "Pending" : "Waived"}
                          </div>
                        </div>

                        <h3 className="font-bold text-lg text-on-surface leading-tight mb-2 line-clamp-2 min-h-[44px]">
                          {fine.bookTitle || "Unknown Book"}
                        </h3>

                        <div className="flex flex-wrap items-center justify-between text-[11px] font-medium text-on-surface-variant mb-4 pb-4 border-b border-outline-variant/15 gap-2">
                          <div className={`px-2 py-0.5 rounded text-[10px] font-bold border bg-white ${fine.type === "LOSS" ? "text-[#dc2626] border-[#fca5a5]" :
                            fine.type === "DAMAGE" ? "text-[#ea580c] border-[#fdba74]" :
                              "text-[#2563eb] border-[#bfdbfe]"
                            }`}>
                            {fine.type.charAt(0) + fine.type.slice(1).toLowerCase()}
                          </div>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-3" /> {new Date(fine.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {fine.reason && (
                          <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 mb-5 flex-1">
                            {fine.reason}
                          </p>
                        )}
                        {!fine.reason && (
                          <div className="flex-1"></div>
                        )}

                        <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
                          <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/15">
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase flex items-center gap-1"><TrendingUp className="size-3" /> Total</p>
                            <p className="text-lg font-bold text-primary mt-1">${fine.amount.toFixed(2)}</p>
                          </div>
                          <div className={`${outstandingAmount > 0 ? 'bg-[#fef2f2] border-[#fee2e2]' : 'bg-surface-container-lowest border-outline-variant/15'} p-3 rounded-lg border`}>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase flex items-center gap-1"><AlertTriangle className={`size-3 ${outstandingAmount > 0 ? 'text-[#dc2626]' : ''}`} /> Due</p>
                            <p className={`text-lg font-bold mt-1 ${outstandingAmount > 0 ? 'text-[#dc2626]' : 'text-on-surface'}`}>
                              ${outstandingAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-outline-variant/10 pt-4">
                          {isPending ? (
                            <div className="flex gap-2">
                              <Link href={`/fines/${fine.id}`} className="flex-1">
                                <Button variant="outline" className="w-full font-bold h-11 border-outline-variant/30 text-on-surface-variant">
                                  Details
                                </Button>
                              </Link>
                              <Button
                                onClick={() => handlePayFine(fine.id)}
                                disabled={paymentLoading === fine.id}
                                className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold h-11 shadow-sm px-0"
                              >
                                {paymentLoading === fine.id ? <Loader2 className="size-4 animate-spin" /> : "Pay Now"}
                              </Button>
                            </div>
                          ) : isPaid ? (
                            <Link href={`/fines/${fine.id}`}>
                              <Button variant="outline" className="w-full font-bold h-11 text-[#15803d] border-[#16a34a]/30 hover:bg-[#16a34a]/10">
                                View Receipt
                              </Button>
                            </Link>
                          ) : (
                            <Link href={`/fines/${fine.id}`}>
                              <Button variant="outline" className="w-full font-bold h-11 text-[#475569] border-[#64748b]/30 hover:bg-[#64748b]/10">
                                View Details
                              </Button>
                            </Link>
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

    </div>
  );
}
