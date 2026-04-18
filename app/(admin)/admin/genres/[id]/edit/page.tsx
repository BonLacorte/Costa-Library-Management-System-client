"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpdateGenre({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: "", name: "", description: "", displayOrder: 0, active: true, parentGenreId: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/genres/${params.id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            code: data.code || "",
            name: data.name || "",
            description: data.description || "",
            displayOrder: data.displayOrder || 0,
            active: data.active ?? true,
            parentGenreId: data.parentGenreId ? String(data.parentGenreId) : ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch genre data:", error);
      }
    };
    fetchGenreData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const payload = {
      ...formData,
      parentGenreId: formData.parentGenreId ? Number(formData.parentGenreId) : null
    };

    try {
      const response = await fetch(`http://localhost:8080/api/genres/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // // display to console the response
        // console.log("success");
        // console.log(response);
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/genres/${params.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }
      });
      if (response.ok) {
        // display to console the response
        console.log("success");
        console.log(response);
        setShowModal(false);
        router.push("/admin/genres");
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
    <div className="p-6 lg:p-12 pb-20 max-w-[800px] w-full animate-in fade-in duration-500 relative">
      <Link href="/admin/genres" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8">
        <ArrowLeft className="size-4" /> Back to Genres
      </Link>

      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Update Genre</h1>
        <p className="text-on-surface-variant">Modify parameters for genre tag: {params.id}.</p>
      </header>

      {success && (
        <div className="flex gap-3 mb-8 p-4 rounded-xl bg-primary-container text-on-primary-container">
          <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">Genre updated successfully.</p>
        </div>
      )}

      <div className="space-y-8">
        <div className="bg-surface-container-low rounded-3xl p-8 lg:p-10 shadow-none border-0">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Genre Code</label>
                <Input name="code" required value={formData.code} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl font-mono text-sm" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Genre Name</label>
                <Input name="name" required value={formData.name} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full text-sm placeholder:text-outline/50 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none p-4 rounded-2xl border-0 focus:ring-2 focus:ring-primary outline-none text-on-surface"></textarea>
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
                {loading ? "Updating..." : "Update Genre"}
              </Button>
            </div>
          </form>
        </div>

        <section className="bg-surface-container-low rounded-3xl p-8 lg:p-10 shadow-none border-0 mt-8">
          <h2 className="font-serif text-2xl font-medium text-on-surface mb-2 text-error">Danger Zone</h2>
          <p className="text-sm text-on-surface-variant mb-6">Permanently disable this genre structure.</p>

          <div className="pt-6 border-t border-error-container/50">
            <Button onClick={() => setShowModal(true)} variant="outline" className="rounded-full px-6 shadow-none border-error/30 text-error hover:bg-error-container hover:border-error-container transition-colors">
              Delete Genre
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
            <h3 className="font-serif text-2xl font-medium text-on-surface mb-2 tracking-tight">Delete Genre?</h3>
            <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
              This action executes a soft-delete mechanism disabling the genre parameter immediately via the REST backend.
            </p>
            <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant/20">
              <Button onClick={() => setShowModal(false)} variant="outline" className="rounded-full bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface shadow-none px-6">Cancel</Button>
              <Button onClick={handleDelete} className="rounded-full bg-error text-error-container hover:bg-error/90 shadow-none px-6">Confirm Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
