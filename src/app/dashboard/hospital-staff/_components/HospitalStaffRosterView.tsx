"use client";

import {
  AlertCircle,
  Edit2,
  Lock,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateHospitalStaff,
  useDeleteHospitalStaff,
  useGetHospitalStaff,
  useGetMyHospitalStaffProfile,
  useUpdateHospitalStaff,
} from "@/hooks";
import type { HospitalStaff } from "@/lib/types/hospital.types";

const SKELETON_ROWS = [
  "sk-roster-1",
  "sk-roster-2",
  "sk-roster-3",
  "sk-roster-4",
];

export function HospitalStaffRosterView() {
  const [search, setSearch] = useState("");
  const [filterOnShiftOnly, setFilterOnShiftOnly] = useState<boolean>(false);

  // Current authenticated staff profile
  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetMyHospitalStaffProfile();
  const currentStaff = profileResponse?.data;
  const hospital = currentStaff?.hospital;
  const hospitalId = hospital?.id;
  const canManageStaff = currentStaff?.canManageStaff ?? false;

  // Fetch hospital staff roster
  const {
    data: staffResponse,
    isLoading: isStaffLoading,
    refetch,
  } = useGetHospitalStaff(
    hospitalId,
    {
      search: search.trim() || undefined,
      isOnShift: filterOnShiftOnly ? true : undefined,
    },
    {
      enabled: Boolean(hospitalId),
    },
  );

  const staffList = staffResponse?.data ?? [];

  // Mutations
  const createStaffMutation = useCreateHospitalStaff();
  const updateStaffMutation = useUpdateHospitalStaff();
  const deleteStaffMutation = useDeleteHospitalStaff();

  // Add Dialog State
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addDesignation, setAddDesignation] = useState("Emergency Resident");
  const [addEmployeeId, setAddEmployeeId] = useState("");
  const [addCanManage, setAddCanManage] = useState(false);

  // Edit Dialog State
  const [editStaff, setEditStaff] = useState<HospitalStaff | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDesignation, setEditDesignation] = useState("");
  const [editEmployeeId, setEditEmployeeId] = useState("");
  const [editCanManage, setEditCanManage] = useState(false);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState<HospitalStaff | null>(null);

  // Open Edit Dialog
  const handleOpenEdit = (staff: HospitalStaff) => {
    setEditStaff(staff);
    setEditName(staff.user?.name || "");
    setEditPhone(staff.user?.phone || "");
    setEditDesignation(staff.designation || "");
    setEditEmployeeId(staff.employeeId || "");
    setEditCanManage(staff.canManageStaff);
  };

  // Submit Add Staff
  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalId) return;

    if (!addName.trim() || !addEmail.trim()) {
      toast.error("Validation Error", {
        description: "Name and email are required fields.",
      });
      return;
    }

    try {
      await createStaffMutation.mutateAsync({
        hospitalId,
        payload: {
          name: addName.trim(),
          email: addEmail.trim(),
          phone: addPhone.trim() || undefined,
          designation: addDesignation.trim() || undefined,
          employeeId: addEmployeeId.trim() || undefined,
          canManageStaff: addCanManage,
        },
      });

      toast.success("Staff Member Enrolled", {
        description: `${addName} added. Temporary login credentials dispatched via email.`,
      });

      setAddDialogOpen(false);
      setAddName("");
      setAddEmail("");
      setAddPhone("");
      setAddDesignation("Emergency Resident");
      setAddEmployeeId("");
      setAddCanManage(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create staff member";
      toast.error("Enrollment Failed", { description: msg });
    }
  };

  // Submit Edit Staff
  const handleEditStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalId || !editStaff) return;

    try {
      await updateStaffMutation.mutateAsync({
        hospitalId,
        staffId: editStaff.id,
        payload: {
          name: editName.trim() || undefined,
          phone: editPhone.trim() || undefined,
          designation: editDesignation.trim() || undefined,
          employeeId: editEmployeeId.trim() || null,
          canManageStaff: editCanManage,
        },
      });

      toast.success("Staff Details Updated", {
        description: `${editName || "Staff member"} updated successfully.`,
      });

      setEditStaff(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update staff member";
      toast.error("Update Failed", { description: msg });
    }
  };

  // Submit Delete Staff
  const handleDeleteStaffConfirm = async () => {
    if (!hospitalId || !deleteTarget) return;

    try {
      await deleteStaffMutation.mutateAsync({
        hospitalId,
        staffId: deleteTarget.id,
      });

      toast.success("Staff Member Removed", {
        description: `${deleteTarget.user?.name || "Staff member"} has been unassigned from this facility.`,
      });

      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to remove staff member";
      toast.error("Removal Failed", { description: msg });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital Clinical Staff Roster"
        description="Emergency medicine physicians, triage specialists, critical resuscitation nurses, and shift credentials."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/hospital-staff" },
          { label: "Staff Roster" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isStaffLoading}
              aria-label="Refresh clinical staff roster"
              className="h-10 text-xs px-3 rounded-none border-border hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1.5 ${isStaffLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            {canManageStaff && (
              <Button
                onClick={() => setAddDialogOpen(true)}
                aria-label="Add new clinician or nurse to department roster"
                className="min-h-10 bg-primary hover:bg-primary-dark text-white font-semibold text-xs px-4 rounded-none cursor-pointer shadow-xs gap-1.5"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Clinician
              </Button>
            )}
          </div>
        }
      />

      {/* Permission Notice if Read-Only Clinician */}
      {!canManageStaff && !isProfileLoading && (
        <div className="p-3 bg-slate-50 border border-slate-300 rounded-none text-xs text-text-secondary flex items-center gap-2">
          <Lock className="h-4 w-4 text-slate-500 shrink-0" />
          <span>
            You are logged in with clinical duty access. Staff additions,
            updates, and deletions require Department Manager privileges.
          </span>
        </div>
      )}

      {/* Search Bar & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-none shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by clinician name, designation, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs h-9 rounded-none border-border"
            aria-label="Search staff roster"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              id="filter-onshift"
              type="checkbox"
              checked={filterOnShiftOnly}
              onChange={(e) => setFilterOnShiftOnly(e.target.checked)}
              className="h-4 w-4 rounded-none accent-primary border-border cursor-pointer"
            />
            <Label
              htmlFor="filter-onshift"
              className="text-xs font-medium text-text-primary cursor-pointer"
            >
              On-Shift Clinicians Only
            </Label>
          </div>

          <div className="text-xs text-text-muted border-l border-border pl-4">
            Roster:{" "}
            <strong className="text-text-primary">{staffList.length}</strong>
          </div>
        </div>
      </div>

      {/* Staff Roster Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs sm:text-sm text-text-primary">
              Emergency Department Clinical Roster ({staffList.length})
            </span>
            <span className="text-xs text-text-muted font-mono truncate max-w-xs">
              {hospital?.name || "LifeDispatch ER"}
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Staff Clinician
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Designation &amp; Role
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Employee ID
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Contact Phone
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Duty Shift
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Privileges
              </TableHead>
              {canManageStaff && (
                <TableHead
                  scope="col"
                  className="text-xs font-semibold text-right"
                >
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isStaffLoading ? (
              SKELETON_ROWS.map((key) => (
                <TableRow key={key}>
                  <TableCell colSpan={canManageStaff ? 7 : 6} className="py-4">
                    <Skeleton className="h-6 w-full rounded-none" />
                  </TableCell>
                </TableRow>
              ))
            ) : staffList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={canManageStaff ? 7 : 6}
                  className="text-center py-10 text-xs text-text-muted space-y-1.5"
                >
                  <Users className="h-6 w-6 text-slate-300 mx-auto" />
                  <p className="font-medium">
                    No clinical staff records found matching your query.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Try adjusting search criteria or add new staff members.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              staffList.map((member) => (
                <TableRow
                  key={member.id}
                  className="hover:bg-slate-50/80 transition-colors text-xs"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 rounded-none border border-slate-200">
                        <AvatarFallback className="text-xs font-bold bg-primary-light text-primary rounded-none">
                          {(member.user?.name || "MD")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-bold text-text-primary block">
                          {member.user?.name || "Staff Clinician"}
                        </span>
                        <span className="text-[11px] text-text-muted truncate block">
                          {member.user?.email || "No email"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-medium text-text-primary">
                    <div className="flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{member.designation || "Emergency Clinician"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-mono text-text-secondary">
                    {member.employeeId || "—"}
                  </TableCell>

                  <TableCell className="text-xs font-mono text-text-secondary">
                    {member.user?.phone || "—"}
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      status={member.isOnShift ? "ON_SHIFT" : "OFF_SHIFT"}
                      variant="square"
                    />
                  </TableCell>

                  <TableCell>
                    {member.canManageStaff ? (
                      <Badge className="bg-purple-100 text-purple-900 border-purple-300 text-[10px] font-semibold flex items-center gap-1 w-fit">
                        <ShieldCheck className="h-3 w-3" />
                        Manager
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] text-text-muted border-border font-medium"
                      >
                        Clinician
                      </Badge>
                    )}
                  </TableCell>

                  {canManageStaff && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(member)}
                          aria-label={`Edit staff member ${member.user?.name || member.id}`}
                          className="h-7 px-2 text-xs border-border hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteTarget(member)}
                          aria-label={`Remove staff member ${member.user?.name || member.id}`}
                          className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DataTable>

      {/* Add Staff Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md rounded-none border-2 border-primary">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary-light text-primary rounded-none">
                <Users className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  Enroll Clinical Staff Member
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Provision an emergency trauma clinician or nurse to{" "}
                  {hospital?.name}.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleAddStaffSubmit} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label htmlFor="add-name" className="text-xs font-bold">
                Clinician Full Name *
              </Label>
              <Input
                id="add-name"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="Dr. Tanvir Rahman"
                className="text-xs h-9 rounded-none border-border"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="add-email" className="text-xs font-bold">
                Institutional Email Address *
              </Label>
              <Input
                id="add-email"
                type="email"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                placeholder="tanvir.rahman@hospital.org"
                className="text-xs h-9 rounded-none border-border font-mono"
                required
              />
              <span className="text-[11px] text-text-muted">
                Temporary login password and verification link will be emailed.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="add-designation" className="text-xs font-bold">
                  Clinical Designation
                </Label>
                <Input
                  id="add-designation"
                  value={addDesignation}
                  onChange={(e) => setAddDesignation(e.target.value)}
                  placeholder="Trauma Resident"
                  className="text-xs h-9 rounded-none border-border"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="add-empid" className="text-xs font-bold">
                  Employee ID
                </Label>
                <Input
                  id="add-empid"
                  value={addEmployeeId}
                  onChange={(e) => setAddEmployeeId(e.target.value)}
                  placeholder="EMP-9022"
                  className="text-xs h-9 rounded-none border-border font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="add-phone" className="text-xs font-bold">
                Contact Phone
              </Label>
              <Input
                id="add-phone"
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
                placeholder="+880 1711-000000"
                className="text-xs h-9 rounded-none border-border font-mono"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                id="add-manage"
                type="checkbox"
                checked={addCanManage}
                onChange={(e) => setAddCanManage(e.target.checked)}
                className="h-4 w-4 rounded-none accent-primary border-border cursor-pointer"
              />
              <Label
                htmlFor="add-manage"
                className="text-xs font-semibold text-text-primary cursor-pointer"
              >
                Grant Department Staff Management Privileges
              </Label>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                className="text-xs min-h-9 rounded-none cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createStaffMutation.isPending}
                className="bg-primary hover:bg-primary-dark text-white text-xs min-h-9 rounded-none cursor-pointer font-bold"
              >
                {createStaffMutation.isPending
                  ? "Provisioning..."
                  : "Enroll Clinician"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog
        open={Boolean(editStaff)}
        onOpenChange={(open) => !open && setEditStaff(null)}
      >
        <DialogContent className="max-w-md rounded-none border-2 border-primary">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Update Clinician Record
            </DialogTitle>
            <DialogDescription className="text-xs">
              Modify clinical role, contact phone, or manage permissions for{" "}
              {editStaff?.user?.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditStaffSubmit} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label htmlFor="edit-name" className="text-xs font-bold">
                Clinician Name
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-xs h-9 rounded-none border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-designation" className="text-xs font-bold">
                  Designation
                </Label>
                <Input
                  id="edit-designation"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="text-xs h-9 rounded-none border-border"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-empid" className="text-xs font-bold">
                  Employee ID
                </Label>
                <Input
                  id="edit-empid"
                  value={editEmployeeId}
                  onChange={(e) => setEditEmployeeId(e.target.value)}
                  className="text-xs h-9 rounded-none border-border font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-phone" className="text-xs font-bold">
                Contact Phone
              </Label>
              <Input
                id="edit-phone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="text-xs h-9 rounded-none border-border font-mono"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                id="edit-manage"
                type="checkbox"
                checked={editCanManage}
                onChange={(e) => setEditCanManage(e.target.checked)}
                className="h-4 w-4 rounded-none accent-primary border-border cursor-pointer"
              />
              <Label
                htmlFor="edit-manage"
                className="text-xs font-semibold text-text-primary cursor-pointer"
              >
                Department Staff Management Privileges
              </Label>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditStaff(null)}
                className="text-xs min-h-9 rounded-none cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateStaffMutation.isPending}
                className="bg-primary hover:bg-primary-dark text-white text-xs min-h-9 rounded-none cursor-pointer font-bold"
              >
                {updateStaffMutation.isPending
                  ? "Saving Changes..."
                  : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-md rounded-none border-2 border-red-500">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle className="text-base font-bold">
                Confirm Staff Removal
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs pt-1 text-text-primary">
              Are you sure you want to remove{" "}
              <strong>{deleteTarget?.user?.name || "this clinician"}</strong>{" "}
              from the {hospital?.name} ER roster?
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-red-700 bg-red-50 p-3 border border-red-200">
            This action revokes ER duty privileges. Note that a hospital must
            maintain at least one active staff member at all times.
          </p>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="text-xs min-h-9 rounded-none cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={deleteStaffMutation.isPending}
              onClick={handleDeleteStaffConfirm}
              className="bg-red-600 hover:bg-red-700 text-white text-xs min-h-9 rounded-none cursor-pointer font-bold"
            >
              {deleteStaffMutation.isPending
                ? "Removing..."
                : "Remove Staff Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const HospitalStaffManagementView = HospitalStaffRosterView;
