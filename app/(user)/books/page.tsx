"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, User, XCircle, CheckCircle2, ChevronLeft, ChevronRight, Loader2, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genreName?: string;
  genreId?: number;
  totalCopies: number;
  availableCopies: number;
  status?: string;
  description?: string;
  coverImageUrl?: string;
}

interface Genre {
  id: number;
  name: string;
}

export default function UserBrowseBooks() {
  const router = useRouter();

  // Data States
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);

  // Filter States
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenreId, setSelectedGenreId] = useState<number | "all">("all");
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState("newest");

  // Dedicated ISBN Search State
  const [isbnSearch, setIsbnSearch] = useState("");
  const [isbnSearching, setIsbnSearching] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (selectedGenreId !== "all") params.append("genreId", selectedGenreId.toString());
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Please log in first.");

      const response = await fetch(`http://localhost:8080/api/books?${params.toString()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}.`);
      const data = await response.json();
      const content = data.content || [];
      setBooks(content);
      setHasMore(content.length === size);
    } catch (err: any) {
      setError(err.message || "Failed to load books.");
    } finally {
      setLoading(false);
    }
  }, [page, size, searchTerm, selectedGenreId, availableOnly]);

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("http://localhost:8080/api/genres/active", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) return;
      const data = await response.json();
      setGenres(data.content || data || []);
    } catch (err) {
      console.error("Failed to load genres:", err);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleIsbnSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isbnSearch.trim()) return;
    setIsbnSearching(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`http://localhost:8080/api/books/isbn/${isbnSearch.trim()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.status === 404) {
        throw new Error("No book found with that ISBN.");
      }
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}.`);
      }
      const data: Book = await response.json();
      router.push(`/books/${data.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to search by ISBN.");
      setIsbnSearching(false); // only stop loading if it failed, else we're redirecting
    }
  };

  // Helper to determine status based on payload if backend doesn't provide a 'status' string
  const getStatus = (book: Book) => {
    if (book.status) return book.status;
    return book.availableCopies > 0 ? "Available" : "No copies left";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] w-full animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="bg-white pt-10 pb-10 border-b border-outline-variant/10 mb-8">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-3">
            Browse Our <span className="text-primary">Collection</span>
          </h1>
          <p className="text-on-surface-variant text-base">
            Discover thousands of books across all genres
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-20">

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left Sidebar (Filters) */}
          <aside className="w-full lg:w-[280px] shrink-0 space-y-6">

            {/* Genres Card */}
            <div className="bg-white rounded-xl border border-outline-variant/20 p-5 shadow-sm">
              <h3 className="font-bold text-lg text-on-surface mb-4">Genres</h3>

              <div className="relative pl-1 pr-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="absolute right-1 top-1 bottom-1 w-1 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-20 bg-primary w-full rounded-full absolute top-10"></div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedGenreId("all"); setPage(0); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedGenreId === "all"
                        ? "bg-[#f3e8ff] text-primary"
                        : "text-on-surface-variant hover:bg-surface-container-lowest"
                      }`}
                  >
                    <div className={`size-4 rounded-full border-[4px] flex items-center justify-center shrink-0 ${selectedGenreId === "all"
                        ? "border-primary bg-white"
                        : "border-outline-variant/50 bg-transparent"
                      }`} />
                    All Genres
                  </button>

                  {genres.map(genre => (
                    <button
                      key={genre.id}
                      onClick={() => { setSelectedGenreId(genre.id); setPage(0); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedGenreId === genre.id
                          ? "bg-[#f3e8ff] text-primary"
                          : "text-on-surface-variant hover:bg-surface-container-lowest"
                        }`}
                    >
                      <div className={`size-4 rounded-full border-[4px] flex items-center justify-center shrink-0 ${selectedGenreId === genre.id
                          ? "border-primary bg-white"
                          : "border-outline-variant/50 bg-transparent"
                        }`} />
                      <span className="truncate">{genre.name}</span>
                    </button>
                  ))}

                  {/* Fallback if genres list is empty */}
                  {genres.length === 0 && !loading && (
                    <div className="px-3 py-2 text-xs text-on-surface-variant italic">No genres found in database.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-white rounded-xl border border-outline-variant/20 p-5 shadow-sm">
              <h3 className="font-bold text-lg text-on-surface mb-4">Availability</h3>
              <select
                value={availableOnly ? "available" : "all"}
                onChange={(e) => { setAvailableOnly(e.target.value === "available"); setPage(0); }}
                className="w-full h-11 px-4 rounded-lg border-2 border-primary/20 text-on-surface text-sm font-medium focus:outline-none focus:border-primary transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%237c3aed%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:calc(100%-1rem)_center] bg-[length:0.6rem]"
              >
                <option value="all">All Books</option>
                <option value="available">Available Only</option>
              </select>
            </div>

            {/* Direct ISBN Search Card */}
            <div className="bg-white rounded-xl border border-outline-variant/20 p-5 shadow-sm">
              <h3 className="font-bold text-lg text-on-surface mb-2 flex items-center gap-2">
                <BookOpen className="size-5 text-primary" /> Direct ISBN
              </h3>
              <p className="text-xs text-on-surface-variant mb-4">Instantly jump to a specific book by its ISBN.</p>
              <form onSubmit={handleIsbnSearch} className="flex flex-col gap-2">
                <Input
                  placeholder="Enter ISBN..."
                  value={isbnSearch}
                  onChange={(e) => setIsbnSearch(e.target.value)}
                  className="h-11 bg-surface-container-lowest text-sm focus-visible:ring-1 focus-visible:ring-primary shadow-none"
                />
                <Button
                  type="submit"
                  disabled={isbnSearching || !isbnSearch.trim()}
                  className="w-full shadow-none font-bold"
                >
                  {isbnSearching ? <Loader2 className="size-4 animate-spin" /> : "Lookup ISBN"}
                </Button>
              </form>
            </div>

          </aside>

          {/* Main Content Area */}
          <div className="flex-1">

            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row items-end gap-4 mb-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-outline-variant" />
                <Input
                  placeholder="Search by title, author, or category..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                  className="w-full h-12 pl-12 bg-white border-outline-variant/20 shadow-sm text-base focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                />
              </div>
              <div className="w-full md:w-[200px] shrink-0">
                <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-outline-variant/20 bg-white text-on-surface text-sm font-medium focus:outline-none focus:border-primary transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23737373%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:calc(100%-1rem)_center] bg-[length:0.6rem]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>

            {/* Book Grid */}
            {loading ? (
              <div className="bg-white rounded-xl border border-outline-variant/15 p-16 flex flex-col items-center justify-center shadow-sm">
                <Loader2 className="size-8 animate-spin text-primary opacity-60 mb-4" />
                <p className="text-on-surface-variant text-sm font-medium">Fetching catalog...</p>
              </div>
            ) : books.length === 0 ? (
              <div className="bg-white rounded-xl border border-outline-variant/15 p-16 flex flex-col items-center justify-center shadow-sm text-center">
                <Search className="size-10 text-outline-variant opacity-50 mb-4" />
                <h3 className="text-lg font-bold text-on-surface mb-2">No books found</h3>
                <p className="text-on-surface-variant text-sm">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {(() => {
                    let displayedBooks = [...books];
                    
                    // Client-side availability filter
                    if (availableOnly) {
                      displayedBooks = displayedBooks.filter(b => b.availableCopies > 0);
                    }

                    // Client-side sorting
                    displayedBooks.sort((a, b) => {
                      if (sortBy === "title") return a.title.localeCompare(b.title);
                      if (sortBy === "oldest") return a.id - b.id;
                      return b.id - a.id; // newest (default fallback)
                    });

                    if (displayedBooks.length === 0) {
                      return (
                        <div className="col-span-full py-10 text-center text-on-surface-variant font-medium">
                          No books match your current filters.
                        </div>
                      );
                    }

                    return displayedBooks.map((book) => {
                    const status = getStatus(book);
                    return (
                      <div key={book.id} className="bg-white rounded-xl border border-outline-variant/15 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">

                        {/* Image Area */}
                        <div className="relative h-[220px] bg-surface-container-lowest border-b border-outline-variant/10">
                          {book.coverImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={book.coverImageUrl}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container/50 text-outline">
                              <BookOpen className="size-10 mb-2 opacity-50" />
                              <span className="text-xs font-bold uppercase tracking-wider opacity-60">No Photo</span>
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${status === "Available" ? "bg-[#22c55e]" : "bg-[#ef4444]"
                              }`}>
                              {status === "Available" ? (
                                <CheckCircle2 className="size-3.5" />
                              ) : (
                                <XCircle className="size-3.5" />
                              )}
                              {status}
                            </div>
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-lg text-on-surface leading-tight mb-2 line-clamp-2 min-h-[44px]">
                            {book.title}
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
                            <User className="size-4 shrink-0" />
                            <span className="truncate">{book.author}</span>
                            {book.genreName && (
                              <>
                                <span className="size-1 rounded-full bg-outline-variant/50 shrink-0" />
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">{book.genreName}</span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-3">
                            <span>ISBN: {book.isbn}</span>
                            <span>{book.availableCopies}/{book.totalCopies} copies</span>
                          </div>

                          <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 mb-5 flex-1">
                            {book.description || "No description available."}
                          </p>

                          <Button
                            variant="outline"
                            onClick={() => router.push(`/books/${book.id}`)}
                            className={`w-full font-bold border-2 h-11 ${status === "Available"
                                ? "border-primary/20 text-primary hover:bg-primary/5 hover:border-primary"
                                : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-lowest"
                              }`}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    );
                  })})()}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between bg-white rounded-xl border border-outline-variant/20 p-4 shadow-sm">
                  <p className="text-sm text-on-surface-variant font-medium">
                    Page {page + 1}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="gap-2 shadow-none border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                      disabled={page === 0 || loading}
                      onClick={() => setPage(p => p - 1)}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 shadow-none border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"
                      disabled={!hasMore || loading}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Scrollbar Custom CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
      `}} />
    </div>
  );
}
