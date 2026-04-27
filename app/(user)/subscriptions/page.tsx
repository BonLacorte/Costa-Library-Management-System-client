"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Award, Star, CheckCircle2, BookOpen, Clock, AlertCircle } from "lucide-react";
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
  isFeatured: boolean;
  badgeText?: string;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("Please log in first.");

        // 1. Fetch all active plans
        const plansRes = await fetch("http://localhost:8080/api/subscription-plans/active", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!plansRes.ok) throw new Error("Failed to fetch subscription plans");
        const plansData = await plansRes.json();
        setPlans(plansData);

        // Fetch User Info to get userId
        const userRes = await fetch("http://localhost:8080/api/users/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        let userId = null;
        if (userRes.ok) {
          const userData = await userRes.json();
          userId = userData.id;
        }

        // 2. Fetch user's active subscription
        const subUrl = userId
          ? `http://localhost:8080/api/subscriptions/active?userId=${userId}`
          : "http://localhost:8080/api/subscriptions/active";
        const activeSubRes = await fetch(subUrl, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (activeSubRes.ok) {
          const activeSubData = await activeSubRes.json();
          // Assuming activeSubData has planId or plan.id
          setActivePlanId(activeSubData.planId || (activeSubData.plan && activeSubData.plan.id) || null);
        } else if (activeSubRes.status !== 404) {
          // It's okay if it's 404, just means no active subscription
          console.warn("Could not fetch active subscription:", activeSubRes.status);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while loading plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] w-full flex flex-col items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary opacity-60 mb-4" />
        <p className="text-on-surface-variant font-medium">Loading subscription plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] w-full p-10 flex flex-col items-center justify-center text-center">
        <AlertCircle className="size-16 text-error opacity-60 mb-4" />
        <h2 className="text-2xl font-bold text-on-surface mb-2">Failed to Load Plans</h2>
        <p className="text-on-surface-variant mb-8">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="font-bold border-primary/20 text-primary">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] w-full animate-in fade-in duration-500 relative">

      {/* Top Banner section */}
      <div className="bg-white border-b border-outline-variant/15 w-full py-16 px-6 text-center shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-3">Choose Your Plan</h1>
          <p className="text-on-surface-variant text-base">Select a plan that fits your reading habits. Upgrade, downgrade, or cancel anytime.</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16 pb-24">

        <div className="flex justify-end mb-8">
          <Link href="/subscriptions/history">
            <Button variant="outline" className="font-bold border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-lowest">
              <Clock className="size-4 mr-2" /> Manage Subscriptions
            </Button>
          </Link>
        </div>

        {plans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-outline-variant/15 p-20 flex flex-col items-center justify-center shadow-sm text-center">
            <Award className="size-16 text-on-surface-variant opacity-40 mb-4" />
            <h2 className="text-2xl font-bold text-on-surface mb-2">No Plans Available</h2>
            <p className="text-on-surface-variant">Check back later for new subscription options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => {
              const isActive = activePlanId === plan.id;
              const isPopular = plan.isFeatured || plan.planCode === "GOLD";

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-[1.25rem] overflow-hidden flex flex-col transition-all duration-300 relative ${isActive ? 'border-2 border-primary shadow-xl shadow-primary/10 scale-105 z-10' :
                    isPopular ? 'border border-primary/30 shadow-lg scale-[1.02] z-10' :
                      'border border-outline-variant/20 shadow-sm hover:shadow-md'
                    }`}
                >
                  {/* Top Accent Bar */}
                  <div className={`h-2 w-full ${isActive ? 'bg-primary' : isPopular ? 'bg-primary/40' : 'bg-outline-variant/30'}`} />

                  {/* Card Header */}
                  <div className="p-8 pb-6 flex flex-col relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col items-start gap-2">
                        {plan.badgeText && (
                          <div className="px-3 py-1 bg-primary/5 border border-primary/10 text-primary rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider">
                            <Star className="size-3 fill-primary" /> {plan.badgeText}
                          </div>
                        )}
                      </div>

                      {isActive && (
                        <div className="px-3 py-1 bg-primary text-white rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
                          <CheckCircle2 className="size-3" /> Active
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-on-surface mb-1">{plan.planName}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2 h-10">
                      {plan.description || "Access books with extended loan duration and priority support."}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="px-8 pb-8 pt-2">
                    <div className="flex items-baseline gap-1 text-on-surface">
                      <span className="text-2xl font-bold">$</span>
                      <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                      <span className="text-on-surface-variant text-sm font-medium ml-1">/ {plan.durationDays} days</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="px-8 pb-8 space-y-4 flex-1">
                    <div className="flex items-center gap-4 bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/15">
                      <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                        <BookOpen className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant leading-tight">Borrow Limit</p>
                        <p className="text-sm font-bold text-on-surface">{plan.maxBooksAllowed} Books</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/15">
                      <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                        <Clock className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant leading-tight">Loan Duration</p>
                        <p className="text-sm font-bold text-on-surface">{plan.maxDaysPerBook} Days/Book</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-8 pb-8">
                    {isActive ? (
                      <Button
                        disabled
                        className="w-full h-14 text-sm font-bold bg-surface-container-high text-on-surface-variant/50 border border-outline-variant/20 rounded-xl"
                      >
                        <CheckCircle2 className="size-4 mr-2" /> Current Plan
                      </Button>
                    ) : (
                      <Link href={`/subscriptions/checkout/${plan.id}`} className="w-full">
                        <Button className={`w-full h-14 text-sm font-bold rounded-xl shadow-md transition-all ${isPopular
                            ? "bg-primary hover:bg-primary-container text-white shadow-primary/20"
                            : "bg-white border border-primary text-white hover:bg-primary/5"
                          }`}>
                          {activePlanId ? "Switch to this Plan" : "Select Plan"}
                        </Button>
                      </Link>
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
