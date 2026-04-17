"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookMarked, UserCircle, LayoutDashboard, Library, BookLock, Receipt, Bookmark, Crown, Heart, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Books", href: "/books", icon: Library },
  { name: "Loans", href: "/loans", icon: BookLock },
  { name: "Fines", href: "/fines", icon: Receipt },
  { name: "Reservation", href: "/reservations", icon: Bookmark },
  { name: "Subscription", href: "/subscription", icon: Crown },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    router.push("/sign-in");
  };

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-surface-container-low flex flex-col justify-between hidden lg:flex shadow-none border-r-0 z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center shadow-[var(--shadow-ambient)]">
            <BookMarked className="text-on-primary size-4" />
          </div>
          <span className="font-serif text-xl font-medium tracking-tight text-primary-container">Costa</span>
        </div>
        
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            // Exact match for Dashboard so "/" doesn't match everything
            const isActive = item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors",
                isActive 
                  ? "bg-surface-container-highest text-primary shadow-none" 
                  : "text-on-surface-variant hover:bg-surface-container-highest hover:text-primary"
              )}>
                <Icon className="size-[18px]" /> {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-8 pb-10 space-y-1">
        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors"><UserCircle className="size-[18px]" /> Profile</Link>
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors"><Settings className="size-[18px]" /> Settings</Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-error hover:bg-error-container transition-colors"><LogOut className="size-[18px]" /> Logout</button>
      </div>
    </aside>
  );
}
