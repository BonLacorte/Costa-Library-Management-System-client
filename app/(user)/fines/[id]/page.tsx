"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Receipt, AlertCircle, CheckCircle2, TrendingUp, CalendarDays, AlertTriangle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Fine {
  id: number;
  bookLoanId: number;
  bookTitle?: string;
  userName?: string;
  amount: number;
  amountPaid: number;
  status: string;
  type: string;
  reason?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function FineDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [fine, setFine] = useState<Fine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    paramsPromise.then(p => setResolvedParams(p));
  }, [paramsPromise]);

  const fetchFine = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      const response = await fetch(`http://localhost:8080/api/fines/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Fine not found.");
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      setFine(data);
    } catch (err: any) {
      setError(err.message || "Failed to load fine details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resolvedParams?.id) {
      fetchFine(resolvedParams.id);
    }
  }, [resolvedParams]);

  const handlePayFine = async () => {
    if (!fine) return;
    setPaymentLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      const response = await fetch(`http://localhost:8080/api/fines/${fine.id}/pay`, {
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
      if (resolvedParams?.id) fetchFine(resolvedParams.id);
    } catch (err: any) {
      alert(err.message || "An error occurred during payment.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading || !resolvedParams) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] w-full flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary opacity-60" />
      </div>
    );
  }

  if (error || !fine) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] w-full p-10 flex flex-col items-center justify-center text-center">
        <AlertCircle className="size-16 text-error opacity-60 mb-4" />
        <h2 className="text-2xl font-bold text-on-surface mb-2">Fine Not Found</h2>
        <p className="text-on-surface-variant mb-8">{error || "Could not retrieve the fine details."}</p>
        <Link href="/fines">
          <Button variant="outline" className="font-bold border-primary/20 text-primary">Go Back to Fines</Button>
        </Link>
      </div>
    );
  }

  const isPaid = fine.status === "PAID";
  const isWaived = fine.status === "WAIVED";
  const isPending = fine.status === "PENDING";
  const outstandingAmount = fine.amount - (fine.amountPaid || 0);

  return (
    <div className="min-h-screen bg-[#f8f9fc] w-full animate-in fade-in duration-500 pb-20">
      
      {/* Top Navigation Strip */}
      <div className="bg-white border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-[1200px] mx-auto">
          <button
            onClick={() => router.push("/fines")}
            className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to My Fines
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 pt-10">
        
        {/* Header Title */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
              Fine Details
            </h1>
            <p className="text-sm text-on-surface-variant flex items-center gap-2">
              <Receipt className="size-4" /> Invoice / Fine ID: #{fine.id}
            </p>
          </div>
          
          <div className={`px-5 py-2 rounded-full border flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${
            isPaid ? 'bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]' :
            isPending ? 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]' :
            'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]'
          }`}>
            {isPaid && <CheckCircle2 className="size-4" />}
            {isPending && <AlertCircle className="size-4" />}
            {isPaid ? "Paid in Full" : isPending ? "Pending Payment" : "Waived"}
          </div>
        </header>

        {/* Main Card */}
        <div className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${
          isPaid ? 'border-[#dcfce7]' : isPending ? 'border-[#ffedd5]' : 'border-outline-variant/15'
        }`}>
          
          <div className="p-8 lg:p-10">
            <h2 className="text-3xl font-bold text-[#1e1b4b] mb-4">
              {fine.bookTitle || "Unknown Book"}
            </h2>
            
            <div className="flex gap-3 mb-8">
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold border bg-white ${
                fine.type === "LOSS" ? "text-[#dc2626] border-[#fca5a5]" :
                fine.type === "DAMAGE" ? "text-[#ea580c] border-[#fdba74]" :
                "text-[#2563eb] border-[#bfdbfe]"
              }`}>
                {fine.type}
              </div>
              
              <Link href={`/loans/${fine.bookLoanId}`}>
                <div className="px-4 py-1.5 rounded-full text-xs font-bold border bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer">
                  View Associated Loan #{fine.bookLoanId}
                </div>
              </Link>
            </div>

            <div className="bg-[#f8f9fc] p-6 rounded-xl border border-outline-variant/15 mb-10">
              <h3 className="font-bold text-[#1e1b4b] mb-2">Reason for Fine:</h3>
              <p className="text-on-surface-variant leading-relaxed">
                {fine.reason || "No explicit reason was provided for this fine."}
              </p>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-6 border-b border-outline-variant/15 pb-2">
              Financial Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp className="size-4 text-primary" /> Total Assessed
                </p>
                <p className="text-3xl font-bold text-primary">${fine.amount.toFixed(2)}</p>
              </div>
              
              <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-5">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-[#16a34a]" /> Amount Paid
                </p>
                <p className="text-3xl font-bold text-[#16a34a]">${(fine.amountPaid || 0).toFixed(2)}</p>
              </div>

              <div className={`${outstandingAmount > 0 ? 'bg-[#fef2f2] border-[#fee2e2]' : 'bg-surface-container-lowest border-outline-variant/20'} border rounded-xl p-5`}>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className={`size-4 ${outstandingAmount > 0 ? 'text-[#dc2626]' : 'text-on-surface-variant'}`} /> Outstanding
                </p>
                <p className={`text-3xl font-bold ${outstandingAmount > 0 ? 'text-[#dc2626]' : 'text-on-surface'}`}>
                  ${outstandingAmount.toFixed(2)}
                </p>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-on-surface-variant" /> Issued Date
                </p>
                <p className="text-xl font-bold text-on-surface mt-2">
                  {new Date(fine.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
          </div>

          {/* Action Footer */}
          {isPending && (
            <div className="bg-[#fff7ed] p-8 border-t border-[#ffedd5] flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-[#ea580c] mb-1">Payment Required</h3>
                <p className="text-[#9a3412] text-sm">
                  Please settle this outstanding balance to restore your account standing.
                </p>
              </div>
              <Button 
                onClick={handlePayFine}
                disabled={paymentLoading}
                className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold h-14 px-8 text-lg w-full md:w-auto shadow-xl shadow-red-200"
              >
                {paymentLoading ? (
                  <Loader2 className="size-6 animate-spin mr-3" />
                ) : (
                  <CreditCard className="size-6 mr-3" />
                )}
                PAY OUTSTANDING AMOUNT: ${outstandingAmount.toFixed(2)}
              </Button>
            </div>
          )}

          {isPaid && (
            <div className="bg-[#dcfce7] p-8 border-t border-[#bbf7d0] flex flex-col items-center justify-center text-center">
              <div className="bg-[#16a34a] rounded-full p-2 text-white mb-4 shadow-lg shadow-green-200">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#15803d] mb-2">Payment Complete</h3>
              <p className="text-[#166534]">
                This fine has been fully paid. Thank you for your prompt payment!
              </p>
              {fine.updatedAt && (
                <p className="text-xs text-[#166534]/60 font-medium mt-6">
                  Last Updated: {new Date(fine.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {isWaived && (
            <div className="bg-[#f1f5f9] p-8 border-t border-[#e2e8f0] flex flex-col items-center justify-center text-center">
              <div className="bg-[#64748b] rounded-full p-2 text-white mb-4">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#334155] mb-2">Fine Waived</h3>
              <p className="text-[#475569]">
                This fine was waived by the administration. No payment is required.
              </p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
