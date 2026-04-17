import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminLoans() {
  const loans = [
    { id: "L-99821", user: "CST-8891-002", title: "Thinking with Type", dateOut: "Oct 18, 2023", dateDue: "Nov 01, 2023", status: "Active" },
    { id: "L-99822", user: "CST-1002-443", title: "Design as Art", dateOut: "Sep 15, 2023", dateDue: "Sep 29, 2023", status: "Overdue" },
    { id: "L-99823", user: "CST-3321-998", title: "The Visual Display...", dateOut: "Oct 20, 2023", dateDue: "Nov 03, 2023", status: "Active" }
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Checkout Ledger</h1>
        <p className="text-on-surface-variant">Monitor active circulation and enforce physical volume returns.</p>
      </header>

      <div className="bg-surface-container-low rounded-3xl p-8 shadow-none border-0 mb-8">
        <div className="relative w-full max-w-sm mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-outline" />
          <Input placeholder="Search Loan ID or User ID..." className="pl-12 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none" />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-outline-variant/30 hover:bg-transparent">
              <TableHead className="text-on-surface-variant font-medium">Loan ID</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Library Card</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Title</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Date Out</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Due Date</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Status</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors">
                <TableCell className="font-medium mono-data text-xs text-outline">{loan.id}</TableCell>
                <TableCell className="font-medium text-on-surface">{loan.user}</TableCell>
                <TableCell className="font-serif text-base text-on-surface">{loan.title}</TableCell>
                <TableCell className="text-center text-on-surface-variant">{loan.dateOut}</TableCell>
                <TableCell className={`text-center font-medium ${loan.status === 'Overdue' ? 'text-error' : 'text-on-surface'}`}>{loan.dateDue}</TableCell>
                <TableCell className="text-right">
                  <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none ${
                    loan.status === 'Active' ? 'bg-primary-container text-on-primary-container hover:bg-primary-container' : 
                    'bg-error-container text-error hover:bg-error-container'
                  }`}>
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" className="text-primary hover:bg-primary-container text-xs rounded-full">Extend</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
