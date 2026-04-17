import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function AdminSubscriptionPlans() {
  const plans = [
    { id: "SP-01", name: "Standard Reader", price: 0.00, billing: "Free", perks: 3, status: "Active" },
    { id: "SP-02", name: "Costa Scholar", price: 12.00, billing: "Monthly", perks: 8, status: "Active" },
    { id: "SP-03", name: "Archive Access", price: 25.00, billing: "Monthly", perks: 15, status: "Deprecated" },
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Subscription Plans</h1>
          <p className="text-on-surface-variant">Configure access tiers and premium digital privileges.</p>
        </div>
        <Button className="rounded-full shadow-none px-6 gap-2">
           <Plus className="size-4" /> Create Plan
        </Button>
      </header>

      <div className="bg-surface-container-low rounded-3xl p-8 shadow-none border-0 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[image:var(--background-image-signature)]"></div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-outline-variant/30 hover:bg-transparent">
              <TableHead className="text-on-surface-variant font-medium">Plan ID</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Tier Name</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Price</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Billing</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Status</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((p) => (
              <TableRow key={p.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors">
                <TableCell className="font-medium mono-data text-xs text-outline">{p.id}</TableCell>
                <TableCell className="font-serif text-base text-on-surface">{p.name}</TableCell>
                <TableCell className="text-center font-medium text-on-surface">${p.price.toFixed(2)}</TableCell>
                <TableCell className="text-center text-sm text-on-surface-variant">{p.billing}</TableCell>
                <TableCell className="text-right">
                  <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none ${
                    p.status === 'Active' ? 'bg-primary-container text-on-primary-container hover:bg-primary-container' : 
                    'bg-surface-container-high text-outline hover:bg-surface-container-high'
                  }`}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" className="text-primary hover:bg-primary-container text-xs rounded-full">Configure</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
