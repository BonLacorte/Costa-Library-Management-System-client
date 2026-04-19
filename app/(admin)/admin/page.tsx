"use client";

import { 
  BookOpen, Calendar, Users, CreditCard, Award, Bookmark, 
  MessageSquare, TrendingUp, CalendarDays
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-10 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-1">Dashboard Overview</h1>
        <p className="text-sm text-on-surface-variant">Welcome back! Here's what's happening in your library today.</p>
      </header>

      {/* Row 1: Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        
        {/* Total Books */}
        <div className="rounded-xl p-6 text-white relative overflow-hidden flex flex-col justify-between h-[160px]" style={{ background: "linear-gradient(135deg, #7c5cda 0%, #5d3eb5 100%)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Total Books</p>
            <h2 className="text-5xl font-bold tracking-tight">9</h2>
            <p className="text-xs opacity-80 mt-1">In collection</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium opacity-90">
            <TrendingUp className="size-3.5" /> +12% from last month
          </div>
          <div className="absolute top-6 right-6 size-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <BookOpen className="size-6 text-white" />
          </div>
        </div>

        {/* Active Loans */}
        <div className="rounded-xl p-6 text-white relative overflow-hidden flex flex-col justify-between h-[160px]" style={{ background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Active Loans</p>
            <h2 className="text-5xl font-bold tracking-tight">14</h2>
            <p className="text-xs opacity-80 mt-1">10 overdue</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium opacity-90">
            <TrendingUp className="size-3.5" /> +8% from last month
          </div>
          <div className="absolute top-6 right-6 size-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Calendar className="size-6 text-white" />
          </div>
        </div>

        {/* Total Users */}
        <div className="rounded-xl p-6 text-white relative overflow-hidden flex flex-col justify-between h-[160px]" style={{ background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Total Users</p>
            <h2 className="text-5xl font-bold tracking-tight">9</h2>
            <p className="text-xs opacity-80 mt-1">Registered members</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium opacity-90">
            <TrendingUp className="size-3.5" /> +23% from last month
          </div>
          <div className="absolute top-6 right-6 size-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Users className="size-6 text-white" />
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-xl p-6 text-white relative overflow-hidden flex flex-col justify-between h-[160px]" style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Revenue</p>
            <h2 className="text-5xl font-bold tracking-tight">$5,158</h2>
            <p className="text-xs opacity-80 mt-1">This month</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium opacity-90">
            <TrendingUp className="size-3.5" /> +15% from last month
          </div>
          <div className="absolute top-6 right-6 size-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <CreditCard className="size-6 text-white" />
          </div>
        </div>

      </div>

      {/* Row 2: Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Active Subscriptions */}
        <div className="rounded-xl px-6 py-8 text-white relative overflow-hidden flex flex-col justify-center h-[120px]" style={{ background: "linear-gradient(135deg, #8165d6 0%, #6142ba 100%)" }}>
          <h2 className="text-4xl font-bold tracking-tight mb-1">13</h2>
          <p className="text-xs font-medium opacity-80">Active Subscriptions</p>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Award className="size-6 text-white" />
          </div>
        </div>

        {/* Pending Reservations */}
        <div className="rounded-xl px-6 py-8 text-white relative overflow-hidden flex flex-col justify-center h-[120px]" style={{ background: "linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)" }}>
          <h2 className="text-4xl font-bold tracking-tight mb-1">4</h2>
          <p className="text-xs font-medium opacity-80">Pending Reservations</p>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Bookmark className="size-6 text-white" />
          </div>
        </div>

        {/* Total Reviews */}
        <div className="rounded-xl px-6 py-8 text-white relative overflow-hidden flex flex-col justify-center h-[120px]" style={{ background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)" }}>
          <h2 className="text-4xl font-bold tracking-tight mb-1">1</h2>
          <p className="text-xs font-medium opacity-80">Total Reviews</p>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <MessageSquare className="size-6 text-white" />
          </div>
        </div>

      </div>

      {/* Row 3: Activities & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activities (Left - 2/3) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-lg font-bold text-on-surface">Recent Activities</h3>
            <span className="px-3 py-1 bg-[#22c55e] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              Live
            </span>
          </div>

          <div className="space-y-3">
            {[
              { id: 1, user: "Pinjal Zarmariya", action: "borrowed", item: "Operations Managements", time: "42 minutes ago", type: "Loan", icon: CalendarDays },
              { id: 2, user: "Pinjal Zarmariya", action: "subscribed to", item: "Silver Membership", time: "44 minutes ago", type: "Subscription", icon: Award },
              { id: 3, user: "Rutika", action: "borrowed", item: "Mastering Spring Boot and Microservices", time: "2 hours ago", type: "Loan", icon: CalendarDays },
              { id: 4, user: "Raam", action: "subscribed to", item: "Gold Membership", time: "2 hours ago", type: "Subscription", icon: Award },
              { id: 5, user: "Rutika", action: "borrowed", item: "Human Resource Management", time: "7 hours ago", type: "Loan", icon: CalendarDays },
            ].map(act => (
              <div key={act.id} className="flex items-center justify-between bg-[#f8f9fc] hover:bg-[#f1f4f9] transition-colors p-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${act.type === "Loan" ? "bg-indigo-100 text-indigo-500" : "bg-orange-100 text-orange-500"}`}>
                    <act.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-on-surface">
                      <span className="font-semibold">{act.user}</span> {act.action} <span className="font-semibold">{act.item}</span>
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{act.time}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${act.type === "Loan" ? "bg-indigo-500 text-white" : "bg-[#f97316] text-white"}`}>
                  {act.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats (Right - 1/3) */}
        <div>
          <h3 className="text-lg font-bold text-on-surface mb-4 px-2">Quick Stats</h3>
          <div className="space-y-4">
            
            <div className="bg-rose-50 p-6 rounded-xl flex flex-col justify-center border border-rose-100/50">
              <h2 className="text-3xl font-bold text-rose-500 mb-1">10</h2>
              <p className="text-xs font-medium text-rose-700/70">Overdue Loans</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl flex flex-col justify-center border border-orange-100/50">
              <h2 className="text-3xl font-bold text-orange-500 mb-1">4</h2>
              <p className="text-xs font-medium text-orange-700/70">Pending Reservations</p>
            </div>

            <div className="bg-emerald-50 p-6 rounded-xl flex flex-col justify-center border border-emerald-100/50">
              <h2 className="text-3xl font-bold text-emerald-500 mb-1">13</h2>
              <p className="text-xs font-medium text-emerald-700/70">Active Subscriptions</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
