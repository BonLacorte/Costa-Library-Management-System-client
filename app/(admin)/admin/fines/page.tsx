import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminFines() {
  const fines = [
    { id: "F-1029", user: "CST-8891-002", reason: "Late Return (3 days)", amount: 1.50, date: "Oct 5, 2023", status: "Unpaid" },
    { id: "F-0982", user: "CST-1002-443", reason: "Minor Cover Damage", amount: 12.00, date: "Sep 28, 2023", status: "Unpaid" },
    { id: "F-0844", user: "CST-1250-111", reason: "Late Return (1 day)", amount: 0.50, date: "Aug 12, 2023", status: "Paid" },
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Fines Ledger</h1>
        <p className="text-on-surface-variant">Manage global outstanding user balances and issue waivers.</p>
      </header>

      <div className="bg-surface-container-low rounded-3xl p-8 shadow-none border-0 mb-8">
        <div className="relative w-full max-w-sm mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-outline" />
          <Input placeholder="Search Fine ID or User ID..." className="pl-12 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none" />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-outline-variant/30 hover:bg-transparent">
              <TableHead className="text-on-surface-variant font-medium">Fine ID</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Library Card</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Reason</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Date</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Amount</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Status</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fines.map((fine) => (
              <TableRow key={fine.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors">
                <TableCell className="font-medium mono-data text-xs text-outline">{fine.id}</TableCell>
                <TableCell className="font-medium text-on-surface">{fine.user}</TableCell>
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
                <TableCell className="text-right">
                  {fine.status === 'Unpaid' ? (
                     <Button variant="ghost" className="text-error hover:bg-error-container text-xs rounded-full">Waive</Button>
                  ) : (
                     <span className="text-xs text-outline pr-4">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
