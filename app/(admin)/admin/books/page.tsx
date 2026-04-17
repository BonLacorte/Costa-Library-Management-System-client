import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminBooks() {
  const inventory = [
    { isbn: "978-0375424", title: "The Architecture of Happiness", author: "Alain de Botton", total: 5, available: 2 },
    { isbn: "978-0141035", title: "Design as Art", author: "Bruno Munari", total: 3, available: 0 },
    { isbn: "978-0300179", title: "Interaction of Color", author: "Josef Albers", total: 10, available: 10 },
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Book Inventory</h1>
          <p className="text-on-surface-variant">Manage total physical and digital circulation stock.</p>
        </div>
        <Button className="rounded-full shadow-[var(--shadow-ambient)] px-6 gap-2">
           <Plus className="size-4" /> Add Volume
        </Button>
      </header>

      <div className="bg-surface-container-low rounded-3xl p-8 shadow-none border-0 mb-8">
        <div className="relative w-full max-w-sm mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-outline" />
          <Input placeholder="Search ISBN, title, or author..." className="pl-12 bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none" />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-outline-variant/30 hover:bg-transparent">
              <TableHead className="text-on-surface-variant font-medium">ISBN</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Title</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Total</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Available</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.isbn} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors">
                <TableCell className="font-medium mono-data text-xs text-outline">{item.isbn}</TableCell>
                <TableCell>
                  <p className="font-serif text-base text-on-surface">{item.title}</p>
                  <p className="text-xs text-on-surface-variant">{item.author}</p>
                </TableCell>
                <TableCell className="text-center font-medium text-on-surface">{item.total}</TableCell>
                <TableCell className="text-center font-medium text-primary">{item.available}</TableCell>
                <TableCell className="text-right">
                  <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none ${
                    item.available > 0 ? 'bg-primary-container text-on-primary-container hover:bg-primary-container' : 
                    'bg-error-container text-error hover:bg-error-container'
                  }`}>
                    {item.available > 0 ? 'In Stock' : 'Out of Stock'}
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
