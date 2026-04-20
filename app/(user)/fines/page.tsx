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
      
      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-20">
        
        {/* Header */}
        <header className="mb-10 flex items-start gap-4">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
            <Receipt className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">
              My Fines
            </h1>
            <p className="text-on-surface-variant">
              Manage and pay your library fines securely
            </p>
          </div>
        </header>

        {/* Statistic Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#fff7ed] border border-[#ffedd5] rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-[#ea580c] mb-1">{pendingFines.length}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Pending Fines</p>
          </div>
          <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-[#16a34a] mb-1">{paidFines.length}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Paid Fines</p>
          </div>
          <div className="bg-[#fef2f2] border border-[#fee2e2] rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-[#dc2626] mb-1">${totalOutstanding.toFixed(2)}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Outstanding</p>
          </div>
          <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-[#16a34a] mb-1">${totalPaid.toFixed(2)}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Paid</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-primary font-bold mr-2">
            <Filter className="size-5" /> Filters
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 pl-4 pr-10 rounded-lg bg-white border border-outline-variant/30 text-on-surface text-sm font-bold focus:outline-none focus:border-primary transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23737373%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:calc(100%-1rem)_center] bg-[length:0.6rem] shadow-sm"
            >
              <option value="All">Status: All</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="WAIVED">Waived</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 pl-4 pr-10 rounded-lg bg-white border border-outline-variant/30 text-on-surface text-sm font-bold focus:outline-none focus:border-primary transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23737373%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:calc(100%-1rem)_center] bg-[length:0.6rem] shadow-sm"
            >
              <option value="All">Type: All</option>
              <option value="OVERDUE">Overdue</option>
              <option value="DAMAGE">Damage</option>
              <option value="LOSS">Loss</option>
            </select>
          </div>
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
          <div className="space-y-6">
            {filteredFines.map((fine) => {
              const isPaid = fine.status === "PAID";
              const isWaived = fine.status === "WAIVED";
              const isPending = fine.status === "PENDING";
              const outstandingAmount = fine.amount - (fine.amountPaid || 0);

              return (
                <div key={fine.id} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden flex flex-col ${
                  isPaid ? 'border-[#dcfce7]' : isPending ? 'border-[#ffedd5]' : 'border-outline-variant/15'
                }`}>
                  
                  {/* Card Body */}
                  <div className="p-6 lg:p-8 flex flex-col">
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
                      <Receipt className="size-3.5" /> Fine #{fine.id}
                    </p>
                    
                    <h3 className="text-2xl font-bold text-[#1e1b4b] mb-4">{fine.bookTitle || "Unknown Book"}</h3>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                        isPaid ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]" :
                        isPending ? "bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]" :
                        "bg-[#f1f5f9] text-[#64748b] border-[#cbd5e1]"
                      }`}>
                        {isPaid && <CheckCircle2 className="size-3.5" />}
                        {isPending && <AlertCircle className="size-3.5" />}
                        {isPaid ? "Paid in Full" : isPending ? "Pending Payment" : "Waived"}
                      </div>
                      
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold border bg-white ${
                        fine.type === "LOSS" ? "text-[#dc2626] border-[#fca5a5]" :
                        fine.type === "DAMAGE" ? "text-[#ea580c] border-[#fdba74]" :
                        "text-[#2563eb] border-[#bfdbfe]"
                      }`}>
                        {fine.type.charAt(0) + fine.type.slice(1).toLowerCase()}
                      </div>
                    </div>

                    <div className="bg-[#f8f9fc] px-4 py-3 rounded-lg border border-outline-variant/15 text-sm mb-8">
                      <span className="font-bold text-[#1e1b4b]">Reason: </span>
                      <span className="text-on-surface-variant">{fine.reason || "No reason provided."}</span>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="bg-white border border-outline-variant/20 rounded-xl p-4 min-w-[140px]">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <TrendingUp className="size-3.5 text-primary" /> Total Amount
                        </p>
                        <p className="text-2xl font-bold text-primary">${fine.amount.toFixed(2)}</p>
                      </div>
                      
                      <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-4 min-w-[140px]">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-[#16a34a]" /> Amount Paid
                        </p>
                        <p className="text-2xl font-bold text-[#16a34a]">${(fine.amountPaid || 0).toFixed(2)}</p>
                      </div>

                      <div className={`${outstandingAmount > 0 ? 'bg-[#fef2f2] border-[#fee2e2]' : 'bg-white border-outline-variant/20'} border rounded-xl p-4 min-w-[140px]`}>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <AlertTriangle className={`size-3.5 ${outstandingAmount > 0 ? 'text-[#dc2626]' : 'text-on-surface-variant'}`} /> Outstanding
                        </p>
                        <p className={`text-2xl font-bold ${outstandingAmount > 0 ? 'text-[#dc2626]' : 'text-on-surface'}`}>
                          ${outstandingAmount.toFixed(2)}
                        </p>
                      </div>

                      <div className="bg-white border border-outline-variant/20 rounded-xl p-4 min-w-[140px]">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" /> Created Date
                        </p>
                        <p className="text-lg font-bold text-on-surface mt-1.5">
                          {new Date(fine.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  {isPaid && (
                    <div className="bg-[#dcfce7] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-[#15803d]">
                        <div className="bg-[#16a34a] rounded-full p-1 text-white">
                          <CheckCircle2 className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold text-base">This fine has been paid in full</p>
                          <p className="text-sm opacity-80 font-medium">Thank you for your payment!</p>
                        </div>
                      </div>
                      <Link href={`/fines/${fine.id}`}>
                        <Button variant="outline" className="font-bold text-[#15803d] border-[#16a34a]/30 hover:bg-[#16a34a]/10">
                          View Receipt
                        </Button>
                      </Link>
                    </div>
                  )}

                  {isPending && (
                    <div className="bg-[#f8f9fc] px-6 py-5 border-t border-outline-variant/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-sm text-on-surface-variant font-medium">
                        Payment is required to restore full borrowing privileges.
                      </p>
                      <div className="flex gap-3">
                        <Link href={`/fines/${fine.id}`}>
                          <Button variant="outline" className="font-bold h-12">
                            View Details
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => handlePayFine(fine.id)}
                          disabled={paymentLoading === fine.id}
                          className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold h-12 px-6 shadow-md shadow-red-200"
                        >
                          {paymentLoading === fine.id ? (
                            <Loader2 className="size-5 animate-spin mr-2" />
                          ) : (
                            <CreditCard className="size-5 mr-2" />
                          )}
                          PAY OUTSTANDING AMOUNT: ${outstandingAmount.toFixed(2)}
                        </Button>
                      </div>
                    </div>
                  )}

                  {isWaived && (
                    <div className="bg-[#f1f5f9] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-[#475569]">
                        <div className="bg-[#64748b] rounded-full p-1 text-white">
                          <CheckCircle2 className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold text-base">This fine was waived by administration</p>
                          <p className="text-sm opacity-80 font-medium">No further action is required.</p>
                        </div>
                      </div>
                      <Link href={`/fines/${fine.id}`}>
                        <Button variant="outline" className="font-bold text-[#475569] border-[#64748b]/30 hover:bg-[#64748b]/10">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
