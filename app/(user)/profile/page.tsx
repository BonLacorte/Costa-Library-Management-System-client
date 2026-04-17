import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export default function Profile() {
  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[800px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Your Profile</h1>
        <p className="text-on-surface-variant">Update your public identity and library credentials.</p>
      </header>

      <div className="bg-surface-container-low rounded-3xl p-8 lg:p-12 shadow-none border-0">
        <div className="flex items-center gap-8 mb-12">
           <div className="size-24 rounded-full bg-surface-container-highest flex items-center justify-center">
             <UserCircle className="size-12 text-outline" />
           </div>
           <div>
             <Button variant="secondary" className="rounded-full shadow-none mb-2">Upload new photo</Button>
             <p className="text-xs text-outline">JPEG, PNG or GIF. Max size of 800K.</p>
           </div>
        </div>

        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">First Name</label>
              <Input defaultValue="Elias" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none" />
            </div>
            <div className="space-y-3">
               <label className="text-sm font-medium text-on-surface-variant pl-1">Last Name</label>
               <Input defaultValue="Cornell" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-on-surface-variant pl-1">Email Address</label>
            <Input type="email" defaultValue="elias.cornell@example.com" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none" />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-on-surface-variant pl-1">Library Card Identifier</label>
            <Input defaultValue="CST-8891-002" disabled className="bg-transparent text-outline-variant font-mono text-sm border-dashed" />
            <p className="text-xs text-outline mt-2 pl-1">Card IDs cannot be changed through the platform. Please contact the main desk if lost.</p>
          </div>

          <div className="pt-8 border-t border-outline-variant/20 flex gap-4">
            <Button className="rounded-full px-8 shadow-none">Save Changes</Button>
            <Button variant="outline" className="rounded-full px-8 shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
