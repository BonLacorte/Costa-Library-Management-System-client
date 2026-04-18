"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, BookOpen, Calendar, Clock, User, Mail, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";

interface SubscriptionDetail {
  id: number;
  planName: string;
  planCode: string;
  userName: string;
  userEmail: string;
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  isActive: boolean;
  maxBooksAllowed: number;
  maxDaysPerBook: number;
}

function DetailRow({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: any }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-outline-variant/10 last:border-0">
      {Icon && (
        <div className="size-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="size-4 text-on-surface-variant" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">{label}</p>
        <div className="text-sm font-medium text-on-surface">{value}</div>
      </div>
    </div>
  );
}

export default function SubscriptionDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const [sub, setSub] = useState<SubscriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Authentication token not found. Please sign in again.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8080/api/subscriptions/${params.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Server returned ${response.status}.`);
        const data: SubscriptionDetail = await response.json();
        setSub(data);
      } catch (err: any) {
        setError(err.message || "Failed to load subscription details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [params.id]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[800px] w-full animate-in fade-in duration-500">
      <Link
        href="/admin/user-subscriptions"
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="size-4" /> Back to Subscriptions
      </Link>

      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1">Subscription Detail</h1>
        <p className="text-sm text-on-surface-variant">Read-only view of subscription record #{params.id}.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-surface-container-low rounded-2xl p-12 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary opacity-60" />
        </div>
      ) : sub ? (
        <div className="space-y-4">
          {/* Status banner */}
          <div className={`rounded-2xl px-6 py-4 flex items-center justify-between ${
            sub.isActive ? "bg-primary/10" : "bg-error-container"
          }`}>
            <div className="flex items-center gap-3">
              <ShieldCheck className={`size-5 ${sub.isActive ? "text-primary" : "text-error"}`} />
              <span className={`font-semibold text-sm ${sub.isActive ? "text-primary" : "text-error"}`}>
                {sub.isActive ? "Active Subscription" : "Inactive / Expired"}
              </span>
            </div>
            <Badge className={`rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-0 shadow-none ${
              sub.daysRemaining > 14
                ? "bg-primary/20 text-primary hover:bg-primary/20"
                : sub.daysRemaining > 3
                ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                : "bg-error-container text-error hover:bg-error-container"
            }`}>
              {sub.daysRemaining}d remaining
            </Badge>
          </div>

          {/* Plan Info */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Plan Information</h2>
            <DetailRow label="Plan Name" value={sub.planName} icon={Star} />
            <DetailRow
              label="Plan Code"
              value={<span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{sub.planCode}</span>}
              icon={ShieldCheck}
            />
            <DetailRow
              label="Price"
              value={<span className="font-semibold">{sub.currency} {Number(sub.price).toFixed(2)}</span>}
            />
            <DetailRow
              label="Max Books Allowed"
              value={<span>{sub.maxBooksAllowed} {sub.maxBooksAllowed !== 1 ? "books" : "book"}</span>}
              icon={BookOpen}
            />
            <DetailRow
              label="Max Days per Book"
              value={`${sub.maxDaysPerBook} days`}
              icon={Clock}
            />
          </div>

          {/* Member Info */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Member Information</h2>
            <DetailRow label="Full Name" value={sub.userName || "—"} icon={User} />
            <DetailRow label="Email Address" value={sub.userEmail} icon={Mail} />
          </div>

          {/* Dates */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Billing Period</h2>
            <DetailRow label="Start Date" value={formatDate(sub.startDate)} icon={Calendar} />
            <DetailRow label="End Date" value={formatDate(sub.endDate)} icon={Calendar} />
            <DetailRow
              label="Days Remaining"
              value={
                <span className={`font-bold ${sub.daysRemaining > 14 ? "text-primary" : sub.daysRemaining > 3 ? "text-amber-600" : "text-error"}`}>
                  {sub.daysRemaining} days
                </span>
              }
              icon={Clock}
            />
          </div>

          <div className="pt-2">
            <Link href="/admin/user-subscriptions">
              <Button variant="outline" className="rounded-lg shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface gap-2">
                <ArrowLeft className="size-4" /> Back to List
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
