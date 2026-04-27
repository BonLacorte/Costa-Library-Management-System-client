"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Loader2, ArrowLeft, Save, Calendar, 
  FileText, DollarSign, AlertCircle, RefreshCcw
} from "lucide-react";

interface Loan {
  id: number;
  bookTitle: string;
  status: string;
  dueDate: string;
  returnDate: string | null;
  maxRenewals: number;
  fineAmount: number | null;
  finePaid: boolean | null;
  notes: string | null;
}

const STATUS_OPTIONS = [
  "CHECKED_OUT",
  "RETURNED",
  "OVERDUE",
  "LOST",
  "DAMAGED"
];

export default function AdminEditLoan() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    status: "",
    dueDate: "",
    returnDate: "",
    maxRenewals: 0,
    fineAmount: 0,
    finePaid: false,
    notes: ""
  });

  const fetchLoan = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("jwt");
    if (!token) { setError("Auth token not found."); setLoading(false); return; }

    try {
      const res = await fetch(`http://localhost:8080/api/book-loans/${id}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load loan record.");
      const data: Loan = await res.json();
      
      setFormData({
        status: data.status,
        dueDate: data.dueDate || "",
        returnDate: data.returnDate || "",
        maxRenewals: data.maxRenewals || 0,
        fineAmount: Number(data.fineAmount) || 0,
        finePaid: data.finePaid || false,
        notes: data.notes || ""
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchLoan(); }, [fetchLoan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("jwt");
    
    // Prepare payload
    const payload = {
      ...formData,
      returnDate: formData.returnDate || null,
      fineAmount: formData.fineAmount || 0
    };

    try {
      const res = await fetch(`http://localhost:8080/api/book-loans/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update book loan.");
      }

      setSuccess("Book loan updated successfully!");
      setTimeout(() => router.push("/admin/loans"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="size-10 animate-spin text-primary opacity-60" />
        <p className="text-on-surface-variant font-medium">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            <h1 className="text-2xl font-serif font-bold text-on-surface">Edit Book Loan</h1>
            <p className="text-sm text-on-surface-variant">Modify loan attributes and status</p>
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
          <Save className="size-5 shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-sm space-y-6">
          {/* Status Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <RefreshCcw className="size-3" /> Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full h-12 px-4 rounded-xl border border-outline-variant/30 bg-surface-container text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <Calendar className="size-3" /> Due Date
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="h-12 rounded-xl bg-surface-container border-outline-variant/30 focus-visible:ring-2 focus-visible:ring-primary/20"
                required
              />
            </div>

            {/* Return Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <Calendar className="size-3" /> Return Date
              </label>
              <Input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                className="h-12 rounded-xl bg-surface-container border-outline-variant/30 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              <p className="text-[10px] text-on-surface-variant pl-1">Leave empty if not yet returned</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Max Renewals */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <RefreshCcw className="size-3" /> Max Renewals
              </label>
              <Input
                type="number"
                min="0"
                value={formData.maxRenewals}
                onChange={(e) => setFormData({...formData, maxRenewals: parseInt(e.target.value)})}
                className="h-12 rounded-xl bg-surface-container border-outline-variant/30 focus-visible:ring-2 focus-visible:ring-primary/20"
                required
              />
            </div>

            {/* Fine Amount */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <DollarSign className="size-3" /> Fine Amount (₱)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.fineAmount}
                onChange={(e) => setFormData({...formData, fineAmount: parseFloat(e.target.value)})}
                className="h-12 rounded-xl bg-surface-container border-outline-variant/30 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          {/* Fine Paid Switch */}
          <div className="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-outline-variant/10">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-on-surface">Fine Paid Status</p>
              <p className="text-xs text-on-surface-variant">Mark if the fine has been collected</p>
            </div>
            <Switch 
              checked={formData.finePaid}
              onCheckedChange={(val) => setFormData({...formData, finePaid: val})}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <FileText className="size-3" /> Librarian Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Enter notes about condition, return details, etc."
              className="min-h-[120px] rounded-2xl bg-surface-container border-outline-variant/30 focus-visible:ring-2 focus-visible:ring-primary/20 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="flex-1 h-14 rounded-2xl shadow-lg shadow-primary/20 font-bold text-base gap-2"
            disabled={saving}
          >
            {saving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            {saving ? "Saving Changes..." : "Save Changes"}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.back()}
            className="h-14 rounded-2xl px-8 border-outline-variant/30 font-bold text-on-surface-variant"
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
