import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function AdminGenres() {
  const genres = [
    { id: "G-01", name: "Architecture", count: 412, status: "Active" },
    { id: "G-02", name: "Typography", count: 184, status: "Active" },
    { id: "G-03", name: "Industrial Design", count: 89, status: "Active" },
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Genres</h1>
          <p className="text-on-surface-variant">Classify and organize the library collection.</p>
        </div>
        <Button className="rounded-full shadow-[var(--shadow-ambient)] px-6 gap-2">
           <Plus className="size-4" /> Add Genre
        </Button>
      </header>

      <div className="bg-surface-container-low rounded-3xl p-8 shadow-none border-0 mb-8">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-outline-variant/30 hover:bg-transparent">
              <TableHead className="text-on-surface-variant font-medium">Genre ID</TableHead>
              <TableHead className="text-on-surface-variant font-medium">Name</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-center">Total Books</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Status</TableHead>
              <TableHead className="text-on-surface-variant font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {genres.map((g) => (
              <TableRow key={g.id} className="border-b border-outline-variant/10 hover:bg-surface-container-highest/50 transition-colors">
                <TableCell className="font-medium mono-data text-xs text-outline">{g.id}</TableCell>
                <TableCell className="font-serif text-base text-on-surface">{g.name}</TableCell>
                <TableCell className="text-center font-medium text-on-surface">{g.count}</TableCell>
                <TableCell className="text-right">
                  <Badge className="rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none bg-primary-container text-on-primary-container hover:bg-primary-container">
                    {g.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" className="text-primary hover:bg-primary-container text-xs rounded-full">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
