"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AdminSignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials.");
      }

      if (data.user?.role === "ROLE_ADMIN") {
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/admin");
      } else {
        localStorage.clear();
        throw new Error("Unauthorized. Admin access required.");
      }
    } catch (err: any) {
      setError(err.message || "Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low p-8 sm:p-12 rounded-[2rem] shadow-none flex flex-col">
      <h1 className="font-serif text-3xl font-medium text-on-surface mb-2 tracking-tight">Staff Portal</h1>
      <p className="text-on-surface-variant text-sm mb-8">Restricted access for Costa Administrators.</p>

      {error && (
        <div className="flex gap-3 mb-8 p-4 rounded-xl bg-error-container/50">
           <AlertCircle className="size-5 text-error shrink-0 mt-0.5" />
           <p className="text-sm text-error leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="space-y-3">
          <label className="text-sm font-medium text-on-surface-variant pl-1">Email Address</label>
          <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-on-surface-variant pl-1">Password</label>
          <Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required placeholder="••••••••" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl font-mono text-lg tracking-widest" />
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-full py-6 mt-4 shadow-[var(--shadow-ambient)] disabled:opacity-50">
          {loading ? "Authenticating..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        Not an administrator?{" "}
        <Link href="/sign-in" className="text-primary font-medium hover:underline underline-offset-4">User Sign In</Link>
      </p>
    </div>
  );
}
