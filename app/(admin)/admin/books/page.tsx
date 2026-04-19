"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, ChevronLeft, ChevronRight, Loader2, Pencil, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [pageData, setPageData] = useState({
    pageNumber: 0,
    pageSize: 20,
    totalPages: 0,
    first: true,
    last: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const queryParams = new URLSearchParams({ page: page.toString(), size: "20" });
        if (searchTerm) queryParams.append("searchTerm", searchTerm);
        if (availableOnly) queryParams.append("availableOnly", "true");

        const response = await fetch(`http://localhost:8080/api/books?${queryParams.toString()}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("jwt")}` }
        });

        if (!response.ok) throw new Error("Failed to fetch books catalogue from server.");

        const data = await response.json();
        setBooks(data.content || []);
        setPageData({
          pageNumber: data.pageNumber || 0,
          pageSize: data.pageSize || 20,
          totalPages: data.totalPages || 0,
          first: data.first ?? true,
          last: data.last ?? true,
        });
      } catch (err: any) {
        setError(err.message || "An error occurred communicating with the API.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timeoutId);
  }, [page, searchTerm, availableOnly]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleClear = () => {
    setSearchTerm("");
    setAvailableOnly(false);
    setPage(0);
  };

  const hasFilters = searchTerm || availableOnly;

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1">Books Management</h1>
          <p className="text-sm text-on-surface-variant">Manage your library's book collection</p>
        </div>
        <Link href="/admin/books/add">
          <Button className="rounded-lg px-5 gap-2 shadow-[var(--shadow-ambient)] font-medium">
            <Plus className="size-4" /> ADD NEW BOOK
          </Button>
        </Link>
      </header>

      {/* Filter Bar */}
      <div className="bg-surface-container-low rounded-2xl p-4 shadow-none border-0 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-outline" />
            <Input
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title, author, or ISBN"
              className="pl-9 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none rounded-lg h-10 text-sm border border-outline-variant/30"
            />
          </div>

          {/* Availability toggle styled as select */}
          <button
            onClick={() => { setAvailableOnly(!availableOnly); setPage(0); }}
            className={`flex items-center gap-2 px-4 h-10 rounded-lg border text-sm font-medium transition-colors min-w-[130px] justify-between ${availableOnly
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/60"
              }`}
          >
            <span>{availableOnly ? "Available Only" : "Availability"}</span>
            <ChevronRight className="size-3.5 rotate-90 opacity-60" />
          </button>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 h-10 rounded-lg border border-outline-variant/30 text-sm font-medium text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container transition-colors"
            >
              <X className="size-3.5" /> CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface-container-low rounded-2xl shadow-none border-0 overflow-hidden">
        {error ? (
          <div className="p-10 text-center bg-error-container text-error">
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-container hover:bg-surface-container border-b border-outline-variant/20">
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider w-16 pl-6">Cover</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Title</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Author</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">ISBN</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Genre</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Total Copies</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Available</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Year</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && books.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-48 text-center">
                      <Loader2 className="size-6 animate-spin text-primary mx-auto opacity-60" />
                    </TableCell>
                  </TableRow>
                ) : books.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-48 text-center text-on-surface-variant text-sm font-medium">
                      No books found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  books.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
                    >
                      {/* Cover */}
                      <TableCell className="pl-6 py-3 w-16">
                        {item.coverImageUrl ? (
                          <img
                            src={item.coverImageUrl}
                            alt={item.title}
                            className="w-10 h-13 object-cover rounded shadow-md"
                            style={{ height: "52px" }}
                          />
                        ) : (
                          <div className="w-10 h-[52px] rounded bg-surface-container-highest flex items-center justify-center">
                            <span className="text-[10px] text-outline font-medium">N/A</span>
                          </div>
                        )}
                      </TableCell>

                      {/* Title */}
                      <TableCell className="py-3 max-w-[180px]">
                        <p className="font-medium text-sm text-on-surface line-clamp-2 leading-snug">{item.title}</p>
                      </TableCell>

                      {/* Author */}
                      <TableCell className="py-3 text-sm text-on-surface-variant whitespace-nowrap">
                        {item.author}
                      </TableCell>

                      {/* ISBN */}
                      <TableCell className="py-3">
                        <span className="font-mono text-xs text-outline bg-surface-container px-2 py-1 rounded">
                          {item.isbn || `ID-${item.id}`}
                        </span>
                      </TableCell>

                      {/* Genre */}
                      <TableCell className="py-3">
                        {item.genreName ? (
                          <Badge className="rounded-full px-2.5 py-0.5 text-[10px] font-medium border border-primary/30 bg-transparent text-primary hover:bg-transparent shadow-none">
                            {item.genreName}
                          </Badge>
                        ) : (
                          <span className="text-xs text-outline">—</span>
                        )}
                      </TableCell>

                      {/* Total Copies */}
                      <TableCell className="py-3 text-center text-sm font-medium text-on-surface">
                        {item.totalCopies}
                      </TableCell>

                      {/* Available — colored circle badge */}
                      <TableCell className="py-3 text-center">
                        <span className={`inline-flex items-center justify-center size-8 rounded-full text-sm font-bold text-white shadow-sm ${item.availableCopies > 0 ? "bg-[#22c55e]" : "bg-[#ef4444]"
                          }`}>
                          {item.availableCopies}
                        </span>
                      </TableCell>

                      {/* Publication Year */}
                      <TableCell className="py-3 text-center">
                        <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                          {item.publicationDate ? item.publicationDate.slice(0, 10) : "—"}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3 text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/books/${item.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg text-primary hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil className="size-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/books/${item.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg text-error hover:bg-error-container hover:text-error"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/15">
              <p className="text-sm text-on-surface-variant font-medium">
                Page {pageData.pageNumber + 1} of {Math.max(1, pageData.totalPages)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                  disabled={pageData.first || loading}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                  disabled={pageData.last || loading}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
