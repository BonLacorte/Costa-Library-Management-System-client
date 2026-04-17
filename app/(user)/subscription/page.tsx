import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, CheckCircle2 } from "lucide-react";

export default function Subscription() {
  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1200px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Subscription</h1>
        <p className="text-on-surface-variant">Manage your Costa Library premium access.</p>
      </header>

      <Card className="bg-surface-container-low border-0 shadow-none overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-[image:var(--background-image-signature)]"></div>
        <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12 items-start justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-full bg-primary-container flex items-center justify-center shadow-[var(--shadow-ambient)]">
                <Crown className="size-5 text-on-primary-container" />
              </div>
              <Badge className="bg-primary-container text-on-primary-container hover:bg-primary-container border-0 shadow-none rounded-full px-4 py-1.5 text-xs tracking-wider uppercase">Active Plan</Badge>
            </div>
            
            <h2 className="font-serif text-3xl font-medium text-on-surface mb-4">Costa Scholar Tier</h2>
            <p className="text-on-surface-variant text-base leading-relaxed mb-8">
              You have full, unadulterated access to the digital archives, high-resolution architectural scans, and extended physical loan periods.
            </p>

            <ul className="space-y-4 mb-10">
              {["Extended 60-day loan periods", "Access to the Digital Architecture Vault", "Priority reservation queue placement", "No late fees on standard literature"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-on-surface">
                  <CheckCircle2 className="size-5 text-primary" /> {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-container-highest/20 rounded-2xl p-8 min-w-[300px]">
             <span className="text-outline text-sm uppercase tracking-wider font-semibold block mb-2">Next Billing Date</span>
             <p className="text-on-surface text-xl font-medium mb-8">November 15, 2023</p>
             
             <div className="flex items-baseline gap-1 mb-8">
               <span className="text-4xl font-serif font-medium text-on-surface">$12.00</span>
               <span className="text-on-surface-variant">/month</span>
             </div>

             <div className="space-y-3">
               <Button className="w-full rounded-full shadow-none bg-on-surface text-inverse-on-surface hover:bg-on-surface-variant">Manage Payment Method</Button>
               <Button variant="outline" className="w-full rounded-full shadow-none border-outline-variant/30 text-error hover:bg-error-container hover:text-error hover:border-error-container transition-colors">Cancel Subscription</Button>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
