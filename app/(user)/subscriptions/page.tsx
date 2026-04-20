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

        // 2. Fetch user's active subscription
        const activeSubRes = await fetch("http://localhost:8080/api/subscriptions/active", {
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
        <div className="max-w-[800px] mx-auto">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 font-bold text-sm mb-6 border border-violet-200 shadow-sm">
            <Award className="size-4 mr-2" /> Subscription Plans
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e1b4b] mb-4 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-lg text-on-surface-variant">
            Select a plan that fits your reading habits. Upgrade, downgrade, or cancel anytime.
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => {
              const isActive = activePlanId === plan.id;
              const isPopular = plan.isFeatured || plan.planCode === "GOLD"; // Adjust logic if needed

              return (
                <div 
                  key={plan.id} 
                  className={`bg-white rounded-[2rem] overflow-hidden flex flex-col transition-all duration-300 relative ${
                    isActive ? 'border-4 border-[#16a34a] shadow-xl shadow-green-100 scale-105 z-10' : 
                    isPopular ? 'border-2 border-violet-500 shadow-xl shadow-violet-100 scale-[1.02] z-10' : 
                    'border border-outline-variant/20 shadow-md hover:shadow-lg'
                  }`}
                >
                  
                  {/* Card Header (Purple Gradient) */}
                  <div className={`p-8 pb-10 flex flex-col text-white relative ${
                    isActive ? 'bg-gradient-to-br from-[#16a34a] to-[#15803d]' : 
                    'bg-gradient-to-br from-violet-500 to-indigo-600'
                  }`}>
                    
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex flex-col items-start gap-2">
                        {plan.badgeText && (
                          <div className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <Star className="size-3.5 fill-white" /> {plan.badgeText}
                          </div>
                        )}
                      </div>
                      
                      {isActive && (
                        <div className="px-3 py-1 bg-[#dcfce7] border border-[#86efac] text-[#16a34a] rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                          <CheckCircle2 className="size-3.5" /> Active
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2 relative z-10">{plan.planName}</h3>
                    <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium self-start backdrop-blur-md relative z-10">
                      {plan.durationDays} Days
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 flex-1 flex flex-col -mt-4 bg-white rounded-t-3xl relative z-20">
                    <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                      {plan.description || "Access books with extended loan duration and priority support."}
                    </p>

                    <div className="mb-8">
                      <div className="flex items-end gap-1 text-[#1e1b4b]">
                        <span className="text-2xl font-bold mb-1">$</span>
                        <span className="text-5xl font-extrabold tracking-tighter">{plan.price}</span>
                      </div>
                      <p className="text-on-surface-variant text-sm mt-1 font-medium">per {plan.durationDays} days</p>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-4 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/15">
                        <div className="bg-violet-100 p-2 rounded-lg shrink-0">
                          <BookOpen className="size-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Borrow Limit</p>
                          <p className="text-sm font-bold text-[#1e1b4b]">{plan.maxBooksAllowed} Books</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/15">
                        <div className="bg-violet-100 p-2 rounded-lg shrink-0">
                          <Clock className="size-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Loan Duration</p>
                          <p className="text-sm font-bold text-[#1e1b4b]">{plan.maxDaysPerBook} Days/Book</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Button */}
                    <div className="mt-auto pt-2">
                      {isActive ? (
                        <Button 
                          disabled 
                          className="w-full h-14 text-base font-bold bg-[#f1f5f9] text-[#64748b] border-2 border-[#e2e8f0]"
                        >
                          <CheckCircle2 className="size-5 mr-2" /> Current Plan
                        </Button>
                      ) : activePlanId ? (
                        <Link href={`/subscriptions/checkout/${plan.id}`} className="w-full">
                          <Button className="w-full h-14 text-base font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-200">
                            Switch Plan
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/subscriptions/checkout/${plan.id}`} className="w-full">
                          <Button className="w-full h-14 text-base font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-200">
                            Subscribe
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
  );
}
