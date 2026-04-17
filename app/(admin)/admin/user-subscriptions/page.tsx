import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminUserSubscriptions() {
  const subs = [
    { id: "SUB-8122", user: "CST-8891-002", plan: "Costa Scholar", since: "Nov 15, 2022", renewal: "Nov 15, 2023", status: "Active" },
    { id: "SUB-8123", user: "CST-1002-443", plan: "Archive Access", since: "Jan 10, 2023", renewal: "-", status: "Cancelled" },
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Subscriber Ledger</h1>
        <p className="text-on-surface-variant">Monitor active premium memberships and billing lifecycles.</p>
      </header>

      <div className="bg-surface-container-low rounded-3xl p-8 shadow-none border-0 mb-8">
        <div className="relative w-full max-w-sm mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-outline" />
          <Input placeholder="Search Sub ID or Card ID..." className="pl-12 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none" />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-outline-variant/30 hover:bg-transparent">
              <TableHead className="text-on-surface-variant font-medium">Sub ID</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Library Card</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Plan Tier</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Member Since</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Next Renewal</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Status</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subs.map((s) => (
              <TableRow key={s.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors">
                <TableCell className="font-medium mono-data text-xs text-outline">{s.id}</TableCell>
                <TableCell className="font-medium text-on-surface">{s.user}</TableCell>
                <TableCell className="font-serif text-base text-on-surface">{s.plan}</TableCell>
                <TableCell className="text-center text-sm text-on-surface-variant">{s.since}</TableCell>
                <TableCell className="text-center font-medium text-on-surface">{s.renewal}</TableCell>
                <TableCell className="text-right">
                  <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none ${
                    s.status === 'Active' ? 'bg-primary-container text-on-primary-container hover:bg-primary-container' : 
                    'bg-error-container text-error hover:bg-error-container'
                  }`}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                   <Button variant="ghost" className="text-primary hover:bg-primary-container text-xs rounded-full">Revoke</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
