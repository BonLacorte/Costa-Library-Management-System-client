"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionPlan {
  id: number;
  planCode: string;
  planName: string;
  description: string;
  durationDays: number;
  price: number;
  currency: string;
  maxBooksAllowed: number;
  maxDaysPerBook: number;
}

export default function SubscriptionCheckoutPage({ params: paramsPromise }: { params: Promise<{ planId: string }> }) {
  const router = useRouter();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ planId: string } | null>(null);

  useEffect(() => {
    paramsPromise.then(p => setResolvedParams(p));
  }, [paramsPromise]);

  useEffect(() => {
    const fetchData = async () => {
      if (!resolvedParams?.planId) return;
      
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("Please log in first.");

        // Fetch User Info to get userId
        const userRes = await fetch("http://localhost:8080/api/users/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserId(userData.id);
        }

        // Fetch Plan Details
        const planRes = await fetch(`http://localhost:8080/api/subscription-plans/${resolvedParams.planId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!planRes.ok) {
          if (planRes.status === 404) throw new Error("Subscription plan not found.");
          throw new Error(`Server returned ${planRes.status}`);
        }
        
        const planData = await planRes.json();
        setPlan(planData);
      } catch (err: any) {
        setError(err.message || "Failed to load checkout details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams]);

  const handleSubscribe = async () => {
    if (!plan || !userId) return;
    
    setPaymentLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      const payload = {
        planId: plan.id,
        paymentGateway: "RAZORPAY",
        userId: userId,
        autoRenew: true
      };

      const response = await fetch("http://localhost:8080/api/subscriptions/subscribe", {
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

      // 1. Extract paymentId from response
      const paymentData = await response.json();
      const paymentId = paymentData.paymentId;

      if (paymentId) {
        // 2. Fetch PaymentDTO to get subscriptionId
        const paymentRes = await fetch(`http://localhost:8080/api/payments/${paymentId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (paymentRes.ok) {
          const paymentDto = await paymentRes.json();
          const subscriptionId = paymentDto.subscriptionId;

          if (subscriptionId) {
            // 3. Simulate successful payment callback to activate the subscription
            await fetch(`http://localhost:8080/api/subscriptions/activate?subscriptionId=${subscriptionId}&paymentId=${paymentId}`, {
              method: "POST",
              headers: { "Authorization": `Bearer ${token}` }
            });
          }
        }
      }

      // In a real app with Razorpay, this would redirect to gateway or open modal.
      alert(`Successfully subscribed to ${plan.planName}!`);
      router.push("/subscriptions/history");

    } catch (err: any) {
      alert(err.message || "An error occurred during subscription payment.");
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

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] w-full p-10 flex flex-col items-center justify-center text-center">
        <AlertCircle className="size-16 text-error opacity-60 mb-4" />
        <h2 className="text-2xl font-bold text-on-surface mb-2">Checkout Error</h2>
        <p className="text-on-surface-variant mb-8">{error || "Could not retrieve the plan details."}</p>
        <Link href="/subscriptions">
          <Button variant="outline" className="font-bold border-primary/20 text-primary">Go Back to Plans</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] w-full animate-in fade-in duration-500 pb-20">
      
      {/* Top Navigation Strip */}
      <div className="bg-white border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-[1000px] mx-auto">
          <button
            onClick={() => router.push("/subscriptions")}
            className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Plans
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 pt-10">
        
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1e1b4b] mb-3">
            Secure Checkout
          </h1>
          <p className="text-on-surface-variant flex items-center justify-center gap-2 font-medium">
            <ShieldCheck className="size-5 text-[#16a34a]" /> Encrypted and secure payment processing
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Order Summary */}
          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-outline-variant/15 p-8 lg:p-10 shadow-sm">
            <h2 className="text-xl font-bold text-[#1e1b4b] mb-6 border-b border-outline-variant/15 pb-4">Order Summary</h2>
            
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-1">{plan.planName}</h3>
                <p className="text-sm text-on-surface-variant">Billed every {plan.durationDays} days</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-[#1e1b4b]">${plan.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 mb-8 space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium text-on-surface">
                <CheckCircle2 className="size-5 text-[#16a34a] shrink-0" />
                Borrow up to <span className="font-bold">{plan.maxBooksAllowed} books</span> at a time
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-on-surface">
                <CheckCircle2 className="size-5 text-[#16a34a] shrink-0" />
                Keep each book for up to <span className="font-bold">{plan.maxDaysPerBook} days</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-on-surface">
                <CheckCircle2 className="size-5 text-[#16a34a] shrink-0" />
                Priority customer support
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-[#1e1b4b] border-t border-outline-variant/15 pt-6 mt-6">
              <span>Total Due Today</span>
              <span className="text-2xl">${plan.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-outline-variant/15 p-8 lg:p-10 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold text-[#1e1b4b] mb-6 border-b border-outline-variant/15 pb-4">Payment Method</h2>
            
            <div className="bg-[#f8f9fc] border border-outline-variant/20 rounded-2xl p-6 mb-8 text-center flex flex-col items-center justify-center">
              <CreditCard className="size-12 text-violet-500 mb-4 opacity-80" />
              <p className="text-sm font-medium text-on-surface-variant">
                Payment will be securely processed via Razorpay. Your subscription will be active immediately upon successful payment.
              </p>
            </div>

            <Button 
              onClick={handleSubscribe}
              disabled={paymentLoading || !userId}
              className="w-full h-14 text-lg font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-200 mt-auto"
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-3" /> Processing...
                </>
              ) : (
                <>
                  Confirm & Pay ${plan.price.toFixed(2)}
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-on-surface-variant mt-4 opacity-70">
              By confirming, you agree to our Terms of Service and Privacy Policy. Auto-renewal is enabled by default.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
