"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AddBook() {
  const [formData, setFormData] = useState({
    isbn: "", title: "", author: "", genreId: 0, publisher: "", publicationDate: "",
    language: "", pages: 0, description: "", totalCopies: 1, availableCopies: 1, 
    price: 0, coverImageUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8080/api/books/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(formData),
      });

      if (response.created || response.status === 201) {
        setSuccess(true);
        setFormData({
          isbn: "", title: "", author: "", genreId: 0, publisher: "", publicationDate: "",
          language: "", pages: 0, description: "", totalCopies: 1, availableCopies: 1, 
          price: 0, coverImageUrl: ""
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1000px] w-full animate-in fade-in duration-500">
      <Link href="/admin/books" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-8">
        <ArrowLeft className="size-4" /> Back to Inventory
      </Link>
      
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Add New Book</h1>
        <p className="text-on-surface-variant">Register a new piece of literature into the system.</p>
      </header>

      {success && (
        <div className="flex gap-3 mb-8 p-4 rounded-xl bg-primary-container text-on-primary-container">
           <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
           <p className="text-sm font-medium">Book registered successfully.</p>
        </div>
      )}

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

          <div className="pt-8 border-t border-outline-variant/20 flex gap-4">
            <Button type="submit" disabled={loading} className="rounded-full px-8 shadow-none shadow-[var(--shadow-ambient)]">
               {loading ? "Saving..." : "Save Book"}
            </Button>
            <Link href="/admin/books">
               <Button variant="outline" type="button" className="rounded-full px-8 shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
