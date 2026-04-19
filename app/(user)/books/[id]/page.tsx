"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, BookOpen, Hash, Tag, Building2, Calendar, FileText, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publishedDate?: string;
  genreName?: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  coverImageUrl?: string;
}

export default function BookDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const params = use(paramsPromise);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [myActiveLoan, setMyActiveLoan] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(`http://localhost:8080/api/books/${params.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) {
          if (response.status === 404) throw new Error("Book not found.");
          throw new Error(`Server returned ${response.status}.`);
        }
        const data = await response.json();
        setBook(data);

        // Fetch user's active loans to see if they already have this book
        const loansRes = await fetch("http://localhost:8080/api/book-loans/my", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (loansRes.ok) {
          const loansData = await loansRes.json();
          const active = (loansData.content || []).find((l: any) =>
            (l.bookId === Number(params.id) || (l.book && l.book.id === Number(params.id))) &&
            l.status === "CHECKED_OUT"
          );
          console.log(active);
          setMyActiveLoan(active || null);
        }

      } catch (err: any) {
        setError(err.message || "Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-primary opacity-60" />
          <p className="text-on-surface-variant font-medium">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] w-full p-10 flex flex-col items-center">
        <div className="bg-error-container text-error p-6 rounded-xl max-w-md text-center">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p className="text-sm font-medium mb-6">{error}</p>
          <Button onClick={() => router.push("/books")} variant="outline" className="border-error text-error hover:bg-error/10">
            Return to Browse
          </Button>
        </div>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  const handleAction = async (endpoint: string, payload: any, successMessage: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      const response = await fetch(`http://localhost:8080/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errMessage = `Failed: Server returned ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.message || errData.error) errMessage = errData.message || errData.error;
        } catch { /* ignore */ }
        throw new Error(errMessage);
      }

      alert(successMessage);
      window.location.reload(); // Quick refresh to update states
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] w-full animate-in fade-in duration-500 pb-20">
      
      {/* Top Navigation Strip */}
      <div className="bg-white border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-[1200px] mx-auto">
          <button
            onClick={() => router.push("/books")}
            className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Collection
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden flex flex-col lg:flex-row">

          {/* Left Column: Cover Image & Actions */}
          <div className="w-full lg:w-[400px] shrink-0 bg-surface-container-lowest border-r border-outline-variant/15 p-8 flex flex-col">
            <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-outline-variant/10 mb-8 relative">
              {book.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container/50 text-outline">
                  <BookOpen className="size-12 mb-3 opacity-50" />
                  <span className="text-sm font-bold uppercase tracking-wider opacity-60">No Photo</span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md ${isAvailable ? "bg-[#22c55e]" : "bg-[#ef4444]"}`}>
                  {isAvailable ? "Available" : "Checked Out"}
                </span>
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              {myActiveLoan ? (
                <Button 
                  onClick={() => handleAction("book-loans/checkin", {
                    bookLoanId: myActiveLoan.id,
                    condition: "RETURNED",
                    notes: "Returned via User Portal"
                  }, "Book successfully checked in!")}
                  disabled={actionLoading}
                  className="w-full h-14 text-base font-bold shadow-md hover:shadow-lg transition-all gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white"
                >
                  {actionLoading ? <Loader2 className="size-5 animate-spin" /> : <BookmarkPlus className="size-5" />}
                  Checkin / Return Book
                </Button>
              ) : isAvailable ? (
                <Button 
                  onClick={() => handleAction("book-loans/checkout", {
                    bookId: book.id,
                    checkoutDays: 14,
                    notes: "Checked out via User Portal"
                  }, "Book successfully checked out!")}
                  disabled={actionLoading}
                  className="w-full h-14 text-base font-bold shadow-md hover:shadow-lg transition-all gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white"
                >
                  {actionLoading ? <Loader2 className="size-5 animate-spin" /> : <BookmarkPlus className="size-5" />}
                  Checkout Book
                </Button>
              ) : (
                <Button 
                  onClick={() => handleAction("reservations/create", { bookId: book.id }, "Reservation created successfully!")}
                  disabled={actionLoading}
                  className="w-full h-14 text-base font-bold shadow-md hover:shadow-lg transition-all gap-2 bg-primary hover:bg-primary/90 text-on-primary"
                >
                  {actionLoading ? <Loader2 className="size-5 animate-spin" /> : <BookmarkPlus className="size-5" />}
                  Create Reservation
                </Button>
              )}

              <p className="text-center text-xs text-on-surface-variant font-medium">
                {book.availableCopies} of {book.totalCopies} copies available
              </p>
            </div>
          </div>

          {/* Right Column: Book Metadata */}
          <div className="flex-1 p-8 lg:p-12">
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-on-surface leading-tight mb-3">
                {book.title}
              </h1>
              <p className="text-lg text-primary font-medium flex items-center gap-2">
                <BookOpen className="size-5" /> {book.author}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-[#f3e8ff] flex items-center justify-center shrink-0">
                  <Hash className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-0.5">ISBN</p>
                  <p className="text-sm font-medium text-on-surface">{book.isbn}</p>
                </div>
              </div>

              {book.genreName && (
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-[#f3e8ff] flex items-center justify-center shrink-0">
                    <Tag className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-0.5">Genre</p>
                    <p className="text-sm font-medium text-on-surface">{book.genreName}</p>
                  </div>
                </div>
              )}

              {book.publisher && (
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-[#f3e8ff] flex items-center justify-center shrink-0">
                    <Building2 className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-0.5">Publisher</p>
                    <p className="text-sm font-medium text-on-surface">{book.publisher}</p>
                  </div>
                </div>
              )}

              {book.publishedDate && (
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-[#f3e8ff] flex items-center justify-center shrink-0">
                    <Calendar className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-0.5">Published</p>
                    <p className="text-sm font-medium text-on-surface">{new Date(book.publishedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-outline-variant/15 pt-8">
              <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                <FileText className="size-5 text-on-surface-variant" /> Description
              </h3>
              <div className="prose prose-sm max-w-none text-on-surface-variant leading-relaxed">
                {book.description ? (
                  <p>{book.description}</p>
                ) : (
                  <p className="italic">No description provided for this book.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
