import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MapPin } from "lucide-react";

export default function MyReservations() {
  const reservations = [
    { id: 1, title: "Thinking with Type", author: "Ellen Lupton", date: "Oct 18, 2023", status: "Ready for Pickup", queue: null, cover: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Design as Art", author: "Bruno Munari", date: "Oct 20, 2023", status: "In Queue", queue: 2, cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1200px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">My Reservations</h1>
        <p className="text-on-surface-variant">Track your requested items and their availability.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {reservations.map(res => (
          <Card key={res.id} className="bg-surface-container-low border-0 shadow-none flex flex-col md:flex-row overflow-hidden group">
            <div className="w-full md:w-32 h-48 md:h-auto bg-surface-dim relative">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={res.cover} alt={res.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-6 flex flex-col md:flex-row flex-1 justify-between gap-6">
               <div className="flex flex-col justify-center">
                 <Badge className={`w-max rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none mb-4 ${
                    res.status === 'Ready for Pickup' ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container' : 
                    'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-high'
                 }`}>
                   {res.status}
                 </Badge>
                 <h3 className="font-serif text-xl font-medium text-on-surface mb-1">{res.title}</h3>
                 <p className="text-on-surface-variant text-sm">{res.author}</p>
                 {res.queue && <p className="text-sm mt-3 text-outline">Queue Position: <span className="font-medium text-primary">#{res.queue}</span></p>}
               </div>

               <div className="flex flex-col justify-center items-start md:items-end border-t md:border-t-0 md:border-l border-outline-variant/20 pt-6 md:pt-0 md:pl-6 min-w-[240px]">
                 {res.status === 'Ready for Pickup' ? (
                   <div className="flex flex-col items-start md:items-end mb-4">
                     <span className="text-xs uppercase tracking-wider text-outline mb-1">Pickup Location</span>
                     <span className="flex items-center gap-1 font-medium text-on-surface"><MapPin className="size-4" /> Main Desk</span>
                     <span className="text-xs text-on-surface-variant mt-1">Hold expires {res.date}</span>
                   </div>
                 ) : (
                   <div className="flex flex-col items-start md:items-end mb-4">
                     <span className="text-xs uppercase tracking-wider text-outline mb-1">Requested On</span>
                     <span className="font-medium text-on-surface">{res.date}</span>
                   </div>
                 )}
                 <Button variant="outline" className="rounded-full shadow-none mt-auto">Cancel Reservation</Button>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
