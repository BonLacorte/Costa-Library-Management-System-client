"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpdateBook({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [formData, setFormData] = useState({
    isbn: "", title: "", author: "", genreId: 0, publisher: "", publicationDate: "",
    language: "", pages: 0, description: "", totalCopies: 1, availableCopies: 1,
    price: 0, coverImageUrl: "", active: true
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/books/${params.id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            isbn: data.isbn || "",
            title: data.title || "",
            author: data.author || "",
            genreId: data.genreId || 0,
            publisher: data.publisher || "",
            publicationDate: data.publicationDate || "",
            language: data.language || "",
            pages: data.pages || 0,
            description: data.description || "",
            totalCopies: data.totalCopies || 1,
            availableCopies: data.availableCopies || 1,
            price: data.price || 0,
            coverImageUrl: data.coverImageUrl || "",
            active: data.active ?? true
          });
        }
      } catch (error) {
        console.error("Failed to fetch book data:", error);
      }
    };
    fetchBookData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:8080/api/books/admin/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // // display to console the response
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
      const response = await fetch(`http://localhost:8080/api/books/admin/${params.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }
      });
      if (response.ok) {
        setShowModal(false);
        router.push("/admin/books");
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
      <Link href="/admin/books" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8">
        <ArrowLeft className="size-4" /> Back to Inventory
      </Link>

      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Update Book</h1>
        <p className="text-on-surface-variant">Modify metadata for ISBN: {params.id}.</p>
      </header>

      {success && (
        <div className="flex gap-3 mb-8 p-4 rounded-xl bg-primary-container text-on-primary-container">
          <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">Book updated successfully.</p>
        </div>
      )}

      <div className="space-y-8">
        <div className="bg-surface-container-low rounded-3xl p-8 lg:p-10 shadow-none border-0">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Title</label>
                <Input name="title" required value={formData.title} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Author</label>
                <Input name="author" required value={formData.author} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">ISBN</label>
                <Input name="isbn" required value={formData.isbn} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl font-mono text-sm" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Total Copies</label>
                <Input name="totalCopies" type="number" required value={formData.totalCopies} onChange={handleChange} min="1" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Available Copies</label>
                <Input name="availableCopies" type="number" required value={formData.availableCopies} onChange={handleChange} min="0" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full text-sm placeholder:text-outline/50 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none p-4 rounded-2xl border-0 focus:ring-2 focus:ring-primary outline-none text-on-surface"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Publication Date</label>
                <Input name="publicationDate" type="date" value={formData.publicationDate} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Publisher</label>
                <Input name="publisher" value={formData.publisher} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Genre ID</label>
                <Input name="genreId" type="number" value={formData.genreId} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Language</label>
                <Input name="language" value={formData.language} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Pages</label>
                <Input name="pages" type="number" value={formData.pages} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-on-surface-variant pl-1">Price</label>
                <Input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Cover Image URL</label>
              <Input name="coverImageUrl" type="url" value={formData.coverImageUrl} onChange={handleChange} className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
            </div>

            <div className="flex gap-8 py-2">
              <label className="flex items-center gap-3 text-sm font-medium text-on-surface cursor-pointer">
                <input name="active" type="checkbox" checked={formData.active} onChange={handleChange} className="size-4 rounded accent-primary border-outline/20" /> Active
              </label>
            </div>

            <div className="pt-8 border-t border-outline-variant/20 flex gap-4">
              <Button type="submit" disabled={loading} className="rounded-full px-8 shadow-none shadow-[var(--shadow-ambient)]">
                {loading ? "Updating..." : "Update Book"}
              </Button>
            </div>
          </form>
        </div>

        <section className="bg-surface-container-low rounded-3xl p-8 lg:p-10 shadow-none border-0 mt-8">
          <h2 className="font-serif text-2xl font-medium text-on-surface mb-2 text-error">Danger Zone</h2>
          <p className="text-sm text-on-surface-variant mb-6">Permanently remove this book from the library catalog (Soft Delete).</p>

          <div className="pt-6 border-t border-error-container/50">
            <Button onClick={() => setShowModal(true)} variant="outline" className="rounded-full px-6 shadow-none border-error/30 text-error hover:bg-error-container hover:border-error-container transition-colors">
              Delete Book
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
            <h3 className="font-serif text-2xl font-medium text-on-surface mb-2 tracking-tight">Delete Book?</h3>
            <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
              This action executes a soft-delete mechanism disabling the book immediately without wiping historical ledger checkout records.
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
