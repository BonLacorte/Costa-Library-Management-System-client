import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 w-full h-full">
         {children}
      </div>
    </>
  );
}
