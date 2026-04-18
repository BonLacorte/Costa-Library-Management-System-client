"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2, GitBranch, Pencil, Trash2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Genre {
  id: number;
  code?: string;
  name: string;
  parentGenreId: number | null;
  parentGenreName: string | null;
  subGenres: Genre[] | null;
  bookCount: number;
}

export default function AdminGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Authentication token not found. Please sign in again.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:8080/api/genres/active/hierarchy", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Server returned ${response.status}.`);
        const data: Genre[] = await response.json();
        setGenres(data);
      } catch (err: any) {
        setError(err.message || "Failed to load genre hierarchy from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  const renderGenreRows = (genre: Genre, isSubGenre = false): React.ReactElement[] => {
    const rows: React.ReactElement[] = [];

    const matchesSearch = !search ||
      genre.name.toLowerCase().includes(search.toLowerCase()) ||
      (genre.code || "").toLowerCase().includes(search.toLowerCase());

    if (matchesSearch) {
      rows.push(
        <TableRow key={genre.id} className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors">
          {/* ID */}
          <TableCell className="pl-6 py-4">
            <span className="font-mono text-xs text-outline bg-surface-container px-2 py-1 rounded">
              {String(genre.id).padStart(4, "0")}
            </span>
          </TableCell>

          {/* Code */}
          <TableCell className="py-4">
            {genre.code ? (
              <span className="font-mono text-xs font-semibold text-on-surface-variant">
                {genre.code}
              </span>
            ) : <span className="text-xs text-outline">—</span>}
          </TableCell>

          {/* Name */}
          <TableCell className="py-4">
            <div className={`flex items-center gap-2 ${isSubGenre ? "pl-5" : ""}`}>
              {isSubGenre && <GitBranch className="size-3.5 text-outline/50 shrink-0" />}
              <span className={`text-sm font-medium text-on-surface ${isSubGenre ? "text-on-surface-variant" : ""}`}>
                {genre.name}
              </span>
            </div>
          </TableCell>

          {/* Books */}
          <TableCell className="py-4 text-center">
            <span className="inline-flex items-center justify-center size-7 rounded-full bg-surface-container text-xs font-semibold text-on-surface-variant">
              {genre.bookCount}
            </span>
          </TableCell>

          {/* Type badge */}
          <TableCell className="py-4 text-center">
            {genre.parentGenreId === null ? (
              <Badge className="rounded-full px-3 py-0.5 text-[10px] uppercase tracking-wider font-semibold border-0 shadow-none bg-primary/10 text-primary hover:bg-primary/10">
                Main Genre
              </Badge>
            ) : (
              <Badge className="rounded-full px-3 py-0.5 text-[10px] tracking-wide font-medium border border-outline-variant/30 bg-transparent text-on-surface-variant hover:bg-transparent shadow-none whitespace-nowrap">
                Sub · {genre.parentGenreName}
              </Badge>
            )}
          </TableCell>

          {/* Actions */}
          <TableCell className="py-4 text-right pr-6">
            <div className="flex items-center justify-end gap-1">
              <Link href={`/admin/genres/${genre.id}/edit`}>
                <Button variant="ghost" size="icon" className="size-8 rounded-lg text-primary hover:bg-primary/10 hover:text-primary">
                  <Pencil className="size-4" />
                </Button>
              </Link>
              <Link href={`/admin/genres/${genre.id}/edit`}>
                <Button variant="ghost" size="icon" className="size-8 rounded-lg text-error hover:bg-error-container hover:text-error">
                  <Trash2 className="size-4" />
                </Button>
              </Link>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (genre.subGenres && genre.subGenres.length > 0) {
      genre.subGenres.forEach(sub => {
        rows.push(...renderGenreRows(sub, true));
      });
    }

    return rows;
  };

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1">Genre Management</h1>
          <p className="text-sm text-on-surface-variant">Classify and organize the library collection.</p>
        </div>
        <Link href="/admin/genres/add">
          <Button className="rounded-lg px-5 gap-2 shadow-[var(--shadow-ambient)] font-medium">
            <Plus className="size-4" /> ADD NEW GENRE
          </Button>
        </Link>
      </header>

      {/* Filter Bar */}
      <div className="bg-surface-container-low rounded-2xl p-4 shadow-none border-0 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-outline" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or code..."
              className="pl-9 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none rounded-lg h-10 text-sm border border-outline-variant/30"
            />
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="flex items-center gap-2 px-4 h-10 rounded-lg border border-outline-variant/30 text-sm font-medium text-on-surface-variant bg-surface-container-lowest hover:bg-surface-container transition-colors"
            >
              <X className="size-3.5" /> CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-low rounded-2xl shadow-none border-0 overflow-hidden">
        {error ? (
          <div className="p-10 text-center bg-error-container text-error">
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-container hover:bg-surface-container border-b border-outline-variant/20">
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider pl-6">ID</TableHead>
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Code</TableHead>
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Books</TableHead>
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Type</TableHead>
                <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Loader2 className="size-6 animate-spin text-primary mx-auto opacity-60" />
                  </TableCell>
                </TableRow>
              ) : genres.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-on-surface-variant font-medium text-sm">
                    No genres found. Add the first one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                genres.flatMap(genre => renderGenreRows(genre))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
