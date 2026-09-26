"use client";

import {
  Building2,
  Mail,
  Phone,
  Plus,
  Search,
  Shield,
  Stethoscope,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { UserRole } from "@/lib/types/enums";

interface HospitalStaffMember {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  phone: string;
  shift: string;
  avatarUrl?: string;
  status: string;
}

const INITIAL_STAFF: HospitalStaffMember[] = [
  {
    id: "hstaff_001",
    name: "Dr. Rafiqul Islam",
    roleTitle: "Chief of Emergency Medicine",
    department: "Trauma Resuscitation",
    phone: "+880 1711-000006",
    shift: "Day Shift (08:00 - 20:00)",
    avatarUrl:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
  {
    id: "hstaff_002",
    name: "Dr. Naila Zaman",
    roleTitle: "Emergency Trauma Surgeon",
    department: "Acute Surgical Unit",
    phone: "+880 1711-334455",
    shift: "Day Shift (08:00 - 20:00)",
    avatarUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
  {
    id: "hstaff_003",
    name: "Sister Anowara Begum",
    roleTitle: "Head Triage Nurse",
    department: "ER Reception & Triage",
    phone: "+880 1819-223344",
    shift: "Day Shift (08:00 - 20:00)",
    avatarUrl:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
  {
    id: "hstaff_004",
    name: "Dr. Shafiul Alam",
    roleTitle: "Critical Care Resuscitation Specialist",
    department: "ICU / Ventilator",
    phone: "+880 1912-887766",
    shift: "Night Shift (20:00 - 08:00)",
    avatarUrl:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
  {
    id: "hstaff_005",
    name: "Mahmud Hasan",
    roleTitle: "Emergency Radiographer",
    department: "Trauma CT & X-Ray",
    phone: "+880 1712-445566",
    shift: "Day Shift (08:00 - 20:00)",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE",
  },
];

export function HospitalStaffRosterView() {
  const [staffList, setStaffList] =
    useState<HospitalStaffMember[]>(INITIAL_STAFF);
  const [search, setSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Add staff form state
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Trauma Resident");
  const [newDept, setNewDept] = useState("Trauma Resuscitation");
  const [newPhone, setNewPhone] = useState("+880 17");
  const [newShift, setNewShift] = useState("Day Shift (08:00 - 20:00)");

  const handleRemoveStaff = (id: string, name: string) => {
    setStaffList((prev) => prev.filter((staff) => staff.id !== id));
    toast.success("Staff Member Removed", {
      description: `${name} unassigned from the ER clinical roster.`,
    });
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMember: HospitalStaffMember = {
      id: `hstaff_${Date.now()}`,
      name: newName || "Dr. Tanvir Rahman",
      roleTitle: newRole,
      department: newDept,
      phone: newPhone,
      shift: newShift,
      status: "ACTIVE",
    };

    setStaffList((prev) => [newMember, ...prev]);
    toast.success("Staff Member Added", {
      description: `${newMember.name} provisioned to ${newDept}.`,
    });

    setAddDialogOpen(false);
    setNewName("");
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const searchTerms = [s.name, s.roleTitle, s.department, s.phone]
        .join(" ")
        .toLowerCase();
      return searchTerms.includes(search.toLowerCase());
    });
  }, [staffList, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital Clinical Staff Roster"
        description="Emergency trauma physicians, triage specialists, critical resuscitation nurses, and active shift assignments."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/hospital-staff" },
          { label: "Staff Roster" },
        ]}
        action={
          <Button
            onClick={() => setAddDialogOpen(true)}
            aria-label="Add new staff member to ER roster"
            className="min-h-[44px] bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-5 cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Add Staff Member
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 border border-border rounded-xl shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by clinician name, specialty, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-base md:text-xs h-10 md:h-9"
            aria-label="Search staff roster"
          />
        </div>

        <div className="text-xs text-text-muted">
          Active Clinicians:{" "}
          <strong className="text-text-primary">{filteredStaff.length}</strong>
        </div>
      </div>

      {/* Staff Roster Table */}
      <DataTable
        headerSlot={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-sm text-text-primary">
              Emergency Department Staff ({filteredStaff.length})
            </span>
            <span className="text-xs text-text-muted">
              Dhaka Medical College Hospital • ER Division
            </span>
          </div>
        }
      >
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead scope="col" className="text-xs font-semibold">
                Staff Clinician
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Specialty &amp; Unit
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Shift Assignment
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Contact Phone
              </TableHead>
              <TableHead scope="col" className="text-xs font-semibold">
                Status
              </TableHead>
              <TableHead
                scope="col"
                className="text-xs font-semibold text-right"
              >
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-xs text-text-muted"
                >
                  No staff members found matching this search.
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((staff) => (
                <TableRow
                  key={staff.id}
                  className="hover:bg-primary-light/20 transition-colors"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {staff.avatarUrl && (
                          <AvatarImage src={staff.avatarUrl} alt={staff.name} />
                        )}
                        <AvatarFallback className="text-xs font-semibold bg-primary-light text-primary">
                          {staff.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-semibold text-xs text-text-primary block">
                          {staff.name}
                        </span>
                        <span className="text-[11px] text-text-secondary">
                          {staff.roleTitle}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                      <span>{staff.department}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-text-secondary font-mono">
                    {staff.shift}
                  </TableCell>

                  <TableCell className="text-xs text-text-secondary font-mono">
                    {staff.phone}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={staff.status} />
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveStaff(staff.id, staff.name)}
                      aria-label={`Remove staff member ${staff.name}`}
                      className="h-7 px-2.5 text-xs text-destructive border-destructive/30 hover:bg-destructive-bg cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DataTable>

      {/* Add Staff Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-light text-primary">
                <Users className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <DialogTitle>Provision Hospital Staff</DialogTitle>
                <DialogDescription>
                  Assign a clinician or nurse to the Emergency Department roster.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleAddStaffSubmit} className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <Label htmlFor="staff-name" className="text-xs font-medium">
                Clinician Full Name *
              </Label>
              <Input
                id="staff-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Dr. Tanvir Rahman"
                className="text-xs h-9"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="staff-role" className="text-xs font-medium">
                  Clinical Role *
                </Label>
                <Input
                  id="staff-role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Trauma Resident"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="staff-dept" className="text-xs font-medium">
                  Department *
                </Label>
                <Select
                  value={newDept}
                  onValueChange={(val) => val && setNewDept(val)}
                >
                  <SelectTrigger id="staff-dept" className="text-xs h-9">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trauma Resuscitation">
                      Trauma Resuscitation
                    </SelectItem>
                    <SelectItem value="Acute Surgical Unit">
                      Acute Surgical Unit
                    </SelectItem>
                    <SelectItem value="ER Reception & Triage">
                      ER Reception &amp; Triage
                    </SelectItem>
                    <SelectItem value="ICU / Ventilator">
                      ICU / Ventilator
                    </SelectItem>
                    <SelectItem value="Pediatric Emergency">
                      Pediatric Emergency
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="staff-phone" className="text-xs font-medium">
                  Contact Phone *
                </Label>
                <Input
                  id="staff-phone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+880 1711-000000"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="staff-shift" className="text-xs font-medium">
                  Shift Schedule *
                </Label>
                <Select
                  value={newShift}
                  onValueChange={(val) => val && setNewShift(val)}
                >
                  <SelectTrigger id="staff-shift" className="text-xs h-9">
                    <SelectValue placeholder="Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Day Shift (08:00 - 20:00)">
                      Day Shift (08:00 - 20:00)
                    </SelectItem>
                    <SelectItem value="Night Shift (20:00 - 08:00)">
                      Night Shift (20:00 - 08:00)
                    </SelectItem>
                    <SelectItem value="On-Call Emergency">
                      On-Call Emergency
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                className="text-xs min-h-[40px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white text-xs min-h-[40px] cursor-pointer font-medium"
              >
                Enroll Staff Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
