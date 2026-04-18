"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpdateSubscriptionPlan({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [formData, setFormData] = useState({
    planCode: "", name: "", description: "", durationDays: 30, price: 0, currency: "USD",
    maxBooksAllowed: 1, maxDaysPerBook: 7, displayOrder: 0, isActive: true, isFeatured: false,
    badgeText: "", adminNotes: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/subscription-plans/${params.id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            planCode: data.planCode || "",
            name: data.name || "",
            description: data.description || "",
            durationDays: data.durationDays || 30,
            price: data.price || 0,
            currency: data.currency || "USD",
            maxBooksAllowed: data.maxBooksAllowed || 1,
            maxDaysPerBook: data.maxDaysPerBook || 7,
            displayOrder: data.displayOrder || 0,
            isActive: data.isActive ?? true,
            isFeatured: data.isFeatured ?? false,
            badgeText: data.badgeText || "",
            adminNotes: data.adminNotes || ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch plan data:", error);
      }
    };
    fetchPlanData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const response = await fetch(`http://localhost:8080/api/subscription-plans/admin/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/subscription-plans");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to deactivate this plan? This action cannot be undone.")) return;
    try {
      const response = await fetch(`http://localhost:8080/api/subscription-plans/admin/${params.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }
      });
      if (response.ok) {
        setShowModal(false);
        router.push("/admin/subscription-plans");
      }
    } catch (error) {
      console.error(error);
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
    <div className="p-6 lg:p-12 pb-20 max-w-[1000px] w-full animate-in fade-in duration-500 relative">
      <Link href="/admin/subscription-plans" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8">
        <ArrowLeft className="size-4" /> Back to Plans
      </Link>
      
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Update Plan</h1>
        <p className="text-on-surface-variant">Update architecture for plan target: {params.id}.</p>
      </header>

      {success && (
        <div className="flex gap-3 mb-8 p-4 rounded-xl bg-primary-container text-on-primary-container">
           <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
           <p className="text-sm font-medium">Subscription plan updated successfully.</p>
        </div>
      )}

      <div className="space-y-8">
        <div className="bg-surface-container-low rounded-3xl p-8 lg:p-10 shadow-none border-0">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Plan Code</label>
                <Input name="planCode" required value={formData.planCode} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl font-mono text-sm" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Name</label>
                <Input name="name" required value={formData.name} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full text-sm placeholder:text-outline/50 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none p-4 rounded-2xl border-0 focus:ring-2 focus:ring-primary outline-none text-on-surface"></textarea>
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
                <Input name="currency" required value={formData.currency} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
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
                <label className="text-sm font-medium text-on-surface-variant pl-1">Sort Order</label>
                <Input name="displayOrder" type="number" required value={formData.displayOrder} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
            </div>

             <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Badge Text</label>
                <Input name="badgeText" value={formData.badgeText} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
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
              <label className="text-sm font-medium text-on-surface-variant pl-1">Admin Notes</label>
              <textarea name="adminNotes" value={formData.adminNotes} onChange={handleChange} rows={2} className="w-full text-sm placeholder:text-outline/50 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none p-4 rounded-2xl border-0 focus:ring-2 focus:ring-primary outline-none text-on-surface"></textarea>
            </div>

            <div className="pt-8 border-t border-outline-variant/20 flex gap-4">
              <Button type="submit" disabled={loading} className="rounded-full px-8 shadow-none shadow-[var(--shadow-ambient)]">
                 {loading ? "Updating..." : "Update Plan"}
              </Button>
            </div>
          </form>
        </div>

        <section className="bg-surface-container-low rounded-3xl p-8 lg:p-10 shadow-none border-0 mt-8">
          <h2 className="font-serif text-2xl font-medium text-on-surface mb-2 text-error">Danger Zone</h2>
          <p className="text-sm text-on-surface-variant mb-6">Execution of a soft-delete protocol (deactivation) for this plan.</p>
          
          <div className="pt-6 border-t border-error-container/50">
             <Button onClick={() => setShowModal(true)} variant="outline" className="rounded-full px-6 shadow-none border-error/30 text-error hover:bg-error-container hover:border-error-container transition-colors">
               Deactivate Plan
             </Button>
          </div>
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-low p-8 rounded-[2rem] max-w-md w-full mx-4 shadow-2xl border border-outline-variant/10">
            <div className="size-14 rounded-full bg-error-container flex items-center justify-center mb-6 shadow-[var(--shadow-ambient)]">
               <AlertTriangle className="size-6 text-error" />
            </div>
            <h3 className="font-serif text-2xl font-medium text-on-surface mb-2 tracking-tight">Deactivate Plan?</h3>
            <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
              Are you sure? This is a soft-delete that will transition the plan into a deprecated phase without terminating existing ledger associations.
            </p>
            <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant/20">
               <Button onClick={() => setShowModal(false)} variant="outline" className="rounded-full bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface shadow-none px-6">Cancel</Button>
               <Button onClick={handleDelete} className="rounded-full bg-error text-error-container hover:bg-error/90 shadow-none px-6">Confirm Deactivation</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
