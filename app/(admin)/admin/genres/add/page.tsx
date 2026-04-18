"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AddGenre() {
  const [formData, setFormData] = useState({
    code: "", name: "", description: "", displayOrder: 0, active: true, parentGenreId: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const payload = {
      ...formData,
      parentGenreId: formData.parentGenreId ? Number(formData.parentGenreId) : null
    };

    try {
      const response = await fetch("http://localhost:8080/api/genres/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(payload),
      });

      if (response.created || response.status === 201) {
        setSuccess(true);
        setFormData({ code: "", name: "", description: "", displayOrder: 0, active: true, parentGenreId: "" });
      }
    } catch (error) {
      console.error(error);
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
    <div className="p-6 lg:p-12 pb-20 max-w-[800px] w-full animate-in fade-in duration-500">
      <Link href="/admin/genres" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8">
        <ArrowLeft className="size-4" /> Back to Genres
      </Link>
      
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Add New Genre</h1>
        <p className="text-on-surface-variant">Create a new classification category for the library.</p>
      </header>

      {success && (
        <div className="flex gap-3 mb-8 p-4 rounded-xl bg-primary-container text-on-primary-container">
           <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
           <p className="text-sm font-medium">Genre created successfully.</p>
        </div>
      )}

      <div className="bg-surface-container-low rounded-3xl p-8 lg:p-10 shadow-none border-0">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Genre Code</label>
              <Input name="code" required value={formData.code} onChange={handleChange} placeholder="e.g. ARCH-01" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl font-mono text-sm" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Genre Name</label>
              <Input name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. brutalism, modern art" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-on-surface-variant pl-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full text-sm placeholder:text-outline/50 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none p-4 rounded-2xl border-0 focus:ring-2 focus:ring-primary outline-none text-on-surface" placeholder="Contextual summary..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Display Order</label>
              <Input name="displayOrder" type="number" required value={formData.displayOrder} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Parent Genre ID (Optional)</label>
              <Input name="parentGenreId" type="number" value={formData.parentGenreId} onChange={handleChange} placeholder="Numeric ID if child genre" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
            </div>
          </div>

          <div className="flex gap-8 py-2">
             <label className="flex items-center gap-3 text-sm font-medium text-on-surface cursor-pointer">
               <input name="active" type="checkbox" checked={formData.active} onChange={handleChange} className="size-4 rounded accent-primary border-outline/20" /> Active
             </label>
          </div>

          <div className="pt-8 border-t border-outline-variant/20 flex gap-4">
            <Button type="submit" disabled={loading} className="rounded-full px-8 shadow-none shadow-[var(--shadow-ambient)]">
               {loading ? "Saving..." : "Save Genre"}
            </Button>
            <Link href="/admin/genres">
               <Button variant="outline" type="button" className="rounded-full px-8 shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
