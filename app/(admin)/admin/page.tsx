import { Card } from "@/components/ui/card";
import { Library, ArrowLeftRight, CheckCircle2 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">System Overview</h1>
        <p className="text-on-surface-variant">Real-time metrics for Costa Library.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-surface-container-low border-0 flex flex-col p-6 shadow-none">
          <Library className="size-8 text-secondary mb-6" />
          <h3 className="text-3xl font-serif font-medium text-on-surface mb-1">15,234</h3>
          <p className="text-on-surface-variant text-sm font-medium">Total Volumes</p>
        </Card>

        <Card className="bg-surface-container-low border-0 flex flex-col p-6 shadow-none">
          <ArrowLeftRight className="size-8 text-primary mb-6" />
          <h3 className="text-3xl font-serif font-medium text-primary mb-1">1,402</h3>
          <p className="text-on-surface-variant text-sm font-medium">Active Checkouts</p>
        </Card>

        <Card className="bg-surface-container-low border-0 flex flex-col p-6 shadow-none">
          <CheckCircle2 className="size-8 text-error mb-6" />
          <h3 className="text-3xl font-serif font-medium text-error mb-1">142</h3>
          <p className="text-on-surface-variant text-sm font-medium">Flags & Overdue</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <section className="bg-surface-container-low rounded-3xl p-8 lg:p-10 shadow-none min-h-[400px]">
           <h2 className="font-serif text-2xl font-medium text-on-surface mb-6">Recent Activity</h2>
           <div className="space-y-4">
              {[
                { type: "Checkout", title: "The Architecture of Happiness", user: "CST-8891-002", time: "10 mins ago" },
                { type: "Return", title: "Design as Art", user: "CST-3321-998", time: "25 mins ago" },
                { type: "Reserve", title: "Thinking with Type", user: "CST-1002-443", time: "1 hr ago" }
              ].map((activity, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-xl hover:bg-surface-container-highest/30 transition-colors">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-primary">{activity.type}</span>
                    <p className="font-medium text-on-surface mt-1">{activity.title}</p>
                    <p className="text-xs text-on-surface-variant shadow-[var(--shadow-ambient)]">{activity.user}</p>
                  </div>
                  <span className="text-xs text-outline font-medium">{activity.time}</span>
                </div>
              ))}
           </div>
         </section>
      </div>
    </div>
  );
}
