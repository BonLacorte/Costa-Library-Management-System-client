"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, ArrowLeft, PlusCircle, DollarSign, 
  Hash, Tag, FileText, AlertCircle
} from "lucide-react";

const FINE_TYPES = ["OVERDUE", "DAMAGE", "LOSS", "PROCESSING"];

export default function AdminCreateFine() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    bookLoanId: "",
    type: "OVERDUE",
    amount: "",
    reason: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      setLoading(false);
      return;
    }

    // Validation
    if (!formData.bookLoanId || !formData.amount) {
      setError("Book Loan ID and Amount are mandatory.");
      setLoading(false);
      return;
    }

    const payload = {
      bookLoanId: parseInt(formData.bookLoanId),
      type: formData.type,
      amount: parseInt(formData.amount),
      reason: formData.reason,
      notes: formData.notes
    };

    try {
      const res = await fetch("http://localhost:8080/api/fines", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create fine record.");
      }

      setSuccess("Fine record created successfully!");
      setTimeout(() => router.push("/admin/fines"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full hover:bg-surface-container"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-on-surface">Create Fine Record</h1>
            <p className="text-sm text-on-surface-variant">Manually issue a fine to a user</p>
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-6 bg-error-container text-error p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="size-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-100 text-green-700 p-4 rounded-2xl flex items-center gap-3">
          <PlusCircle className="size-5 shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Loan ID */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <Hash className="size-3" /> Book Loan ID
              </label>
              <Input
                type="number"
                placeholder="e.g. 123"
                value={formData.bookLoanId}
                onChange={(e) => setFormData({...formData, bookLoanId: e.target.value})}
                className="h-12 rounded-xl bg-surface-container border-outline-variant/30 focus-visible:ring-2 focus-visible:ring-primary/20"
                required
              />
            </div>

            {/* Fine Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <Tag className="size-3" /> Fine Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full h-12 px-4 rounded-xl border border-outline-variant/30 bg-surface-container text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                {FINE_TYPES.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <DollarSign className="size-3" /> Amount (₱)
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="h-12 rounded-xl bg-surface-container border-outline-variant/30 focus-visible:ring-2 focus-visible:ring-primary/20"
              required
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <FileText className="size-3" /> Reason
            </label>
            <Input
              type="text"
              placeholder="e.g. Returned with torn pages"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="h-12 rounded-xl bg-surface-container border-outline-variant/30 focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <FileText className="size-3" /> Internal Notes
            </label>
            <Textarea
              placeholder="Additional details for admin reference..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="min-h-[100px] rounded-2xl bg-surface-container border-outline-variant/30 focus-visible:ring-2 focus-visible:ring-primary/20 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="flex-1 h-14 rounded-2xl shadow-lg shadow-primary/20 font-bold text-base gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : <PlusCircle className="size-5" />}
            {loading ? "Creating..." : "Create Fine Record"}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
            className="h-14 rounded-2xl px-8 border-outline-variant/30 font-bold text-on-surface-variant"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
