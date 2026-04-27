"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Clock, CheckCircle2, AlertCircle, XCircle, RefreshCw, X, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Subscription {
  id: number;
  planId: number;
  planName: string;
  price: number;
  priceInMajorUnits: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isExpired: boolean;
  cancelledAt: string | null;
  autoRenew: boolean;
}

export default function SubscriptionHistoryPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      // Get user ID
      let uid = userId;
      if (!uid) {
        const userRes = await fetch("http://localhost:8080/api/users/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          uid = userData.id;
          setUserId(uid);
        }
      }

      // Fetch history. The endpoint is /api/subscriptions/history
      // The controller handles user resolution.
      const historyRes = await fetch("http://localhost:8080/api/subscriptions/history", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!historyRes.ok) throw new Error(`Server returned ${historyRes.status}`);
      
      const data = await historyRes.json();
      setSubscriptions(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load subscription history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCancel = async (subId: number) => {
    if (!confirm("Are you sure you want to cancel your active subscription? You will lose access at the end of the billing period.")) return;

    setActionLoading(subId);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`http://localhost:8080/api/subscriptions/cancel/${subId}?reason=User Cancelled`, {
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

      alert("Subscription cancelled successfully.");
      fetchHistory();
    } catch (err: any) {
      alert(err.message || "Failed to cancel subscription.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRenew = async (sub: Subscription) => {
    setActionLoading(sub.id);
    try {
      const token = localStorage.getItem("jwt");
      
      const payload = {
        planId: sub.planId,
        paymentGateway: "RAZORPAY",
        userId: userId,
        autoRenew: true
      };

      const response = await fetch(`http://localhost:8080/api/subscriptions/renew/${sub.id}`, {
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

      alert("Subscription renewed successfully!");
      fetchHistory();
    } catch (err: any) {
      alert(err.message || "Failed to renew subscription.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] w-full animate-in fade-in duration-500 pb-20">
      
      {/* Top Navigation Strip */}
      <div className="bg-white border-b border-outline-variant/10 px-6 py-4 mb-10">
        <div className="max-w-[1000px] mx-auto">
          <button
            onClick={() => router.push("/subscriptions")}
            className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Plans
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6">
        
        <header className="mb-10 flex items-start gap-4">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-200">
            <Clock className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">
              My Subscriptions
            </h1>
            <p className="text-on-surface-variant">
              View your active and past subscription history
            </p>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium flex items-center gap-2">
            <AlertCircle className="size-5" /> {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-outline-variant/15 p-20 flex flex-col items-center justify-center shadow-sm">
            <Loader2 className="size-10 animate-spin text-primary opacity-60 mb-4" />
            <p className="text-on-surface-variant font-medium">Fetching history...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-outline-variant/15 p-20 flex flex-col items-center justify-center shadow-sm text-center">
            <div className="size-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6 border border-outline-variant/20">
              <Clock className="size-10 text-on-surface-variant opacity-60" />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">No Subscriptions Found</h2>
            <p className="text-on-surface-variant">
              You haven't subscribed to any plans yet.
            </p>
            <Link href="/subscriptions">
              <Button className="mt-6 font-bold bg-violet-600 hover:bg-violet-700 text-white">
                View Subscription Plans
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((sub) => {
              const isActive = sub.isActive;
              const isCancelled = sub.cancelledAt != null;
              const isExpired = sub.isExpired;
              const displayStatus = isCancelled ? "CANCELLED" : isExpired ? "EXPIRED" : isActive ? "ACTIVE" : "INACTIVE";

              return (
                <div key={sub.id} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden flex flex-col md:flex-row ${
                  isActive ? 'border-[#86efac]' : isCancelled ? 'border-outline-variant/30' : 'border-[#e2e8f0]'
                }`}>
                  
                  {/* Left Data Section */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                        isActive ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]" :
                        isCancelled ? "bg-[#fef2f2] text-[#dc2626] border-[#fca5a5]" :
                        "bg-[#f1f5f9] text-[#64748b] border-[#cbd5e1]"
                      }`}>
                        {isActive && <CheckCircle2 className="size-3.5" />}
                        {isCancelled && <XCircle className="size-3.5" />}
                        {isExpired && <Clock className="size-3.5" />}
                        {displayStatus}
                      </div>
                      <p className="text-sm font-bold text-on-surface-variant">ID: #{sub.id}</p>
                    </div>

                    <h3 className="text-2xl font-bold text-[#1e1b4b] mb-6">{sub.planName}</h3>

                    <div className="flex flex-wrap gap-6 mt-auto">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 mb-1">
                          <Calendar className="size-3.5" /> Start Date
                        </p>
                        <p className="text-sm font-bold text-on-surface">
                          {new Date(sub.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5 mb-1">
                          <Calendar className="size-3.5" /> End Date
                        </p>
                        <p className="text-sm font-bold text-on-surface">
                          {new Date(sub.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                          Amount Paid
                        </p>
                        <p className="text-sm font-bold text-primary">
                          ${(sub.priceInMajorUnits || sub.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Section */}
                  <div className={`p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l min-w-[250px] ${
                    isActive ? "bg-[#f0fdf4] border-[#86efac]" : "bg-surface-container-lowest border-outline-variant/15"
                  }`}>
                    
                    {isActive && (
                      <div className="flex flex-col gap-4">
                        <div className="text-center mb-2">
                          <CheckCircle2 className="size-10 text-[#16a34a] mx-auto mb-2" />
                          <p className="text-[#15803d] font-bold">Your plan is active!</p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => handleCancel(sub.id)}
                          disabled={actionLoading === sub.id}
                          className="w-full font-bold text-[#dc2626] border-[#fca5a5] hover:bg-[#fef2f2]"
                        >
                          {actionLoading === sub.id ? <Loader2 className="size-4 animate-spin mr-2" /> : <X className="size-4 mr-2" />}
                          Cancel Subscription
                        </Button>
                      </div>
                    )}

                    {(isCancelled || isExpired) && (
                      <div className="flex flex-col gap-4">
                        <div className="text-center mb-2">
                          <AlertCircle className="size-10 text-on-surface-variant opacity-60 mx-auto mb-2" />
                          <p className="text-on-surface-variant font-bold">No longer active.</p>
                        </div>
                        <Button 
                          onClick={() => handleRenew(sub)}
                          disabled={actionLoading === sub.id}
                          className="w-full font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200"
                        >
                          {actionLoading === sub.id ? <Loader2 className="size-4 animate-spin mr-2" /> : <RefreshCw className="size-4 mr-2" />}
                          Renew Plan
                        </Button>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
