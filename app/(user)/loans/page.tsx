import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookMarked, BookLock } from "lucide-react";

export default function MyLoans() {
  const loans = [
    { id: 1, title: "The Architecture of Happiness", author: "Alain de Botton", borrowed: "Oct 12, 2023", due: "Oct 26, 2023", progress: 60, status: "Due soon", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Design as Art", author: "Bruno Munari", borrowed: "Oct 15, 2023", due: "Nov 5, 2023", progress: 20, status: "Active", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Interaction of Color", author: "Josef Albers", borrowed: "Sep 20, 2023", due: "Oct 4, 2023", progress: 100, status: "Overdue", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[1200px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">My Loans</h1>
        <p className="text-on-surface-variant">Manage your currently borrowed materials.</p>
      </header>

      <div className="space-y-6">
        {loans.map(loan => (
          <Card key={loan.id} className="bg-surface-container-low border-0 shadow-none hover:bg-surface-container transition-colors flex flex-col md:flex-row overflow-hidden group">
            <div className="w-full md:w-48 h-64 md:h-auto bg-surface-dim relative">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={loan.cover} alt={loan.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-8 flex flex-col flex-1">
               <div className="flex justify-between items-start mb-2">
                 <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-medium border-0 shadow-none ${
                    loan.status === 'Due soon' ? 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container' : 
                    loan.status === 'Overdue' ? 'bg-error-container text-error hover:bg-error-container' : 
                    'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-high'
                 }`}>
                   {loan.status}
                 </Badge>
               </div>
               <h3 className="font-serif text-2xl font-medium text-on-surface mb-1">{loan.title}</h3>
               <p className="text-on-surface-variant text-sm mb-6">{loan.author}</p>
               
               <div className="mt-auto">
                 <div className="flex justify-between text-xs font-medium text-on-surface-variant mb-2">
                   <span>Borrowed: {loan.borrowed}</span>
                   <span className={loan.status === 'Overdue' ? 'text-error' : ''}>Due: {loan.due}</span>
                 </div>
                 <Progress value={loan.progress} className={`h-2 shadow-none border-0 bg-surface-container-highest ${loan.status === 'Overdue' ? '[&>div]:bg-error' : '[&>div]:bg-primary'}`} />
               </div>

               <div className="flex gap-4 mt-8 pt-6 border-t border-outline-variant/20">
                 <Button variant="default" className="shadow-none rounded-full px-6 gap-2">
                   Renew Loan
                 </Button>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
