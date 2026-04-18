"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle, CheckCircle2, Pencil, X, ShieldCheck } from "lucide-react";

interface AdminProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: 0, fullName: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Authentication token not found. Please sign in again.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:8080/api/users/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Server returned ${response.status}.`);
        const data: AdminProfile = await response.json();
        setProfile(data);
        setFormData({ id: data.id, fullName: data.fullName, email: data.email, phone: data.phone || "" });
      } catch (err: any) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const updated: AdminProfile = await response.json();
        setProfile(updated);
        setFormData({ id: updated.id, fullName: updated.fullName, email: updated.email, phone: updated.phone || "" });
        setSuccess(true);
        setEditMode(false);
      } else {
        const errData = await response.json().catch(() => null);
        setError(errData?.message || `Update failed: ${response.status} ${response.statusText}`);
      }
    } catch (err: any) {
      setError(err.message || "Network error — could not reach the server.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({ id: profile.id, fullName: profile.fullName, email: profile.email, phone: profile.phone || "" });
    }
    setEditMode(false);
    setError("");
  };

  return (
    <div className="p-6 lg:p-12 pb-20 max-w-[800px] w-full animate-in fade-in duration-500">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="size-5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Admin Account</span>
        </div>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-on-surface mb-2">Your Profile</h1>
        <p className="text-on-surface-variant">Manage your administrator identity and contact details.</p>
      </header>

      {success && (
        <div className="flex gap-3 mb-8 p-4 rounded-xl bg-primary-container text-on-primary-container">
          <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">Profile updated successfully.</p>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-error-container text-error">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-surface-container-low rounded-3xl p-8 lg:p-12 shadow-none border-0">
        {/* Avatar + name header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0 ring-2 ring-primary/20">
              <UserCircle className="size-10 text-primary" />
            </div>
            <div>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-6 w-44 bg-surface-container-highest rounded-lg animate-pulse" />
                  <div className="h-4 w-32 bg-surface-container-highest rounded-lg animate-pulse" />
                </div>
              ) : (
                <>
                  <p className="font-serif text-2xl font-medium text-on-surface">{profile?.fullName || "—"}</p>
                  <p className="text-sm text-on-surface-variant mt-0.5">{profile?.email || ""}</p>
                </>
              )}
            </div>
          </div>

          {!loading && !editMode && (
            <Button
              variant="outline"
              onClick={() => setEditMode(true)}
              className="rounded-full gap-2 shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            >
              <Pencil className="size-3.5" /> Edit Profile
            </Button>
          )}
          {editMode && (
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="rounded-full gap-2 shadow-none text-on-surface-variant hover:bg-surface-container"
            >
              <X className="size-4" /> Cancel
            </Button>
          )}
        </div>

        {/* View or Edit mode */}
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Full Name</label>
              <Input
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Email Address</label>
              <Input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant pl-1">Phone Number</label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-surface-container-lowest focus-visible:bg-surface-container-lowest shadow-none py-6 rounded-2xl"
              />
            </div>
            <div className="pt-8 border-t border-outline-variant/20 flex gap-4">
              <Button type="submit" disabled={saving} className="rounded-full px-8 shadow-none shadow-[var(--shadow-ambient)]">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="rounded-full px-8 shadow-none bg-transparent border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-surface-container-highest rounded-2xl animate-pulse" />
              ))
            ) : (
              <>
                <div className="bg-surface-container-lowest rounded-2xl px-5 py-4">
                  <p className="text-xs text-on-surface-variant mb-1 font-medium uppercase tracking-wider">Full Name</p>
                  <p className="text-base text-on-surface font-serif">{profile?.fullName || "—"}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-2xl px-5 py-4">
                  <p className="text-xs text-on-surface-variant mb-1 font-medium uppercase tracking-wider">Email Address</p>
                  <p className="text-base text-on-surface">{profile?.email || "—"}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-2xl px-5 py-4">
                  <p className="text-xs text-on-surface-variant mb-1 font-medium uppercase tracking-wider">Phone Number</p>
                  <p className="text-base text-on-surface">{profile?.phone || "Not provided"}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
