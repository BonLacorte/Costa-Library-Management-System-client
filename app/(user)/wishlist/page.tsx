import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartOff } from "lucide-react";

export default function Wishlist() {
  const books = [
    { id: 1, title: "The Visual Display of Quantitative Information", author: "Edward Tufte", year: "1983", isbn: "978-0961392147", status: "Available", cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "A Pattern Language", author: "Christopher Alexander", year: "1977", isbn: "978-0195019193", status: "Checked Out", cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop" }
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1600px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Saved for Later</h1>
        <p className="text-on-surface-variant">Curate your future reading list.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {books.map((book) => (
          <Card key={book.id} className="group relative bg-surface-container-low border-0 shadow-none hover:bg-surface-container transition-colors">
            <div className="h-64 overflow-hidden bg-surface-dim relative rounded-t-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100" />
              <div className="absolute top-4 right-4">
                <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none ${
                    book.status === 'Available' ? 'bg-primary-container text-on-primary-container hover:bg-primary-container' : 
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
              <Button variant="secondary" size="icon" className="rounded-full shadow-none bg-surface-container shrink-0 text-on-surface-variant hover:text-error hover:bg-error-container transition-colors">
                <HeartOff className="size-4" />
              </Button>
              <Button variant="default" className="w-full ml-4 shadow-none rounded-full">
                {book.status === 'Available' ? 'Reserve Now' : 'Join Queue'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
