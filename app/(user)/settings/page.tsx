import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[800px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Account Settings</h1>
        <p className="text-on-surface-variant">Manage notifications, privacy, and system preferences.</p>
      </header>

      <div className="space-y-8">
        <section className="bg-surface-container-low rounded-3xl p-8 lg:p-10 shadow-none border-0">
          <h2 className="font-serif text-2xl font-medium text-on-surface mb-6">Notifications</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-6">
               <div>
                 <h3 className="font-medium text-on-surface mb-1">Due Date Reminders</h3>
                 <p className="text-sm text-on-surface-variant">Receive an email 2 days before a loan expires.</p>
               </div>
               <div className="w-12 h-6 rounded-full bg-primary flex items-center p-1 justify-end cursor-pointer transition-colors shadow-[var(--shadow-ambient)]">
                  <div className="size-4 bg-on-primary rounded-full"></div>
               </div>
            </div>

            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-6">
               <div>
                 <h3 className="font-medium text-on-surface mb-1">Reservation Available</h3>
                 <p className="text-sm text-on-surface-variant">Get notified instantly when your hold is ready.</p>
               </div>
               <div className="w-12 h-6 rounded-full bg-primary flex items-center p-1 justify-end cursor-pointer transition-colors shadow-[var(--shadow-ambient)]">
                  <div className="size-4 bg-on-primary rounded-full"></div>
               </div>
            </div>

            <div className="flex items-center justify-between">
               <div>
                 <h3 className="font-medium text-on-surface mb-1">Newsletter & Curation</h3>
                 <p className="text-sm text-on-surface-variant">Weekly architectural and design reading recommendations.</p>
               </div>
               <div className="w-12 h-6 rounded-full bg-surface-container-highest flex items-center p-1 justify-start cursor-pointer transition-colors">
                  <div className="size-4 bg-on-surface-variant rounded-full"></div>
               </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low rounded-3xl p-8 lg:p-10 shadow-none border-0 mt-8">
          <h2 className="font-serif text-2xl font-medium text-on-surface mb-2 text-error">Danger Zone</h2>
          <p className="text-sm text-on-surface-variant mb-6">Irreversible actions regarding your data.</p>
          
          <div className="pt-6 border-t border-error-container/50">
             <Button variant="outline" className="rounded-full px-6 shadow-none border-error/30 text-error hover:bg-error-container hover:border-error-container transition-colors">
               Delete Account & Data
             </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
