"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AddSubscriptionPlan() {
  const [formData, setFormData] = useState({
    planCode: "", name: "", description: "", durationDays: 30, price: 0, currency: "USD",
    maxBooksAllowed: 1, maxDaysPerBook: 7, displayOrder: 0, isActive: true, isFeatured: false,
    badgeText: "", adminNotes: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const payload = {
      planCode: formData.planCode,
      name: formData.name,
      description: formData.description,
      durationDays: Number(formData.durationDays),
      price: Number(formData.price),
      currency: formData.currency,
      maxBooksAllowed: Number(formData.maxBooksAllowed),
      maxDaysPerBook: Number(formData.maxDaysPerBook),
      displayOrder: Number(formData.displayOrder),
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      badgeText: formData.badgeText,
      adminNotes: formData.adminNotes,
    };

    try {
      const response = await fetch("http://localhost:8080/api/subscription-plans/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 201 || response.ok) {
        setSuccess(true);
        setFormData({
          planCode: "", name: "", description: "", durationDays: 30, price: 0, currency: "USD",
          maxBooksAllowed: 1, maxDaysPerBook: 7, displayOrder: 0, isActive: true, isFeatured: false,
          badgeText: "", adminNotes: ""
        });
      } else {
        const errData = await response.json().catch(() => null);
        setError(errData?.message || `Server error: ${response.status} ${response.statusText}`);
      }
    } catch (err: any) {
      setError(err.message || "Network error — could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1000px] w-full animate-in fade-in duration-500">
      <Link href="/admin/subscription-plans" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8">
        <ArrowLeft className="size-4" /> Back to Plans
      </Link>
      
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Create Plan</h1>
        <p className="text-on-surface-variant">Design a new subscription tier with specific parameters.</p>
      </header>

      {success && (
        <div className="flex gap-3 mb-8 p-4 rounded-xl bg-primary-container text-on-primary-container">
          <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">Subscription plan created successfully.</p>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-error-container text-error">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-surface-container-low rounded-3xl p-8 lg:p-10 shadow-none border-0">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Plan Code</label>
              <Input name="planCode" required value={formData.planCode} onChange={handleChange} placeholder="e.g. PREMIUM_ANNUAL" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl font-mono text-sm" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Name</label>
              <Input name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Costa Scholar" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-on-surface-variant pl-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full text-sm placeholder:text-outline/50 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none p-4 rounded-2xl border-0 focus:ring-2 focus:ring-primary outline-none text-on-surface" placeholder="Describe the benefits..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Duration (Days)</label>
              <Input name="durationDays" type="number" required value={formData.durationDays} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Price</label>
              <Input name="price" type="number" step="0.01" required value={formData.price} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Currency</label>
              <Input name="currency" required value={formData.currency} onChange={handleChange} placeholder="USD" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Max Books Allowed</label>
              <Input name="maxBooksAllowed" type="number" required value={formData.maxBooksAllowed} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Max Days / Book</label>
              <Input name="maxDaysPerBook" type="number" required value={formData.maxDaysPerBook} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
            </div>
             <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Sort / Display Order</label>
              <Input name="displayOrder" type="number" required value={formData.displayOrder} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
            </div>
          </div>

           <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Badge Text</label>
              <Input name="badgeText" value={formData.badgeText} onChange={handleChange} placeholder="e.g. Most Popular" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
           </div>

          <div className="flex gap-8 py-2">
             <label className="flex items-center gap-3 text-sm font-medium text-on-surface cursor-pointer">
               <input name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} className="size-4 rounded accent-primary border-outline/20" /> Active
             </label>
             <label className="flex items-center gap-3 text-sm font-medium text-on-surface cursor-pointer">
               <input name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleChange} className="size-4 rounded accent-primary border-outline/20" /> Featured
             </label>
          </div>

           <div className="space-y-3">
            <label className="text-sm font-medium text-on-surface-variant pl-1">Admin Notes (Internal)</label>
            <textarea name="adminNotes" value={formData.adminNotes} onChange={handleChange} rows={2} className="w-full text-sm placeholder:text-outline/50 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none p-4 rounded-2xl border-0 focus:ring-2 focus:ring-primary outline-none text-on-surface" placeholder="Internal tracking notes..."></textarea>
          </div>

          <div className="pt-8 border-t border-outline-variant/20 flex gap-4">
            <Button type="submit" disabled={loading} className="rounded-full px-8 shadow-none shadow-[var(--shadow-ambient)]">
               {loading ? "Creating..." : "Save Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
