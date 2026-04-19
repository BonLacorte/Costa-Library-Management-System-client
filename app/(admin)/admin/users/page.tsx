"use client";

import { useState, useEffect } from "react";
import { Loader2, Users, Mail, Shield, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  userName?: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export default function AdminUsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("Authentication required.");
        }

        const response = await fetch("http://localhost:8080/api/users/admin/list", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        // Handle both paginated and flat array responses
        const usersArray = Array.isArray(data) ? data : (data.content || []);
        setUsers(usersArray);
      } catch (err: any) {
        setError(err.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const name = (user.fullName || user.userName || `${user.firstName || ''} ${user.lastName || ''}`).toLowerCase();
    return name.includes(term) || user.email.toLowerCase().includes(term) || user.id.toString().includes(term);
  });

  return (
    <div className="p-6 lg:p-10 pb-20 w-full animate-in fade-in duration-500">
      
      {/* Header section */}
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-on-surface mb-1 flex items-center gap-3">
          <Users className="size-7 text-primary" />
          Registered Users
        </h1>
        <p className="text-sm text-on-surface-variant">
          Manage and view all registered users in the library system.
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-low rounded-2xl p-6 border-0 shadow-none flex items-center gap-4">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Total Users</p>
            <p className="text-3xl font-bold text-on-surface leading-none">{users.length}</p>
          </div>
        </div>
        
        <div className="bg-surface-container-low rounded-2xl p-6 border-0 shadow-none flex items-center gap-4">
          <div className="size-12 rounded-full bg-[#f3e8ff] flex items-center justify-center shrink-0">
            <Shield className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Roles</p>
            <p className="text-sm font-bold text-on-surface leading-none">Standard & Admins</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error-container text-error text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-surface-container-low rounded-2xl shadow-none border-0 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-outline-variant/15 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50">
          <div className="relative w-full sm:max-w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
            <Input 
              placeholder="Search by name, email, or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-surface-container-lowest border-outline-variant/30 focus-visible:ring-primary shadow-none w-full text-sm"
            />
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center">
              <Loader2 className="size-8 animate-spin text-primary opacity-60 mb-4" />
              <p className="text-sm font-medium text-on-surface-variant">Loading user directory...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <Users className="size-10 text-outline-variant opacity-50 mb-3" />
              <h3 className="text-base font-bold text-on-surface mb-1">No users found</h3>
              <p className="text-sm text-on-surface-variant">No users match your current search criteria.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-container-lowest/50 text-xs uppercase tracking-wider font-semibold text-on-surface-variant border-b border-outline-variant/15">
                <tr>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredUsers.map((user) => {
                  const displayName = user.fullName || user.userName || (user.firstName ? `${user.firstName} ${user.lastName || ''}` : '') || "Unnamed User";
                  
                  return (
                    <tr key={user.id} className="hover:bg-surface-container-lowest/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-on-surface">
                        #{user.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-on-surface">{displayName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <Mail className="size-3.5 opacity-70" />
                          {user.email || "No email"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          user.role === 'ADMIN' || user.role === 'ROLE_ADMIN' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          {user.role ? user.role.replace('ROLE_', '') : 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        {user.createdAt ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="size-3.5 opacity-70" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
