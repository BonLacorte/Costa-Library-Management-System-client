import { Sidebar } from "@/components/sidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="flex-1 lg:ml-64 w-full h-full">
         {children}
      </div>
    </>
  );
}
