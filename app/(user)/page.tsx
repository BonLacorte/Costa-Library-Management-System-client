import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookLock, Receipt, Bookmark, ArrowRight, Library } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  return (
    <div className="p-6 lg:p-12 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Welcome back, Library Member.</h1>
        <p className="text-on-surface-variant">Here is a summary of your academic journey.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-surface-container-low border-0 flex flex-col p-6 shadow-none hover:bg-surface-container transition-colors group">
          <BookLock className="size-8 text-primary mb-6" />
          <h3 className="text-3xl font-serif font-medium text-on-surface mb-1">3</h3>
          <p className="text-on-surface-variant text-sm font-medium">Active Loans</p>
          <div className="mt-6 flex items-center text-primary text-sm font-medium gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href="/loans" className="flex items-center gap-1">View Details <ArrowRight className="size-4" /></Link>
          </div>
        </Card>

        <Card className="bg-surface-container-low border-0 flex flex-col p-6 shadow-none hover:bg-surface-container transition-colors group">
          <Receipt className="size-8 text-error mb-6" />
          <h3 className="text-3xl font-serif font-medium text-error mb-1">$2.50</h3>
          <p className="text-on-surface-variant text-sm font-medium">Outstanding Fines</p>
          <div className="mt-6 flex items-center text-error text-sm font-medium gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href="/fines" className="flex items-center gap-1">Pay Now <ArrowRight className="size-4" /></Link>
          </div>
        </Card>

        <Card className="bg-surface-container-low border-0 flex flex-col p-6 shadow-none hover:bg-surface-container transition-colors group">
          <Bookmark className="size-8 text-secondary mb-6" />
          <h3 className="text-3xl font-serif font-medium text-on-surface mb-1">1</h3>
          <p className="text-on-surface-variant text-sm font-medium">Ready for Pickup</p>
          <div className="mt-6 flex items-center text-secondary text-sm font-medium gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href="/reservations" className="flex items-center gap-1">View Details <ArrowRight className="size-4" /></Link>
          </div>
        </Card>
      </div>

      <section className="bg-surface-container-low rounded-3xl p-8 lg:p-12 shadow-none min-h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-medium text-on-surface">Continue Reading</h2>
          <Link href="/books" className="text-primary text-sm font-medium border-b border-primary pb-0.5 hover:text-primary-container transition-colors flex items-center gap-2">
             Explore Catalog <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Example recently returned / or reading now card */}
          <Card className="bg-surface-container-lowest border-0 flex flex-col md:flex-row shadow-none overflow-hidden group">
            <div className="w-full md:w-48 h-64 md:h-auto bg-surface-dim relative">
               <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" alt="The Architecture of Happiness" className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-8 flex flex-col justify-center flex-1">
               <span className="mono-data text-xs mb-3 text-outline uppercase tracking-wider">Due in 5 days</span>
               <h3 className="font-serif text-2xl font-medium text-on-surface mb-2">The Architecture of Happiness</h3>
               <p className="text-on-surface-variant text-sm mb-8">Alain de Botton</p>
               <Button className="w-max px-8 shadow-none shadow-ambient rounded-full gap-2">
                 <BookLock className="size-4" /> Renew Loan
               </Button>
            </div>
          </Card>
        </div>
      </section>

    </div>
  );
}
