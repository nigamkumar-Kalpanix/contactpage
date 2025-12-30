"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import type { Contact } from "@/data/contacts-mock";
import {
  getContactByIdApi,
  updateContactApi,
  deleteContactApi,
  mapFormToContactPayload,
  getLocationOptionsApi,
  getDepartmentOptionsApi,
} from "@/services/contacts-api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type ContactFormValues = Omit<Contact, "id">;

type SelectOption = {
  label: string;
  value: number | string;
};

export default function ContactPreviewPage() {
  const params = useParams<{ contactId: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Dropdown options
  const [locationOptions, setLocationOptions] = useState<SelectOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<SelectOption[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  const contactId = params.contactId;

  // 1) Load contact by id
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getContactByIdApi(contactId);
        setContact(data);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ?? "Failed to load contact.";
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [contactId, toast]);

  // 2) Load dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLocationsLoading(true);
        const locations = await getLocationOptionsApi();
        setLocationOptions(locations);
      } catch (err) {
        console.error("Failed to load locations");
      } finally {
        setLocationsLoading(false);
      }

      try {
        setDepartmentsLoading(true);
        const departments = await getDepartmentOptionsApi();
        setDepartmentOptions(departments);
      } catch (err) {
        console.error("Failed to load departments");
      } finally {
        setDepartmentsLoading(false);
      }
    };

    loadOptions();
  }, []);

  const handleChange = (field: keyof ContactFormValues, value: any) => {
    if (!contact) return;
    setContact({ ...contact, [field]: value });
  };

  // Save updated contact
  const handleSave = async () => {
    if (!contact) return;
    setSaving(true);
    try {
      const payload = mapFormToContactPayload(contact as any); // Cast for optional fields
      await updateContactApi(contact.id, payload);
      toast({
        title: "Success",
        description: "Contact updated successfully.",
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Failed to update contact.";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete contact
  const handleDelete = async () => {
    if (!contact) return;
    try {
      await deleteContactApi(contact.id);
      toast({
        title: "Success",
        description: "Contact deleted successfully.",
      });
      router.push("/contacts");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Failed to delete contact.";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading contact...</div>;
  }

  if (!contact) {
    return <div className="p-6">Contact not found.</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Details</h1>
          <p className="text-sm text-muted-foreground">ID: {contact.id}</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/contacts")}>
          Back to Contacts
        </Button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={contact.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={contact.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Mobile No</Label>
            <Input
              id="phone"
              value={contact.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              value={contact.employeeId}
              onChange={(e) => handleChange("employeeId", e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deskNo">Desk No</Label>
            <Input
              id="deskNo"
              value={contact.deskNo}
              onChange={(e) => handleChange("deskNo", e.target.value)}
              className="h-10"
            />
          </div>

          {/* FIXED: Location dropdown - uses locationId */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select
              value={contact.locationId || ""}
              onValueChange={(value) => handleChange("locationId", value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={locationsLoading ? "Loading..." : "Select location"} />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {contact.locationName && (
              <p className="text-xs text-muted-foreground">
                Current: {contact.locationName}
              </p>
            )}
          </div>

          {/* FIXED: Department dropdown - uses departmentId */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={contact.departmentId || ""}
              onValueChange={(value) => handleChange("departmentId", value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={departmentsLoading ? "Loading..." : "Select department"} />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {contact.departmentName && (
              <p className="text-xs text-muted-foreground">
                Current: {contact.departmentName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="text-sm text-muted-foreground font-medium">{contact.status}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} disabled={saving} className="flex-1">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          variant="destructive"
          onClick={() => setConfirmDelete(true)}
          className="px-6"
        >
          Delete
        </Button>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 space-y-4 max-w-sm w-full max-w-md">
            <div>
              <h3 className="font-semibold text-lg">Delete Contact?</h3>
              <p className="text-sm text-muted-foreground">
                This will permanently remove "{contact.name}"
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}