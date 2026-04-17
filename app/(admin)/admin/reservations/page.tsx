import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminReservations() {
  const reserves = [
    { id: "R-552", user: "CST-8891-002", title: "Thinking with Type", date: "Oct 18, 2023", status: "Ready for Pickup", queue: "-" },
    { id: "R-553", user: "CST-1002-443", title: "Design as Art", date: "Oct 20, 2023", status: "In Queue", queue: "2" },
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Reservation Queue</h1>
        <p className="text-on-surface-variant">Process holds and manage waitlists for checked-out literature.</p>
      </header>

      <div className="bg-surface-container-low rounded-3xl p-8 shadow-none border-0 mb-8">
        <div className="relative w-full max-w-sm mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-outline" />
          <Input placeholder="Search Reserve ID or Title..." className="pl-12 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none" />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-outline-variant/30 hover:bg-transparent">
              <TableHead className="text-on-surface-variant font-medium">Reserve ID</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Library Card</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Title</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Requested</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Queue Pos</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Status</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reserves.map((r) => (
              <TableRow key={r.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors">
                <TableCell className="font-medium mono-data text-xs text-outline">{r.id}</TableCell>
                <TableCell className="font-medium text-on-surface">{r.user}</TableCell>
                <TableCell className="font-serif text-base text-on-surface">{r.title}</TableCell>
                <TableCell className="text-center text-on-surface-variant">{r.date}</TableCell>
                <TableCell className="text-center font-medium text-on-surface">{r.queue}</TableCell>
                <TableCell className="text-right">
                  <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none ${
                    r.status === 'Ready for Pickup' ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container' : 
                    'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-high'
                  }`}>
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                   <Button variant="ghost" className="text-primary hover:bg-primary-container text-xs rounded-full">Fulfil</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
