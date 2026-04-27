"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface DashboardStats {
  totalBooks: number;
  activeLoans: number;
  overdueLoans: number;
  totalUsers: number;
  monthlyRevenue: number;
  pendingReservations: number;
  activeSubscriptions: number;
  pendingFines: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    activeLoans: 0,
    overdueLoans: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    pendingReservations: 0,
    activeSubscriptions: 0,
    pendingFines: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Fetch all stats in parallel
        const [
          booksRes,
          usersRes,
          revenueRes,
          reservationsRes,
          activeLoansRes,
          overdueLoansRes,
          subscriptionsRes,
          finesRes,
        ] = await Promise.allSettled([
          fetch("http://localhost:8080/api/books/stats", { headers }),
          fetch("http://localhost:8080/api/users/statistics", { headers }),
          fetch("http://localhost:8080/api/payments/statistics/monthly-revenue", { headers }),
          fetch("http://localhost:8080/api/reservations?activeOnly=true&size=1", { headers }),
          fetch("http://localhost:8080/api/book-loans/search", {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ status: "CHECKED_OUT", page: 0, size: 1 }),
          }),
          fetch("http://localhost:8080/api/book-loans/search", {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ status: "OVERDUE", page: 0, size: 1 }),
          }),
          fetch("http://localhost:8080/api/subscriptions/admin/active", { headers }),
          fetch("http://localhost:8080/api/fines?status=PENDING&size=1", { headers }),
        ]);

        const safeJson = async (result: PromiseSettledResult<Response>) => {
          if (result.status === "fulfilled" && result.value.ok) {
            return result.value.json();
          }
          return null;
        };

        const [booksData, usersData, revenueData, reservationsData, activeLoansData, overdueLoansData, subscriptionsData, finesData] =
          await Promise.all([
            safeJson(booksRes),
            safeJson(usersRes),
            safeJson(revenueRes),
            safeJson(reservationsRes),
            safeJson(activeLoansRes),
            safeJson(overdueLoansRes),
            safeJson(subscriptionsRes),
            safeJson(finesRes),
          ]);

        setStats({
          totalBooks: booksData?.totalActiveBooks ?? 0,
          totalUsers: usersData?.totalUsers ?? 0,
          monthlyRevenue: revenueData?.monthlyRevenue ?? 0,
          pendingReservations: reservationsData?.totalElements ?? 0,
          activeLoans: activeLoansData?.totalElements ?? 0,
          overdueLoans: overdueLoansData?.totalElements ?? 0,
          activeSubscriptions: Array.isArray(subscriptionsData) ? subscriptionsData.length : (subscriptionsData?.totalElements ?? 0),
          pendingFines: finesData?.totalElements ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary opacity-60 mb-4" />
        <p className="text-on-surface-variant font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">

      {/* Header */}
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1">Dashboard Overview</h1>
        <p className="text-sm text-on-surface-variant">Welcome back! Here&apos;s what&apos;s happening in your library today.</p>
      </header>

      {/* Row 1: Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">{stats.totalBooks}</p>
          <p className="text-sm text-on-surface-variant font-medium">Total Books</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">{stats.activeLoans}</p>
          <p className="text-sm text-on-surface-variant font-medium">Active Loans</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">{stats.totalUsers}</p>
          <p className="text-sm text-on-surface-variant font-medium">Total Users</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">${stats.monthlyRevenue.toFixed(2)}</p>
          <p className="text-sm text-on-surface-variant font-medium">Monthly Revenue</p>
        </div>
      </div>

      {/* Row 2: Quick Stats (Full Width) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">{stats.overdueLoans}</p>
          <p className="text-sm text-on-surface-variant font-medium">Overdue Loans</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">{stats.pendingReservations}</p>
          <p className="text-sm text-on-surface-variant font-medium">Pending Reservations</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">{stats.activeSubscriptions}</p>
          <p className="text-sm text-on-surface-variant font-medium">Active Subscriptions</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 shadow-none border-0 text-center flex flex-col justify-center">
          <p className="text-3xl font-bold mb-1 text-primary">{stats.pendingFines}</p>
          <p className="text-sm text-on-surface-variant font-medium">Pending Fines</p>
        </div>
      </div>

    </div>
  );
}
