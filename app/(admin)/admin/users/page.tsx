import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminUsers() {
  const users = [
    { id: "CST-8891-002", name: "Elias Cornell", email: "elias@example.com", joined: "Jan 12, 2022", status: "Active" },
    { id: "CST-1002-443", name: "Sarah Lin", email: "sarah.lin@example.com", joined: "Mar 05, 2023", status: "Active" },
    { id: "CST-3321-998", name: "Marcus Chen", email: "m.chen@example.com", joined: "Oct 18, 2023", status: "Suspended" },
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Member Directory</h1>
          <p className="text-on-surface-variant">Manage library card holders and access privileges.</p>
        </div>
        <Button className="rounded-full shadow-none px-6 gap-2">
           <UserPlus className="size-4" /> Add User
        </Button>
      </header>

      <div className="bg-surface-container-low rounded-3xl p-8 shadow-none border-0 mb-8">
        <div className="relative w-full max-w-sm mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-outline" />
          <Input placeholder="Search Name, Email or ID..." className="pl-12 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none" />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-outline-variant/30 hover:bg-transparent">
              <TableHead className="text-on-surface-variant font-medium">Card ID</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Name</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Email</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Joined Date</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Status</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors">
                <TableCell className="font-medium mono-data text-xs text-outline">{u.id}</TableCell>
                <TableCell className="font-serif text-base text-on-surface">{u.name}</TableCell>
                <TableCell className="text-sm text-on-surface-variant">{u.email}</TableCell>
                <TableCell className="text-center text-sm text-on-surface-variant">{u.joined}</TableCell>
                <TableCell className="text-right">
                  <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none ${
                    u.status === 'Active' ? 'bg-primary-container text-on-primary-container hover:bg-primary-container' : 
                    'bg-error-container text-error hover:bg-error-container'
                  }`}>
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" className="text-primary hover:bg-primary-container text-xs rounded-full">Manage</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
