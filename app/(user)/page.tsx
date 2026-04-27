"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookLock, Bookmark, ArrowRight, TrendingUp, CalendarCheck, Sparkles, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";

interface BookLoan {
  id: number;
  bookId: number;
  bookTitle?: string;
  bookAuthor?: string;
  checkoutDate: string;
  dueDate: string;
  status: string;
  bookCoverImage?: string;
}

interface Reservation {
  id: number;
  status: string;
}

interface Fine {
  id: number;
  amount: number;
  amountPaid: number;
  status: string;
}

export default function UserDashboard() {
  const [loans, setLoans] = useState<BookLoan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);

  // Mocked data for stats without direct endpoints
  const dayStreak = 7;
  const readingGoalTotal = 30;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) return;

        // Fetch Loans
        const loansRes = await fetch("http://localhost:8080/api/book-loans/my?size=100", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (loansRes.ok) {
          const loansData = await loansRes.json();
          setLoans(loansData.content || loansData || []);
        }

        // Fetch Reservations
        const resRes = await fetch("http://localhost:8080/api/reservations/my?size=100", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (resRes.ok) {
          const resData = await resRes.json();
          setReservations(resData.content || resData || []);
        }

        // Fetch Fines
        const finesRes = await fetch("http://localhost:8080/api/fines/my", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (finesRes.ok) {
          const finesData = await finesRes.json();
          setFines(finesData.content || finesData || []);
        }

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeLoans = loans.filter(l => l.status === "CHECKED_OUT");
  const totalBooksLoaned = loans.length;
  const activeReservationsCount = reservations.filter(r => r.status === "PENDING" || r.status === "AVAILABLE").length;
  const currentFinesTotal = fines
    .filter(f => f.status === "PENDING")
    .reduce((sum, f) => sum + (f.amount - (f.amountPaid || 0)), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] w-full flex flex-col items-center justify-center">
        <Loader2 className="size-10 animate-spin text-violet-600 opacity-60 mb-4" />
        <p className="text-on-surface-variant font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div >

      <div className="bg-white pt-10 pb-10 border-b border-outline-variant/10">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-3">My Dashboard</h1>
          <p className="text-on-surface-variant text-base">Track your reading journey and manage your library</p>
        </div>
      </div>

      <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full animate-in fade-in duration-500 bg-[#f8f9fc] min-h-screen">

        {/* Top 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-outline-variant/15 rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary mb-1">{activeLoans.length}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Current Loans</p>
          </div>
          <div className="bg-white border border-outline-variant/15 rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary mb-1">{activeReservationsCount}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Reservations</p>
          </div>
          <div className="bg-white border border-outline-variant/15 rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary mb-1">${currentFinesTotal.toFixed(2)}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Current Fines</p>
          </div>
          <div className="bg-white border border-outline-variant/15 rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary mb-1">{totalBooksLoaned}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Books Loaned</p>
          </div>
        </div>

        {/* Tabs and Content Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/15 p-8 min-h-[400px]">

          <div className="flex flex-wrap gap-8 border-b border-outline-variant/20 mb-8 pb-1">
            <button className="text-primary font-bold border-b-2 border-violet-600 pb-3 text-sm px-1">
              Current Loans
            </button>
            <button onClick={() => window.location.href = "/reservations"} className="text-on-surface-variant font-medium hover:text-primary pb-3 text-sm px-1">
              Reservations
            </button>
            <button onClick={() => window.location.href = "/loans"} className="text-on-surface-variant font-medium hover:text-primary pb-3 text-sm px-1">
              Reading History
            </button>
            <button onClick={() => window.location.href = "/books"} className="text-on-surface-variant font-medium hover:text-primary pb-3 text-sm px-1">
              Recommendations
            </button>
          </div>

          <h3 className="text-xl font-bold text-[#1e1b4b] mb-6">Books You're Currently Reading</h3>

          {activeLoans.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
              <BookOpen className="size-12 text-on-surface-variant opacity-30 mb-4" />
              <h4 className="text-lg font-bold text-on-surface mb-2">No active loans</h4>
              <p className="text-on-surface-variant text-sm mb-6 max-w-md">You aren't reading any books right now. Explore the catalog to find your next great read!</p>
              <Link href="/books">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6">
                  Browse Books
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeLoans.map(loan => {
                const due = new Date(loan.dueDate);
                const isOverdue = due < new Date();

                return (
                  <div key={loan.id} className="bg-white rounded-xl border border-outline-variant/15 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    {/* Image Area */}
                    <div className="relative h-[220px] bg-surface-container-lowest border-b border-outline-variant/10">
                      {loan.bookCoverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={loan.bookCoverImage}
                          alt={loan.bookTitle || "Book Cover"}
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
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${!isOverdue ? "bg-[#22c55e]" : "bg-[#ef4444]"}`}>
                          {!isOverdue ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                          )}
                          {isOverdue ? "Overdue" : "Active"}
                        </div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-on-surface leading-tight mb-2 line-clamp-2 min-h-[44px]">
                        {loan.bookTitle || `Book #${loan.bookId}`}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        <span className="truncate">{loan.bookAuthor || 'Unknown Author'}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-3">
                        <span className={`font-bold uppercase tracking-wider ${isOverdue ? 'text-red-600' : 'text-orange-600'}`}>
                          {isOverdue ? 'Overdue' : `Due: ${due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                        </span>
                      </div>

                      <Link href={`/loans/${loan.id}`} className="mt-auto pt-2">
                        <Button
                          variant="outline"
                          className="w-full font-bold border-2 h-11 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary"
                        >
                          Manage Loan
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
