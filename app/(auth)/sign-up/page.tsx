"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Info, AlertCircle } from "lucide-react";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong during sign up.");
      }

      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        router.push("/sign-in");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-surface-container-low p-8 sm:p-12 rounded-[2rem] shadow-none flex flex-col">
      <h1 className="font-serif text-3xl font-medium text-on-surface mb-2 tracking-tight">Request Access</h1>
      <p className="text-on-surface-variant text-sm mb-8">Begin your registration for a Costa Library Card.</p>

      {error ? (
        <div className="flex gap-3 mb-8 p-4 rounded-xl bg-error-container/50">
           <AlertCircle className="size-5 text-error shrink-0 mt-0.5" />
           <p className="text-sm text-error leading-relaxed">{error}</p>
        </div>
      ) : (
        <div className="flex gap-3 mb-8 p-4 rounded-xl bg-secondary-container/50">
           <Info className="size-5 text-on-secondary-container shrink-0 mt-0.5" />
           <p className="text-xs text-on-secondary-container leading-relaxed">
             Physical verification is required. After completing this form, please bring a valid photo ID to the main desk.
           </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="space-y-3">
          <label className="text-sm font-medium text-on-surface-variant pl-1">Full Name</label>
          <Input name="fullName" value={formData.fullName} onChange={handleChange} required className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-on-surface-variant pl-1">Username</label>
            <Input name="username" value={formData.username} onChange={handleChange} required className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-on-surface-variant pl-1">Phone Number</label>
            <Input name="phone" value={formData.phone} onChange={handleChange} required className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-on-surface-variant pl-1">Email Address</label>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} required className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-on-surface-variant pl-1">Create PIN / Password</label>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="4 to 8 digits" className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl" />
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-full py-6 mt-4 shadow-[var(--shadow-ambient)] bg-secondary text-on-secondary hover:bg-secondary/90 disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        Already have a card?{" "}
        <Link href="/sign-in" className="text-primary font-medium hover:underline underline-offset-4">Sign In</Link>
      </p>
    </div>
  );
}
