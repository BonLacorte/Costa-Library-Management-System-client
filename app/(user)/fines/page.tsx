import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Receipt } from "lucide-react";

export default function MyFines() {
  const fines = [
    { id: "F-1029", book: "Interaction of Color", reason: "Late Return (3 days)", amount: 1.50, date: "Oct 5, 2023", status: "Unpaid" },
    { id: "F-0982", book: "The Visual Display of Quantitative Information", reason: "Minor Cover Damage", amount: 12.00, date: "Sep 28, 2023", status: "Unpaid" },
    { id: "F-0844", book: "Grid Systems", reason: "Late Return (1 day)", amount: 0.50, date: "Aug 12, 2023", status: "Paid" },
  ];

  const totalUnpaid = fines.filter(f => f.status === "Unpaid").reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1200px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">My Fines</h1>
        <p className="text-on-surface-variant">Review and resolve any outstanding balances on your account.</p>
      </header>

      <div className="bg-surface-container-low rounded-3xl p-8 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-none">
         <div>
           <span className="text-on-surface-variant text-sm font-medium uppercase tracking-wider block mb-1">Total Outstanding</span>
           <h2 className="font-serif text-5xl font-medium text-error">${totalUnpaid.toFixed(2)}</h2>
         </div>
         {totalUnpaid > 0 && (
           <Button className="rounded-full px-8 py-6 text-lg shadow-[var(--shadow-ambient)] gap-2">
             <Receipt className="size-5" /> Pay Full Balance
           </Button>
         )}
      </div>

      <div className="bg-surface-container-low rounded-3xl p-8 shadow-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-outline-variant/30 hover:bg-transparent">
              <TableHead className="text-on-surface-variant font-medium">Fine ID</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Item</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Reason</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Date</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Amount</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fines.map((fine) => (
              <TableRow key={fine.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors">
                <TableCell className="font-medium mono-data text-xs text-outline">{fine.id}</TableCell>
                <TableCell className="font-serif text-base text-on-surface">{fine.book}</TableCell>
                <TableCell className="text-on-surface-variant">{fine.reason}</TableCell>
                <TableCell className="text-on-surface-variant">{fine.date}</TableCell>
                <TableCell className="text-right font-medium text-on-surface">${fine.amount.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none ${
                    fine.status === 'Unpaid' ? 'bg-error-container text-error hover:bg-error-container' : 
                    'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-high'
                  }`}>
                    {fine.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
