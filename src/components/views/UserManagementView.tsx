"use client";

import { Search, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { seedUsers } from "@/lib/dummy/users";
import type { UserStatus } from "@/lib/types/enums";
import type { User } from "@/lib/types/user.types";
import { formatDate } from "@/lib/utils";

export function UserManagementView() {
  // Local state initialized directly from static seed array
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Filter users locally
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Action: "Change Status" toggle with local state and toast
  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        const nextStatus: UserStatus =
          user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        toast.success("User Account Updated", {
          description: `${user.name}'s status was changed to ${nextStatus}.`,
        });
        return {
          ...user,
          status: nextStatus,
        };
      }),
    );
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "ADMIN":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "DISPATCHER":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "DRIVER":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "HOSPITAL_STAFF":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Governance & Identity"
        description="Oversee role-based access control, security provisioning, and account lifecycle status."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/super-admin" },
          { label: "User Governance" },
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-xl shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Filter users by keyword"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={roleFilter}
            onValueChange={(val) => val && setRoleFilter(val)}
          >
            <SelectTrigger
              className="w-44 text-xs h-9"
              aria-label="Filter users by role"
            >
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles ({users.length})</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="ADMIN">System Admin</SelectItem>
              <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
              <SelectItem value="DRIVER">Paramedic Driver</SelectItem>
              <SelectItem value="HOSPITAL_STAFF">Hospital Staff</SelectItem>
              <SelectItem value="PATIENT">Patient</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Registered Accounts ({filteredUsers.length})
            </span>
            <span className="text-xs text-text-muted">
              Click &quot;Change Status&quot; to toggle ACTIVE &harr; SUSPENDED
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                User Details
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Email Address
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                RBAC Role
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Account Status
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Joined Date
              </TableHead>
              <TableHead
                scope="col"
                className="text-xs font-semibold text-right"
              >
                Governance Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-primary-light/20 transition-colors"
              >
                <TableCell className="py-3">
                  <div className="font-semibold text-xs text-text-primary">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-text-muted font-mono">
                    ID: {user.id}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-text-secondary">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold py-0.5 px-2 ${getRoleBadgeVariant(user.role)}`}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {/* Status badge: single green dot for ACTIVE, text-only for SUSPENDED */}
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell className="font-mono text-xs text-text-muted">
                  {formatDate(user.createdAt, "dd MMM yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(user.id)}
                    className="h-8 text-xs font-medium gap-1.5 hover:border-primary cursor-pointer"
                  >
                    {user.status === "ACTIVE" ? (
                      <>
                        <UserX
                          className="h-3.5 w-3.5 text-destructive"
                          aria-hidden="true"
                        />
                        Suspend
                      </>
                    ) : (
                      <>
                        <UserCheck
                          className="h-3.5 w-3.5 text-status"
                          aria-hidden="true"
                        />
                        Activate
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
