import { BookMarked } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full flex flex-col justify-center items-center p-6 bg-surface-container-lowest relative min-h-screen">
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div className="size-8 rounded-full bg-primary flex items-center justify-center shadow-[var(--shadow-ambient)]">
          <BookMarked className="text-on-primary size-4" />
        </div>
        <span className="font-serif text-xl font-medium tracking-tight text-primary-container leading-none">Costa</span>
      </div>
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-500">
        {children}
      </div>
    </div>
  );
}
