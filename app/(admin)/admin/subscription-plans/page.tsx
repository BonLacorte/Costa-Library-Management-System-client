"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface Plan {
  id: number;
  name: string;
  planCode?: string;
  price: number;
  currency: string;
  durationDays?: number;
  maxBooksAllowed: number;
  maxDaysPerBook: number;
  isActive?: boolean;
  isFeatured?: boolean;
  badgeText?: string;
}

export default function AdminSubscriptionPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Authentication token not found. Please sign in again.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:8080/api/subscription-plans/active", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Server returned ${response.status}.`);
        const data: Plan[] = await response.json();
        setPlans(data);
      } catch (err: any) {
        setError(err.message || "Failed to load subscription plans from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1">Subscription Plans</h1>
          <p className="text-sm text-on-surface-variant">Configure access tiers and premium digital privileges.</p>
        </div>
        <Link href="/admin/subscription-plans/add">
          <Button className="rounded-lg px-5 gap-2 shadow-[var(--shadow-ambient)] font-medium">
            <Plus className="size-4" /> CREATE PLAN
          </Button>
        </Link>
      </header>

      {/* Table Card */}
      <div className="bg-surface-container-low rounded-2xl shadow-none border-0 overflow-hidden relative">
        {/* Signature accent stripe */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[image:var(--background-image-signature)]" />

        {error ? (
          <div className="p-10 text-center bg-error-container text-error">
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-container hover:bg-surface-container border-b border-outline-variant/20">
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider pl-6">ID</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Plan Code</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider">Tier Name</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Price</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Duration</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Max Books</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Days / Book</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-center">Status</TableHead>
                  <TableHead className="text-on-surface-variant font-semibold text-xs uppercase tracking-wider text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-48 text-center">
                      <Loader2 className="size-6 animate-spin text-primary mx-auto opacity-60" />
                    </TableCell>
                  </TableRow>
                ) : plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-48 text-center text-on-surface-variant font-medium text-sm">
                      No active subscription plans found.
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map(p => (
                    <TableRow key={p.id} className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors">
                      {/* ID */}
                      <TableCell className="pl-6 py-4">
                        <span className="font-mono text-xs text-outline bg-surface-container px-2 py-1 rounded">
                          {String(p.id).padStart(4, "0")}
                        </span>
                      </TableCell>

                      {/* Plan Code */}
                      <TableCell className="py-4">
                        {p.planCode ? (
                          <span className="font-mono text-xs font-semibold text-on-surface-variant">{p.planCode}</span>
                        ) : <span className="text-xs text-outline">—</span>}
                      </TableCell>

                      {/* Name */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-on-surface">{p.name}</span>
                          {p.isFeatured && (
                            <Badge className="rounded-full px-2 py-0 text-[9px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 border-0 shadow-none hover:bg-amber-100">
                              Featured
                            </Badge>
                          )}
                          {p.badgeText && (
                            <Badge className="rounded-full px-2 py-0 text-[9px] font-semibold bg-primary/10 text-primary border-0 shadow-none hover:bg-primary/10">
                              {p.badgeText}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="py-4 text-center">
                        <span className="text-sm font-semibold text-on-surface">
                          {p.currency} {Number(p.price).toFixed(2)}
                        </span>
                      </TableCell>

                      {/* Duration */}
                      <TableCell className="py-4 text-center">
                        <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                          {p.durationDays ? `${p.durationDays}d` : "—"}
                        </span>
                      </TableCell>

                      {/* Max Books */}
                      <TableCell className="py-4 text-center text-sm text-on-surface-variant">
                        {p.maxBooksAllowed} {p.maxBooksAllowed !== 1 ? "books" : "book"}
                      </TableCell>

                      {/* Days per book */}
                      <TableCell className="py-4 text-center text-sm text-on-surface-variant">
                        {p.maxDaysPerBook} days
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4 text-center">
                        <Badge className="rounded-full px-3 py-0.5 text-[10px] uppercase tracking-wider font-semibold border-0 shadow-none bg-primary/10 text-primary hover:bg-primary/10">
                          Active
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/subscription-plans/${p.id}/edit`}>
                            <Button variant="ghost" size="icon" className="size-8 rounded-lg text-primary hover:bg-primary/10 hover:text-primary">
                              <Pencil className="size-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/subscription-plans/${p.id}/edit`}>
                            <Button variant="ghost" size="icon" className="size-8 rounded-lg text-error hover:bg-error-container hover:text-error">
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
          </>
        )}
      </div>
    </div>
  );
}
