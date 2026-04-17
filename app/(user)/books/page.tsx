import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookMarked } from "lucide-react";

export default function LibraryCatalog() {
  const books = [
    { id: 1, title: "The Architecture of Happiness", author: "Alain de Botton", year: "2006", isbn: "978-0375424460", status: "Available", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Design as Art", author: "Bruno Munari", year: "1971", isbn: "978-0141035819", status: "Checked Out", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Interaction of Color", author: "Josef Albers", year: "1963", isbn: "978-0300179354", status: "Available", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" },
    { id: 4, title: "Thinking with Type", author: "Ellen Lupton", year: "2004", isbn: "978-1568989693", status: "Reserved", cover: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=800&auto=format&fit=crop" },
    { id: 5, title: "Grid Systems", author: "Josef Müller-Brockmann", year: "1981", isbn: "978-3721201451", status: "Available", cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop" },
    { id: 6, title: "The Visual Display of Quantitative Information", author: "Edward Tufte", year: "1983", isbn: "978-0961392147", status: "Available", cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop" }
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 w-full animate-in fade-in duration-500">
      <header className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center">
            <BookMarked className="text-on-primary size-4" />
          </div>
          <span className="font-serif text-xl font-medium text-primary-container">Costa</span>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_3fr] gap-8 xl:gap-12 w-full">
        <aside className="space-y-8">
          <div>
            <h1 className="font-serif text-4xl xl:text-5xl font-medium leading-tight text-on-surface tracking-tight mb-4">
              Explore<br />
              <span className="text-primary">The Curated</span><br />
              Collection.
            </h1>
            <p className="text-on-surface-variant text-sm xl:text-base leading-relaxed mt-4 max-w-sm">
              Discover profound literature across design, architecture, and the human condition.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 shadow-none max-w-sm">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-xs font-semibold tracking-wider uppercase text-outline w-full mb-2">Filters</span>
              <Badge variant="secondary" className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container rounded-full px-4 py-1.5 text-[0.8rem] border-0 shadow-none">All Books</Badge>
              <Badge variant="outline" className="border-outline-variant/30 text-on-surface hover:bg-surface-container-highest rounded-full px-4 py-1.5 text-[0.8rem] bg-transparent border">Architecture</Badge>
              <Badge variant="outline" className="border-outline-variant/30 text-on-surface hover:bg-surface-container-highest rounded-full px-4 py-1.5 text-[0.8rem] bg-transparent border">Typography</Badge>
            </div>
          </div>
        </aside>

        <section className="bg-surface-container-low rounded-3xl p-8 lg:p-12 min-h-[800px]">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full max-w-2xl">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-outline" />
              <Input 
                placeholder="Search by title, author, or ISBN..." 
                className="pl-12 w-full text-lg placeholder:text-outline-variant bg-transparent sm:bg-surface-container-lowest shadow-none focus-visible:border-b-primary focus-visible:bg-surface-container-lowest"
              />
            </div>
            <Button variant="secondary" className="rounded-full gap-2 shrink-0 h-10 px-6 bg-surface-container-highest">
              <Filter className="size-4" />
              Filters
            </Button>
          </div>

          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-medium text-on-surface-variant">Showing {books.length} curated works</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-outline">Sort by:</span>
              <button className="font-medium text-primary border-b border-primary pb-0.5 hover:text-primary-container transition-colors">Recently Added</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {books.map((book) => (
              <Card key={book.id} className="group relative bg-surface-container-lowest border-0">
                <div className="h-64 overflow-hidden bg-surface-dim relative rounded-t-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100" />
                  <div className="absolute top-4 right-4">
                    <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none ${
                        book.status === 'Available' ? 'bg-primary-container text-on-primary-container hover:bg-primary-container' : 
                        book.status === 'Reserved' ? 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container' : 
                        'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-high'
                    }`}>
                      {book.status}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="pt-6 pb-2 px-6">
                  <span className="mono-data text-xs mb-3 block opacity-70">ISBN {book.isbn} · {book.year}</span>
                  <h3 className="font-serif text-xl font-medium leading-snug mb-1 text-on-surface line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-outline group-hover:text-primary transition-colors">{book.author}</p>
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-4 border-0 bg-transparent flex justify-between items-center mt-auto">
                  <Button variant="default" className="w-[calc(100%-2rem)] mx-auto opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute bottom-6 left-4 shadow-none">
                    Reserve Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
